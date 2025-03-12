'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, TextInput } from '@mantine/core';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { NotifyError, NotifySuccess } from '~/app/lib/utils/func-handler/toast';
import { api } from '~/trpc/react';

const permissionSchema = z.object({
  name: z.string().min(1, 'Tên quyền là bắt buộc'),
  permissionId: z.string()
});

type PermissionFormData = z.infer<typeof permissionSchema>;

export default function UpdatePermission({ setOpened, permissionId }: { setOpened: any; permissionId: string }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
    defaultValues: { permissionId, name: '' }
  });

  const utils = api.useUtils();
  const { data: permissionData } = api.RolePermission.getOnePermission.useQuery({ id: permissionId });
  const mutation = api.RolePermission.updatePermission.useMutation();

  useEffect(() => {
    if (permissionData) {
      setValue('name', permissionData.name || '');
    }
  }, [permissionData, setValue]);

  const onSubmit: SubmitHandler<PermissionFormData> = async data => {
    try {
      const result = await mutation.mutateAsync(data);
      if (result.success) {
        NotifySuccess(result.message);
        setOpened(false);
        utils.RolePermission.invalidate();
      } else {
        NotifyError(result.message);
      }
    } catch (error) {
      NotifyError('Có lỗi xảy ra khi cập nhật quyền');
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
      </Grid>
      <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth>
        Cập nhật
      </Button>
    </form>
  );
}
