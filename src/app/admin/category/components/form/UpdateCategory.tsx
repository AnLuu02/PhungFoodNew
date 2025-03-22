'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, Textarea, TextInput } from '@mantine/core';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Category } from '~/app/Entity/CategoryEntity';
import { createTag } from '~/app/lib/utils/func-handler/generateTag';
import { NotifyError, NotifySuccess } from '~/app/lib/utils/func-handler/toast';
import { categorySchema } from '~/app/lib/utils/zod/zodShcemaForm';
import { api } from '~/trpc/react';

export default function UpdateCategory({ categoryId, setOpened }: { categoryId: string; setOpened: any }) {
  const queryResult = categoryId ? api.Category.getOne.useQuery({ s: categoryId || '' }) : { data: null };
  const { data } = queryResult;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm<Category>({
    resolver: zodResolver(categorySchema),
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
        description: data?.description || ''
      });
    }
  }, [data, reset]);

  const utils = api.useUtils();
  const updateMutation = api.Category.update.useMutation({
    onSuccess: () => {
      utils.Category.invalidate();
    }
  });

  const onSubmit: SubmitHandler<Category> = async formData => {
    if (categoryId) {
      let result = await updateMutation.mutateAsync({
        where: {
          id: categoryId
        },
        data: {
          ...formData,
          tag: createTag(formData.name)
        }
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
                size='sm'
                label='Tên danh mục'
                placeholder='Nhập tên danh mục'
                error={errors.name?.message}
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Controller
            control={control}
            name='description'
            render={({ field }) => (
              <Textarea size='sm' label='Mô tả' placeholder='Nhập mô tả' error={errors.name?.message} {...field} />
            )}
          />
        </Grid.Col>
      </Grid>
      <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth>
        Cập nhật
      </Button>
    </form>
  );
}
