'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid, GridCol, Select, Textarea, TextInput } from '@mantine/core';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import { categoryMaterials } from '~/constants';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { baseMaterialSchema, MaterialInput } from '~/shared/schema/material.schema';
import { api } from '~/trpc/react';

export default function MaterialUpsert({
  materialId,
  setOpened
}: {
  materialId?: string;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const queryResult = api.Material.getOne.useQuery({ s: materialId || '' }, { enabled: !!materialId });
  const { data } = queryResult;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset
  } = useForm<MaterialInput>({
    resolver: zodResolver(baseMaterialSchema),
    defaultValues: {
      id: undefined,
      name: '',
      category: '',
      tag: '',
      description: ''
    }
  });
  useEffect(() => {
    if (data?.id) {
      reset({
        id: data?.id || '',
        name: data?.name,
        tag: data?.tag || '',
        description: data?.description || '',
        category: data?.category
      });
    }
  }, [data, reset]);

  const utils = api.useUtils();
  const updateMutation = api.Material.upsert.useMutation({
    onSuccess: () => {
      setOpened(false);
      NotifySuccess('Chúc mừng bạn đã thao tác thành công.');
      utils.Material.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  const onSubmit: SubmitHandler<MaterialInput> = async formData => {
    await updateMutation.mutateAsync(formData);
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
                data={Object.entries(categoryMaterials)?.map(([value, label]) => ({
                  value,
                  label
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
