'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, Textarea, TextInput } from '@mantine/core';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { api } from '~/trpc/react';

const permissionSchema = z.object({
  name: z.string().min(1, 'Tên quyền là bắt buộc'),
  description: z.string().optional()
});

type PermissionForm = z.infer<typeof permissionSchema>;

export default function CreatePermission({ setOpened }: { setOpened: any }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<PermissionForm>({
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
    }
  });

  const onSubmit: SubmitHandler<PermissionForm> = async formData => {
    try {
      const result = await createPermissionMutation.mutateAsync(formData);
      if (result) {
        NotifySuccess('Tạo vai trò thành công');
        setOpened(false);
        utils.RolePermission.invalidate();
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
                label='Tên vai trò'
                size='sm'
                placeholder='Nhập tên vai trò'
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
        Tạo mới
      </Button>
    </form>
  );
}
