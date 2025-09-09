'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Checkbox, Grid, TextInput } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { Dispatch, SetStateAction, useEffect } from 'react';
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
const initialValues = [
  { label: 'Quyền đọc', checked: false, key: 'read' },
  { label: 'Quyền tạo mới', checked: false, key: 'create' },
  { label: 'Quyền cập nhật', checked: false, key: 'update' },
  { label: 'Quyền xóa', checked: false, key: 'delete' }
];
export default function UpdateRole({
  setOpened,
  roleId
}: {
  setOpened: Dispatch<SetStateAction<boolean>>;
  roleId: string;
}) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: { roleId, name: '', permissionIds: [] }
  });
  const [values, handlers] = useListState(initialValues);
  const allChecked = values.every(value => value.checked);
  const indeterminate = values.some(value => value.checked) && !allChecked;

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
      const permissionIds = roleData.permissions?.map((p: any) => p.id) || [];
      setValue('permissionIds', permissionIds.length > 0 ? (permissionIds as [string, ...string[]]) : ['1']);
    }
  }, [roleData, setValue]);

  useEffect(() => {
    const validPermissions = values.filter(value => value.checked);
    const permissionIds =
      permissionsData
        ?.flatMap(p => validPermissions.filter(v => p.name.includes(v.key)).map(() => p.id))
        .filter((id): id is string => Boolean(id)) || [];
    setValue('permissionIds', permissionIds.length > 0 ? (permissionIds as [string, ...string[]]) : ['1']);
  }, [values, permissionsData, setValue]);

  const onSubmit: SubmitHandler<RoleFormData> = async data => {
    try {
      const result = await mutation.mutateAsync(data);
      if (result.code === 'OK') {
        NotifySuccess(result.message);
        setOpened(false);
      } else {
        NotifyError(result.message);
      }
    } catch {
      NotifyError('Có lỗi xảy ra khi cập nhật vai trò');
    }
  };
  const items = values.map((value, index) => (
    <Checkbox
      mt='xs'
      ml={33}
      label={value.label}
      key={value.key}
      checked={value.checked}
      onChange={event => handlers.setItemProp(index, 'checked', event.currentTarget.checked)}
    />
  ));

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
          <>
            <Checkbox
              checked={allChecked}
              indeterminate={indeterminate}
              label='Áp dụng tất cả'
              onChange={() => handlers.setState(current => current.map(value => ({ ...value, checked: !allChecked })))}
            />
            {items}
          </>
        </Grid.Col>
        {/* <Grid.Col span={12}>
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
        </Grid.Col> */}
      </Grid>
      <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth>
        Cập nhật
      </Button>
    </form>
  );
}
