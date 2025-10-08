'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, GridCol, Switch, Textarea, TextInput } from '@mantine/core';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { createTag } from '~/lib/func-handler/generateTag';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { categorySchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { Category } from '~/types/category';

export default function UpdateCategory({
  categoryId,
  setOpened
}: {
  categoryId: string;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const queryResult = api.Category.getOne.useQuery({ s: categoryId || '' }, { enabled: !!categoryId });
  const { data } = queryResult;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset
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

  useEffect(() => {
    if (data?.id) {
      reset({
        id: data?.id,
        name: data?.name,
        isActive: data?.isActive || false,
        tag: data?.tag,
        description: data?.description || ''
      });
    }
  }, [data, reset]);

  const utils = api.useUtils();
  const updateMutation = api.Category.update.useMutation({
    onSuccess: result => {
      if (result.code === 'OK') {
        setOpened(false);
        utils.Category.invalidate();
        NotifySuccess(result.message);
      }
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  const onSubmit: SubmitHandler<Category> = async formData => {
    if (categoryId) {
      await updateMutation.mutateAsync({
        where: {
          id: categoryId
        },
        data: {
          ...formData,
          tag: createTag(formData.name)
        }
      });
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
                size='sm'
                label='Tên danh mục'
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
              <Textarea size='sm' label='Mô tả' placeholder='Nhập mô tả' error={errors.name?.message} {...field} />
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
      <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth disabled={!isDirty}>
        Cập nhật
      </Button>
    </form>
  );
}
