'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid, GridCol, Switch, Textarea, TextInput } from '@mantine/core';
import type { Dispatch, SetStateAction } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import { createTag } from '~/lib/FuncHandler/generateTag';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { categorySchema } from '~/lib/ZodSchema/schema';
import { api } from '~/trpc/react';
import { Category } from '~/types/category';

export default function CreateCategory({ setOpened }: { setOpened: Dispatch<SetStateAction<boolean>> }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<Category>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      id: '',
      isActive: true,
      name: '',
      tag: '',
      description: ''
    }
  });

  const utils = api.useUtils();
  const mutation = api.Category.create.useMutation({
    onSuccess: data => {
      if (data.code === 'OK') {
        utils.Category.invalidate();
        NotifySuccess(data.message);
        setOpened(false);
        return;
      }
      NotifyError(data.message);
    },
    onError: err => {
      NotifyError(err.message);
    }
  });

  const onSubmit: SubmitHandler<Category> = async formData => {
    try {
      if (formData) {
        await mutation.mutateAsync({
          ...formData,
          tag: createTag(formData.name)
        });
      }
    } catch {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid gutter='md'>
        <GridCol span={12}>
          <Controller
            control={control}
            name='name'
            render={({ field }) => (
              <TextInput
                {...field}
                label='Tên danh mục'
                size='sm'
                radius={'md'}
                placeholder='Nhập tên danh mục'
                error={errors.name?.message}
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
        <GridCol span={6}>
          <Controller
            control={control}
            name='isActive'
            render={({ field }) => (
              <Switch
                checked={field.value}
                onChange={event => field.onChange(event.currentTarget.checked)}
                onBlur={field.onBlur}
                name={field.name}
                size='sm'
                label='Tình trạng'
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
