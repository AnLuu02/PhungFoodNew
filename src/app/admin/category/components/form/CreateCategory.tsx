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

export default function CreateCategory({ setOpened }: { setOpened: any }) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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

  const nameValue = watch('name', '');
  useEffect(() => {
    const generatedTag = createTag(nameValue);
    setValue('tag', generatedTag);
  }, [nameValue, setValue]);

  const utils = api.useUtils();
  const mutation = api.Category.create.useMutation();

  const onSubmit: SubmitHandler<Category> = async formData => {
    try {
      if (formData) {
        let result = await mutation.mutateAsync(formData);
        if (result.success) {
          NotifySuccess(result.message);
          setOpened(false);
          utils.Category.invalidate();
        } else {
          NotifyError(result.message);
        }
      }
    } catch (error) {
      NotifyError('Error created Category');
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
                label='Tên danh mục'
                size='sm'
                placeholder='Nhập tên danh mục'
                error={errors.name?.message}
                {...field}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='tag'
            render={({ field }) => (
              <TextInput
                size='sm'
                readOnly
                label='Tag'
                placeholder='Sẽ tạo tự động'
                error={errors.tag?.message}
                {...field}
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
