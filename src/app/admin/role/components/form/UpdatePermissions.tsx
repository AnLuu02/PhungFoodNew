'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid, Textarea, TextInput } from '@mantine/core';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { permissionSchema } from '~/lib/ZodSchema/schema';
import { api } from '~/trpc/react';
import { PermissionClientType } from '~/types';

export default function UpdatePermission({
  setOpened,
  permissionId
}: {
  setOpened: Dispatch<SetStateAction<boolean>>;
  permissionId: string;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset
  } = useForm<PermissionClientType>({
    resolver: zodResolver(permissionSchema),
    defaultValues: { id: '', name: '', description: '' }
  });

  const utils = api.useUtils();
  const { data: permissionData } = api.RolePermission.getOnePermission.useQuery({ id: permissionId });
  const mutation = api.RolePermission.updatePermission.useMutation({
    onSuccess: () => {
      utils.RolePermission.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  useEffect(() => {
    if (permissionData) {
      reset({
        id: permissionData.id || '',
        viName: permissionData.viName || '',
        name: permissionData.name || '',
        description: permissionData.description || ''
      });
    }
  }, [permissionData, reset]);

  const onSubmit: SubmitHandler<PermissionClientType> = async data => {
    try {
      const result = await mutation.mutateAsync(data);
      if (result.code === 'OK') {
        NotifySuccess(result.message);
        setOpened(false);
      } else {
        NotifyError(result.message);
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
                label='Tên quyền'
                size='sm'
                radius='md'
                placeholder='Nhập tên quyền'
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
                radius='md'
                placeholder='Nhập tên phiên âm quyền'
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
              <Textarea {...field} label='Mô tả' size='sm' placeholder='Nhập mô tả' error={errors.name?.message} />
            )}
          />
        </Grid.Col>
      </Grid>
      <BButton type='submit' className='mt-4' loading={isSubmitting} disabled={!isDirty} fullWidth>
        Cập nhật
      </BButton>
    </form>
  );
}
