'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, MultiSelect, TextInput } from '@mantine/core';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { api } from '~/trpc/react';

const roleSchema = z.object({
  name: z.string().min(1, 'Tên vai trò là bắt buộc'),
  roleId: z.string(),
  permissionIds: z.array(z.string()).nonempty('Chọn ít nhất một quyền')
});

type RoleFormData = z.infer<typeof roleSchema>;

export default function UpdateRole({ setOpened, roleId }: { setOpened: any; roleId: string }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: { roleId, name: '', permissionIds: [] }
  });

  const utils = api.useUtils();
  const { data: permissionsData } = api.RolePermission.getPermissions.useQuery();
  const { data: roleData } = api.RolePermission.getOne.useQuery({ id: roleId });
  const mutation = api.RolePermission.updateRole.useMutation({
    onSuccess: () => {
      utils.RolePermission.invalidate();
    }
  });

  useEffect(() => {
    if (roleData) {
      setValue('name', roleData.name || '');
      const permissions = roleData.permissions?.map((p: any) => p.id) || [];
      setValue('permissionIds', permissions.length > 0 ? (permissions as [string, ...string[]]) : ['1']);
    }
  }, [roleData, setValue]);

  const onSubmit: SubmitHandler<RoleFormData> = async data => {
    try {
      const result = await mutation.mutateAsync(data);
      if (result.success) {
        NotifySuccess(result.message);
        setOpened(false);
      } else {
        NotifyError(result.message);
      }
    } catch (error) {
      NotifyError('Có lỗi xảy ra khi cập nhật vai trò');
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
                data={permissionsData?.map((p: any) => ({ value: p.id, label: p.name })) || []}
                label='Quyền'
                placeholder='Chọn quyền'
                error={errors.permissionIds?.message}
                {...field}
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
