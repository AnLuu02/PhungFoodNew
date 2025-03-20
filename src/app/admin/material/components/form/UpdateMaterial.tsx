'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, Select, Textarea, TextInput } from '@mantine/core';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Material } from '~/app/Entity/MaterialEntity';
import { createTag } from '~/app/lib/utils/func-handler/generateTag';
import { NotifyError, NotifySuccess } from '~/app/lib/utils/func-handler/toast';
import { materialSchema } from '~/app/lib/utils/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { categories } from './CreateMaterial';

export default function UpdateMaterial({ materialId, setOpened }: { materialId: string; setOpened: any }) {
  const queryResult = materialId ? api.Material.getOne.useQuery({ query: materialId || '' }) : { data: null };
  const { data } = queryResult;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm<Material>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      id: '',
      name: '',
      tag: '',
      description: ''
    }
  });

  useEffect(() => {
    if (data?.id) {
      reset({
        id: data?.id,
        name: data?.name,
        tag: data?.tag,
        description: data?.description || '',
        category: data?.category
      });
    }
  }, [data, reset]);

  const utils = api.useUtils();
  const updateMutation = api.Material.update.useMutation({
    onSuccess: () => {
      utils.Material.invalidate();
    }
  });

  const onSubmit: SubmitHandler<Material> = async formData => {
    if (materialId) {
      let result = await updateMutation.mutateAsync({
        ...formData,
        tag: createTag(formData.name)
      });
      setOpened(false);
      if (!result.success) {
        NotifyError(result.message);
        return;
      }
      NotifySuccess(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid gutter='md'>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='name'
            render={({ field }) => (
              <TextInput
                {...field}
                label='Tên nguyên liệu'
                size='sm'
                placeholder='Nhập tên nguyên liệu'
                error={errors.name?.message}
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <Controller
            control={control}
            name='category'
            render={({ field }) => (
              <Select
                label='Loại nguyên liệu'
                placeholder='Chọn loại nguyên liệu'
                searchable
                data={categories?.map(category => ({
                  value: category.value,
                  label: category.label
                }))}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.category?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Controller
            control={control}
            name='description'
            render={({ field }) => (
              <Textarea
                size='sm'
                label='Mô tả'
                placeholder='Nhập mô tả'
                error={errors.description?.message}
                {...field}
              />
            )}
          />
        </Grid.Col>
      </Grid>
      <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth>
        Tạo mới
      </Button>
    </form>
  );
}
