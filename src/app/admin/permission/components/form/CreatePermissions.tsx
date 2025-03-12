'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, TextInput } from '@mantine/core';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { NotifyError, NotifySuccess } from '~/app/lib/utils/func-handler/toast';
import { api } from '~/trpc/react';

const permissionSchema = z.object({
  name: z.string().min(1, 'Tên quyền là bắt buộc')
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
      name: ''
    }
  });

  const utils = api.useUtils();
  const createPermissionMutation = api.RolePermission.createPermission.useMutation();

  const onSubmit: SubmitHandler<PermissionForm> = async formData => {
    try {
      const result = await createPermissionMutation.mutateAsync(formData);
      if (result) {
        NotifySuccess('Tạo vai trò thành công');
        setOpened(false);
        utils.RolePermission.invalidate();
      }
    } catch (error) {
      NotifyError('Không thể tạo vai trò');
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
      </Grid>
      <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth>
        Tạo mới
      </Button>
    </form>
  );
}
