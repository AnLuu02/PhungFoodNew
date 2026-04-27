'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, GridCol, Switch, Textarea, TextInput } from '@mantine/core';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { baseCategorySchema, CategoryInput } from '~/shared/schema/category.schema';
import { api } from '~/trpc/react';

export default function CategoryUpsert({
  categoryId,
  setOpened
}: {
  categoryId?: string;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const queryResult = api.Category.getOne.useQuery({ s: categoryId || '' }, { enabled: !!categoryId });
  const { data } = queryResult;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty },
    reset
  } = useForm<CategoryInput>({
    resolver: zodResolver(baseCategorySchema),
    defaultValues: {
      id: undefined,
      isActive: true,
      name: '',
      tag: undefined,
      description: ''
    }
  });
  useEffect(() => {
    if (data?.id) {
      reset({
        id: data.id,
        name: data?.name,
        isActive: data?.isActive || false,
        tag: data?.tag,
        description: data?.description || ''
      });
    }
  }, [data, reset]);

  const utils = api.useUtils();
  const updateMutation = api.Category.upsert.useMutation({
    onSuccess: () => {
      setOpened(false);
      utils.Category.invalidate();
      NotifySuccess('Chúc mừng bạn thực hiện thao tác thành công.');
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  const onSubmit: SubmitHandler<CategoryInput> = async formData => {
    await updateMutation.mutateAsync(formData);
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
      <Button type='submit' className='mt-4' loading={isSubmitting} fullWidth disabled={!isDirty}>
        Tạo mới / Cập nhật
      </Button>
    </form>
  );
}
