'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, Textarea, TextInput } from '@mantine/core';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { createTag } from '~/lib/func-handler/generateTag';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { categorySchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { Category } from '~/types/category';

export default function CreateCategory({ setOpened }: { setOpened: any }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<Category>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      id: '',
      name: '',
      tag: '',
      description: ''
    }
  });

  const utils = api.useUtils();
  const mutation = api.Category.create.useMutation({
    onSuccess: () => {
      utils.Category.invalidate();
    }
  });

  const onSubmit: SubmitHandler<Category> = async formData => {
    try {
      if (formData) {
        let result = await mutation.mutateAsync({
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
    } catch (error) {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
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
                label='Tên danh mục'
                size='sm'
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
