'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, Select, Textarea, TextInput } from '@mantine/core';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Material } from '~/app/Entity/MaterialEntity';
import { createTag } from '~/app/lib/utils/func-handler/generateTag';
import { NotifyError, NotifySuccess } from '~/app/lib/utils/func-handler/toast';
import { materialSchema } from '~/app/lib/utils/zod/zodShcemaForm';
import { api } from '~/trpc/react';

export const categories = [
  {
    value: 'thit-tuoi',
    label: 'Thịt tươi'
  },
  {
    value: 'hai-san',
    label: 'Hải sản'
  },
  {
    value: 'rau-cu',
    label: 'Rau củ'
  },
  {
    value: 'cac-loai-nam',
    label: 'Các loại nấm'
  },
  {
    value: 'thuc-pham-chay',
    label: 'Thực phẩm chay'
  }
];

export default function CreateMaterial({ setOpened }: { setOpened: any }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
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
  const mutation = api.Material.create.useMutation({
    onSuccess: () => {
      utils.Material.invalidate();
    }
  });

  const onSubmit: SubmitHandler<Material> = async formData => {
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
                label='Tên nguyên liệu'
                size='sm'
                placeholder='Nhập tên nguyên liệu'
                error={errors.name?.message}
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <Controller
            control={control}
            name='category'
            render={({ field }) => (
              <Select
                label='Loại nguyên liệu'
                placeholder='Chọn loại nguyên liệu'
                searchable
                data={categories?.map(category => ({
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
        Cập nhật
      </Button>
    </form>
  );
}
