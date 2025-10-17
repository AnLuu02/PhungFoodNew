'use client';
import { Box, Button, Flex, Group, Paper, Select, SimpleGrid, Switch, Text, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconFilter, IconSearch } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import { UserRole } from '~/constants';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { api } from '~/trpc/react';
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
  const { data: currentSession } = useSession();
  const { data: user, isLoading: isLoadingUser } = api.User.getOne.useQuery({ s: email }, { enabled: !!email });
  const { data: permissions = [], isLoading } = api.RolePermission.getAllPermission.useQuery(undefined, {
    enabled: !!email
  });
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filter, setFilter] = useState<
    'view' | 'update' | 'delete' | 'create' | 'hasNotPermission' | 'hasPermission' | undefined
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
      const permissionNames = seletedPermissions.map((item: any) => item.name);
      switch (filter) {
        case 'hasNotPermission':
          dataRender = dataRender.filter((item: any) => !permissionNames.includes(item.name));
          break;
        case 'hasPermission':
          dataRender = [...seletedPermissions];
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

  const utils = api.useUtils();
  const mutationUpdate = api.RolePermission.updateUserPermissions.useMutation({
    onSuccess: () => {
      utils.User.invalidate();
      utils.RolePermission.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
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
              <Group align='center' gap={4}>
                <Text fw={700} size='md'>
                  Quyền người dùng
                </Text>
                <Text size='sm'>(Có {seletedPermissions?.length} quyền)</Text>
              </Group>
              <Group align='center' gap={'md'}>
                <TextInput
                  leftSection={<IconSearch size={16} className='text-gray-300 dark:text-dark-text' />}
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
                    { value: 'view:', label: 'Quyền xem' },
                    { value: 'create:', label: 'Quền tạo mới' },
                    { value: 'update:', label: 'Quyền cập nhật' },
                    { value: 'delete:', label: 'Quyền xóa' },
                    { value: 'hasNotPermission', label: 'Quyền chưa có' },
                    { value: 'hasPermission', label: 'Quyền hiện có' }
                  ]}
                  value={filter}
                  leftSection={<IconFilter size={16} className='text-gray-300 dark:text-dark-text' />}
                  placeholder='Lọc theo quyền'
                  onChange={value => setFilter(value as any)}
                />
              </Group>
            </Flex>

            {isLoading ? (
              <LoadingSpiner />
            ) : permissionsRender?.length > 0 ? (
              <SimpleGrid cols={2}>
                {permissionsRender.map((item: any) => {
                  return (
                    <label htmlFor={`${item.id}`}>
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
                          id={`${item.id}`}
                          value={item?.id}
                          disabled={currentSession?.user?.role !== UserRole.ADMIN}
                          checked={seletedPermissions?.some((p: any) => p?.id === item?.id)}
                          onChange={checked => {
                            if (checked.target.checked) {
                              setSeletedPermissions([...seletedPermissions, item]);
                            } else {
                              setSeletedPermissions(seletedPermissions.filter((p: any) => p?.id !== item?.id));
                            }
                          }}
                        />
                      </Paper>
                    </label>
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
