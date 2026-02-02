'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid, Textarea, TextInput } from '@mantine/core';
import type { Dispatch, SetStateAction } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { permissionSchema } from '~/lib/ZodSchema/schema';
import { api } from '~/trpc/react';
import { PermissionClientType } from '~/types';

export default function CreatePermission({ setOpened }: { setOpened: Dispatch<SetStateAction<boolean>> }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<PermissionClientType>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });

  const utils = api.useUtils();
  const createPermissionMutation = api.RolePermission.createPermission.useMutation({
    onSuccess: () => {
      utils.RolePermission.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  const onSubmit: SubmitHandler<PermissionClientType> = async formData => {
    try {
      const result = await createPermissionMutation.mutateAsync(formData);
      if (result) {
        NotifySuccess('Tạo vai trò thành công');
        setOpened(false);
        utils.RolePermission.invalidate();
      }
    } catch {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid gutter='md'>
        <Grid.Col span={12}>
          <Controller
            control={control}
            name='name'
            render={({ field }) => (
              <TextInput
                {...field}
                label='Tên quyền '
                size='sm'
                radius='md'
                placeholder='vd: create:user or update:user or delete:user or ...'
                error={errors.name?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Controller
            control={control}
            name='viName'
            render={({ field }) => (
              <TextInput
                {...field}
                label='Tên phiên âm vai trò'
                size='sm'
                radius='md'
                placeholder='vd: Cập nhật sản phẩm'
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
                {...field}
                label='Mô tả'
                size='sm'
                placeholder='vd: Quyền cho phép cập nhật sản phẩm'
                error={errors.name?.message}
              />
            )}
          />
        </Grid.Col>
      </Grid>
      <BButton type='submit' className='mt-4' loading={isSubmitting} disabled={!isDirty} fullWidth>
        Tạo mới
      </BButton>
    </form>
  );
}
