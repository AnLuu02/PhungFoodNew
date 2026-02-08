'use client';
import { Box, Button, Flex, Group, Paper, Select, SimpleGrid, Switch, Text, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconFilter, IconSearch } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import BButton from '~/components/Button/Button';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import { UserRole } from '~/constants';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { api } from '~/trpc/react';

export function syncPermissions(init: any[], dynamic: any[]): any[] {
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

export default function UpdateRole({
  id,
  setOpened
}: {
  id: string;
  setOpened: Dispatch<SetStateAction<boolean | null>>;
}) {
  const { data: user } = useSession();
  const { data: role, isLoading: isLoadingRole } = api.RolePermission.getOne.useQuery({ id }, { enabled: !!id });
  const { data: permissions = [], isLoading } = api.RolePermission.getAllPermission.useQuery(undefined, {
    enabled: !!id
  });
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filter, setFilter] = useState<
    'view' | 'update' | 'delete' | 'create' | 'hasNotPermission' | 'hasPermission' | undefined
  >();
  const [seletedPermissions, setSeletedPermissions] = useState<any>([]);
  const [initPermissions, setInitPermissions] = useState<any>([]);

  const [searchDebouceValue] = useDebouncedValue(searchValue, 1000);

  useEffect(() => {
    const rolePermission = role?.permissions ?? [];
    setSeletedPermissions(rolePermission);
    setInitPermissions(rolePermission);
  }, [role]);

  const permissionsRender = useMemo(() => {
    let dataRender = [...permissions];

    if (searchDebouceValue) {
      const search = searchDebouceValue.toLowerCase();
      dataRender = dataRender.filter((item: any) => item.name.toLowerCase().includes(search));
    }
    if (filter) {
      const permissionNames = seletedPermissions.map((item: any) => item.name) ?? [];
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
    return dataRender;
  }, [searchDebouceValue, permissions?.length, filter]);

  const hasChange = useMemo(() => {
    return syncPermissions(initPermissions, seletedPermissions).length > 0;
  }, [seletedPermissions, initPermissions]);

  const utils = api.useUtils();
  const mutationUpdate = api.RolePermission.updateRole.useMutation({
    onSuccess: () => {
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
      if (!role?.id) return;
      await mutationUpdate.mutateAsync({
        name: role?.name,
        viName: role?.viName || 'Khách',
        permissionIds: seletedPermissions.map((item: any) => item.id)
      });
      setOpened(null);
      NotifySuccess('Cập nhật quyền thành công');
    } catch {
      NotifyError('Đã xảy ra ngoại lệ. ', 'Cập nhật quyền không thành công');
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingRole || isLoading) {
    return <LoadingSpiner />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Text size='sm' mb={'lg'}>
        Tùy chỉnh quyền cho <b>{role?.viName}</b>. Điều này ảnh hưởng đến tất cả người dùng có vai trò này nhưng không
        có quyền tùy chỉnh.
      </Text>

      {role && (
        <Box className='space-y-6'>
          <Paper
            p={'lg'}
            radius={'md'}
            className='sticky left-0 top-[65px] z-10 flex items-center justify-between bg-gray-100'
          >
            <Box>
              <Text fw={600}>{role.viName || 'Đang cập nhật'}</Text>
              <Text size='sm'>{role?.permissions?.length || 0} quyền được chỉ định</Text>
            </Box>
            <Group>
              <Switch
                label='Áp dụng tất cả'
                size='sm'
                checked={seletedPermissions.length === permissions.length}
                onChange={event => {
                  if (event.currentTarget.checked) {
                    setSeletedPermissions([...permissions]);
                  } else {
                    setSeletedPermissions([]);
                  }
                }}
              />
              <BButton type='submit' disabled={!hasChange} loading={loading}>
                Lưu thay đổi
              </BButton>
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
                          disabled={user?.user.role !== UserRole.ADMIN}
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
