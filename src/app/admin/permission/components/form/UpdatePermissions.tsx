'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, Textarea, TextInput } from '@mantine/core';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { api } from '~/trpc/react';

const permissionSchema = z.object({
  name: z.string().min(1, 'Tên quyền là bắt buộc'),
  permissionId: z.string(),
  description: z.string().optional()
});

type PermissionFormData = z.infer<typeof permissionSchema>;

export default function UpdatePermission({ setOpened, permissionId }: { setOpened: any; permissionId: string }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
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
    }
  });

  useEffect(() => {
    if (permissionData) {
      reset({
        name: permissionData.name || '',
        description: permissionData.description || '',
        permissionId: permissionData.id || ''
      });
    }
  }, [permissionData, reset]);

  const onSubmit: SubmitHandler<PermissionFormData> = async data => {
    try {
      const result = await mutation.mutateAsync(data);
      if (result.success) {
        NotifySuccess(result.message);
        setOpened(false);
      } else {
        NotifyError(result.message);
      }
    } catch (error) {
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
                placeholder='Nhập tên quyền'
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
      <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth>
        Cập nhật
      </Button>
    </form>
  );
}
