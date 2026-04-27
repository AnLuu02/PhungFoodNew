'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, Textarea, TextInput } from '@mantine/core';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { basePermissionSchema, PermissionInput } from '~/shared/schema/permission.schema';
import { api } from '~/trpc/react';

export default function PermissionUpsert({
  setOpened,
  permissionId
}: {
  setOpened: Dispatch<SetStateAction<boolean>>;
  permissionId?: string;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset
  } = useForm<PermissionInput>({
    resolver: zodResolver(basePermissionSchema),
    defaultValues: { id: undefined, name: '', description: '' }
  });

  const utils = api.useUtils();
  const { data: permissionData } = api.RolePermission.getOnePermission.useQuery(
    { id: permissionId || '' },
    { enabled: !!permissionId }
  );
  const mutation = api.RolePermission.upsertPermission.useMutation({
    onSuccess: () => {
      NotifySuccess('Chúc mừng bạn đã thao tác thành công.');
      setOpened(false);
      utils.RolePermission.findPermission.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  useEffect(() => {
    if (permissionData) {
      reset({
        viName: permissionData.viName || '',
        name: permissionData.name || '',
        description: permissionData.description || '',
        id: permissionData.id || ''
      });
    }
  }, [permissionData, reset]);

  const onSubmit: SubmitHandler<PermissionInput> = async data => {
    try {
      await mutation.mutateAsync(data);
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
                label='Tên quyền'
                size='sm'
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
                label='Tên phiên âm quyền'
                size='sm'
                placeholder='vd: Cập nhật sản phẩm'
                error={errors.viName?.message}
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
                placeholder='Nhập mô tả'
                error={errors.description?.message}
              />
            )}
          />
        </Grid.Col>
      </Grid>
      <Button type='submit' className='mt-4' loading={isSubmitting} disabled={!isDirty} fullWidth>
        Cập nhật
      </Button>
    </form>
  );
}
