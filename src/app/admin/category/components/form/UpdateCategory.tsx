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
  const queryResult = categoryId ? api.Category.getFilter.useQuery({ query: categoryId || '' }) : { data: null };
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

  const nameValue = watch('name', '');
  useEffect(() => {
    const generatedTag = createTag(nameValue);
    setValue('tag', generatedTag);
  }, [nameValue, setValue]);

  useEffect(() => {
    if (data && data.length > 0) {
      reset({
        id: data?.[0]?.id,
        name: data?.[0]?.name,
        tag: data?.[0]?.tag,
        description: data?.[0]?.description || ''
      });
    }
  }, [data, reset]);

  const utils = api.useUtils();
  const updateMutation = api.Category.update.useMutation();

  const onSubmit: SubmitHandler<Category> = async formData => {
    if (categoryId) {
      const updatedFormData = { ...formData };
      let result = await updateMutation.mutateAsync({ categoryId, ...updatedFormData });
      if (result.success) {
        NotifySuccess(result.message);
        setOpened(false);
        utils.Category.invalidate();
      } else {
        NotifyError(result.message);
      }
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
                size='sm'
                label='Tên danh mục'
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
                error={errors.name?.message}
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
