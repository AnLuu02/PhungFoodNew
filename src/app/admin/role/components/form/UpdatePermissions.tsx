'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, Textarea, TextInput } from '@mantine/core';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { api } from '~/trpc/react';

const permissionSchema = z.object({
  name: z.string({ required_error: 'Tên quyền là bắt buộc' }).min(1, 'Tên quyền là bắt buộc'),
  viName: z.string({ required_error: 'Tên phiên âm là bắt buộc' }).min(1, 'Tên phiên âm là bắt buộc'),
  permissionId: z.string(),
  description: z.string().optional()
});

type PermissionFormData = z.infer<typeof permissionSchema>;

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
  } = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
    defaultValues: { permissionId, name: '', description: '' }
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
        viName: permissionData.viName || '',
        name: permissionData.name || '',
        description: permissionData.description || '',
        permissionId: permissionData.id || ''
      });
    }
  }, [permissionData, reset]);

  const onSubmit: SubmitHandler<PermissionFormData> = async data => {
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
      <Button type='submit' className='mt-4 w-full' loading={isSubmitting} disabled={!isDirty} fullWidth>
        Cập nhật
      </Button>
    </form>
  );
}
