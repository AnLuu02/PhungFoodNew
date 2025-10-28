'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid, GridCol, Select, Textarea, TextInput } from '@mantine/core';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import { categoriesMaterial } from '~/constants';
import { createTag } from '~/lib/FuncHandler/generateTag';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { materialSchema } from '~/lib/ZodSchema/schema';
import { api } from '~/trpc/react';
import { Material } from '~/types/material';

export default function UpdateMaterial({
  materialId,
  setOpened
}: {
  materialId: string;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const queryResult = api.Material.getOne.useQuery({ s: materialId || '' }, { enabled: !!materialId });
  const { data } = queryResult;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset
  } = useForm<Material>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      id: '',
      name: '',
      category: '',
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
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  const onSubmit: SubmitHandler<Material> = async formData => {
    if (materialId) {
      const result = await updateMutation.mutateAsync({
        ...formData,
        tag: createTag(formData.name)
      });
      setOpened(false);
      if (result.code === 'OK') {
        NotifySuccess(result.message);
        return;
      }
      NotifyError(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid gutter='md'>
        <GridCol span={6}>
          <Controller
            control={control}
            name='name'
            render={({ field }) => (
              <TextInput
                {...field}
                label='Tên nguyên liệu'
                size='sm'
                radius={'md'}
                placeholder='Nhập tên nguyên liệu'
                error={errors.name?.message}
              />
            )}
          />
        </GridCol>

        <GridCol span={6}>
          <Controller
            control={control}
            name='category'
            render={({ field }) => (
              <Select
                label='Loại nguyên liệu'
                radius='md'
                placeholder='Chọn loại nguyên liệu'
                searchable
                data={categoriesMaterial?.map(category => ({
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
        </GridCol>
        <GridCol span={12}>
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
        </GridCol>
      </Grid>
      <BButton type='submit' className='mt-4' loading={isSubmitting} fullWidth disabled={!isDirty}>
        Tạo mới
      </BButton>
    </form>
  );
}
