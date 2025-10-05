'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, GridCol, Select, Textarea, TextInput } from '@mantine/core';
import type { Dispatch, SetStateAction } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { categoriesMaterial } from '~/constants';
import { createTag } from '~/lib/func-handler/generateTag';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { materialSchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { Material } from '~/types/material';

export default function CreateMaterial({ setOpened }: { setOpened: Dispatch<SetStateAction<boolean>> }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<Material>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      id: '',
      name: '',
      tag: '',
      description: '',
      category: ''
    }
  });

  const utils = api.useUtils();
  const mutation = api.Material.create.useMutation();

  const onSubmit: SubmitHandler<Material> = async formData => {
    try {
      const result = await mutation.mutateAsync({
        ...formData,
        tag: createTag(formData.name)
      });
      if (result.code !== 'OK') {
        NotifyError(result.message);
        utils.Material.invalidate();
        return;
      }
      setOpened(false);
      NotifySuccess(result.message);
    } catch {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
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
      <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth disabled={!isDirty}>
        Cập nhật
      </Button>
    </form>
  );
}
