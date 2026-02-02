'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid, GridCol, Select, Textarea, TextInput } from '@mantine/core';
import type { Dispatch, SetStateAction } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import { categoriesMaterial } from '~/constants';
import { createTag } from '~/lib/FuncHandler/generateTag';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { materialSchema } from '~/lib/ZodSchema/schema';
import { api } from '~/trpc/react';
import { MaterialClientType } from '~/types';

export default function CreateMaterial({ setOpened }: { setOpened: Dispatch<SetStateAction<boolean>> }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<MaterialClientType>({
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
  const mutation = api.Material.create.useMutation({
    onSuccess: result => {
      if (result.code !== 'OK') {
        NotifyError(result.message);
        utils.Material.invalidate();
        return;
      }
      setOpened(false);
      NotifySuccess(result.message);
      setOpened(false);
    },
    onError: e => {
      NotifyError(e?.message || 'Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  });

  const onSubmit: SubmitHandler<MaterialClientType> = async formData => {
    try {
      await mutation.mutateAsync({
        ...formData,
        tag: createTag(formData.name)
      });
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
        Cập nhật
      </BButton>
    </form>
  );
}
