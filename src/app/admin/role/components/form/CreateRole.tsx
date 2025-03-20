'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, MultiSelect, TextInput } from '@mantine/core';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { NotifyError, NotifySuccess } from '~/app/lib/utils/func-handler/toast';
import { api } from '~/trpc/react';

const roleSchema = z.object({
  name: z.string().min(1, 'Tên vai trò là bắt buộc'),
  permissionIds: z.array(z.string()).nonempty('Chọn ít nhất một quyền')
});

type RoleForm = z.infer<typeof roleSchema>;

export default function CreateRole({ setOpened }: { setOpened: any }) {
  const {
    control,

    handleSubmit,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<RoleForm>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      permissionIds: []
    }
  });

  const utils = api.useUtils();
  const createRoleMutation = api.RolePermission.createRole.useMutation({
    onSuccess: () => {
      utils.RolePermission.invalidate();
    }
  });
  const { data: permissions } = api.RolePermission.getPermissions.useQuery();

  const onSubmit: SubmitHandler<RoleForm> = async formData => {
    try {
      const result = await createRoleMutation.mutateAsync(formData);
      if (result) {
        NotifySuccess('Tạo vai trò thành công');
        setOpened(false);
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
                required
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
            name='permissionIds'
            render={({ field }) => (
              <MultiSelect
                data={permissions?.map(p => ({ value: p.id, label: p.name })) || []}
                label='Chọn quyền'
                placeholder='Chọn các quyền'
                error={errors.permissionIds?.message}
                {...field}
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
