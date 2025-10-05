'use client';
import { Box, Button, Flex, Group, Paper, Select, SimpleGrid, Switch, Text, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconFilter, IconSearch } from '@tabler/icons-react';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import { UserRole } from '~/constants';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { api } from '~/trpc/react';
const PERMISSIONS: Record<string, { name: string; description: string }> = {
  dashboard: { name: 'Dashboard Access', description: 'View main dashboard' },
  users: { name: 'User Management', description: 'Create, edit, delete users' },
  roles: { name: 'Role Management', description: 'Manage roles and permissions' },
  restaurant: { name: 'Restaurant Settings', description: 'Edit restaurant information' },
  menu: { name: 'Menu Management', description: 'Create and edit menu items' },
  orders: { name: 'Order Management', description: 'View and process orders' },
  payments: { name: 'Payment Processing', description: 'Handle payments and refunds' },
  reports: { name: 'Reports & Analytics', description: 'View financial and operational reports' },
  content: { name: 'Content Management', description: 'Manage website content and pages' },
  integrations: { name: 'Third-party Integrations', description: 'Configure external services' },
  system: { name: 'System Settings', description: 'Modify system configuration' },
  backup: { name: 'Backup & Recovery', description: 'Manage data backups' }
};

const DEFAULT_ROLE_PERMISSIONS = {
  Admin: Object.keys(PERMISSIONS),
  Manager: ['dashboard', 'menu', 'orders', 'payments', 'reports', 'content'],
  Staff: ['dashboard', 'orders']
};

function syncPermissions(init: any[], dynamic: any[]): any[] {
  const initMap = new Map(init.map(p => [p.id, p]));

  const result: any[] = [];

  for (const d of dynamic) {
    if (!initMap.has(d.id)) {
      result.push({ ...d, granted: true });
    } else {
      initMap.delete(d.id);
    }
  }

  for (const [, p] of initMap) {
    result.push({ ...p, granted: false });
  }

  return result;
}

export default function UpdatePermissionUser({
  email,
  setOpened
}: {
  email: any;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: user, isLoading: isLoadingUser } = api.User.getOne.useQuery({ s: email }, { enabled: !!email });
  const { data: permissions = [], isLoading } = api.RolePermission.getAllPermission.useQuery(undefined, {
    enabled: !!email
  });
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filter, setFilter] = useState<
    'view' | 'update' | 'delete' | 'create' | 'hideHasPermission' | 'showHasPermission' | undefined
  >();
  const [permissionsRender, setPermissionsRender] = useState<any>([]);
  const [seletedPermissions, setSeletedPermissions] = useState<any>([]);
  const [initPermissions, setInitPermissions] = useState<any>([]);

  const [searchDebouceValue] = useDebouncedValue(searchValue, 1000);

  useEffect(() => {
    const userPermission = user?.role?.permissions ?? [];
    setSeletedPermissions(userPermission);
    setInitPermissions(userPermission);
  }, [user]);

  useEffect(() => {
    let dataRender = [...permissions];

    if (searchDebouceValue) {
      const search = searchDebouceValue.toLowerCase();
      dataRender = dataRender.filter((item: any) => item.name.toLowerCase().includes(search));
    }

    if (filter) {
      const permissionNames = permissions.map((item: any) => item.name);
      switch (filter) {
        case 'hideHasPermission':
          dataRender = dataRender.filter((item: any) => !permissionNames.includes(item.name));
          break;
        case 'showHasPermission':
          dataRender = dataRender.filter((item: any) => permissionNames.includes(item.name));
          break;
        default:
          dataRender = dataRender.filter((item: any) => item.name.includes(filter));
      }
    }
    setPermissionsRender(dataRender);
  }, [searchDebouceValue, permissions, filter]);

  const hasChange = useMemo(() => {
    return syncPermissions(initPermissions, seletedPermissions).length > 0;
  }, [seletedPermissions, initPermissions]);
  syncPermissions(initPermissions, seletedPermissions);

  const utils = api.useUtils();
  const mutationUpdate = api.RolePermission.updateUserPermissions.useMutation({
    onSuccess: () => {
      utils.User.invalidate();
      utils.RolePermission.invalidate();
    }
  });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const usePermissions = syncPermissions(initPermissions, seletedPermissions);
      if (!user?.id) return;
      await mutationUpdate.mutateAsync(
        usePermissions
          .filter((item: any) => !!item.id && typeof item.granted === 'boolean')
          .map((item: any) => ({
            userId: user.id as string,
            permissionId: String(item.id),
            granted: Boolean(item.granted)
          }))
      );
      setOpened(false);
      NotifySuccess('Cập nhật quyền thành công');
    } catch {
      NotifyError('Đã xảy ra ngoại lệ. ', 'Cập nhật quyền không thành công');
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingUser || isLoading) {
    return <LoadingSpiner />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Text size='sm' mb={'lg'}>
        Tùy chỉnh quyền cho <b>{user?.name}</b>. Quyền tùy chỉnh sẽ ghi đè lên quyền mặc định của vai trò.
      </Text>

      {user && (
        <Box className='space-y-6'>
          <Paper
            p={'lg'}
            radius={'md'}
            className='sticky left-0 top-[65px] z-10 flex items-center justify-between bg-gray-100'
          >
            <Box>
              <Text fw={600}>{user.name}</Text>
              <Text size='sm'>
                Vai trò: {user.role?.viName || 'Đang cập nhật'} •{' '}
                {user.userPermissions?.length ? 'Quyền tùy chỉnh' : 'Sử dụng quyền vai trò'}
              </Text>
            </Box>
            <Group>
              <Button type='submit' disabled={!hasChange} loading={loading}>
                Lưu thay đổi
              </Button>
              <Button
                variant='outline'
                size='xs'
                onClick={() => {
                  setSeletedPermissions([...initPermissions]);
                }}
                disabled={!hasChange}
                className='disabled:border-1 disabled:border-solid disabled:border-gray-400 disabled:text-gray-400'
              >
                Đặt lại về ban đầu
              </Button>
            </Group>
          </Paper>

          <Box className='space-y-4'>
            <Flex align={'center'} justify={'space-between'}>
              <Text fw={700} size='md'>
                Quyền người dùng
              </Text>
              <Group align='center' gap={'md'}>
                <TextInput
                  leftSection={<IconSearch size={16} className='text-gray-300 dark:text-white' />}
                  size='sm'
                  radius={'md'}
                  value={searchValue}
                  onChange={event => setSearchValue(event.currentTarget.value)}
                  placeholder='Tìm kiếm'
                />
                <Select
                  size='sm'
                  radius={'md'}
                  data={[
                    { value: 'view_', label: 'Quyền xem' },
                    { value: 'create_', label: 'Quền tạo mới' },
                    { value: 'update_', label: 'Quyền cập nhật' },
                    { value: 'delete_', label: 'Quyền xóa' },
                    { value: 'hideHasPermission', label: 'Ẩn quyền các quyền hiện có' },
                    { value: 'showHasPermission', label: 'Chỉ hiển thị quyền hiện có' }
                  ]}
                  value={filter}
                  leftSection={<IconFilter size={16} className='text-gray-300 dark:text-white' />}
                  placeholder='Lọc theo quyền'
                  onChange={value => setFilter(value as any)}
                />
              </Group>
            </Flex>

            {isLoading ? (
              <LoadingSpiner />
            ) : permissionsRender?.length > 0 ? (
              <SimpleGrid cols={3}>
                {permissionsRender.map((item: any) => {
                  return (
                    <Paper
                      p={'md'}
                      withBorder
                      radius={'md'}
                      shadow='md'
                      key={item.id}
                      className='flex items-center justify-between'
                    >
                      <Box>
                        <Text fw={600}>{item.name}</Text>
                        <Text className='text-muted-foreground text-sm'>{item.description}</Text>
                      </Box>
                      <Switch
                        disabled={user.role?.name !== UserRole.ADMIN}
                        checked={seletedPermissions?.some((p: any) => p.name === item.name)}
                        onChange={checked => {
                          if (checked.target.checked) {
                            setSeletedPermissions([...seletedPermissions, item]);
                          } else {
                            setSeletedPermissions(seletedPermissions.filter((p: any) => p?.name !== item.name));
                          }
                        }}
                      />
                    </Paper>
                  );
                })}
              </SimpleGrid>
            ) : (
              <Text c={'dimmed'} mt={'xl'} mb={'md'} className='text-center'>
                Không có két quả phù hợp.
              </Text>
            )}
          </Box>
        </Box>
      )}
    </form>
  );
}
