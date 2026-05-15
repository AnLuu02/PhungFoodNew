'use client';
import { Box, Button, Flex, Group, Paper, Switch, Text } from '@mantine/core';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { ModalUpsertSkeleton } from '~/components/ModelUpsertSkeleton';
import { syncPermissions } from '~/lib/FuncHandler/SyncPermissions';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { api } from '~/trpc/react';
import FilterSection from '../Section/FilterSection';
import PermissionSection from '../Section/PermissionSection';
import { FilterPermission, SelectedPermissions } from '../types';

export default function UpdatePermissionForRole({
  id,
  setOpened
}: {
  id: string;

  setOpened: Dispatch<
    SetStateAction<{
      mode: 'update:role' | 'update:permissionForRole';
      data: any;
    } | null>
  >;
}) {
  const { data: role, isLoading: isLoadingRole } = api.RolePermission.getOne.useQuery({ id }, { enabled: !!id });
  const { data: permissions = [], isLoading } = api.RolePermission.getAllPermission.useQuery(undefined, {
    enabled: !!id
  });
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filter, setFilter] = useState<FilterPermission>();
  const [seletedPermissions, setSeletedPermissions] = useState<SelectedPermissions[]>([]);
  const [initPermissions, setInitPermissions] = useState<SelectedPermissions[]>([]);

  useEffect(() => {
    const rolePermission = role?.permissions ?? [];
    const dataState = [...rolePermission.map(({ id, name, description }) => ({ id, name, description }))];
    setSeletedPermissions(dataState);
    setInitPermissions(dataState);
  }, [role]);

  const hasChange = useMemo(() => {
    return syncPermissions(initPermissions, seletedPermissions).length > 0;
  }, [seletedPermissions, initPermissions]);

  const utils = api.useUtils();
  const mutationUpdate = api.RolePermission.upsertRole.useMutation({
    onSuccess: () => {
      setOpened(null);
      NotifySuccess('Cập nhật quyền thành công');
      utils.RolePermission.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!role?.id) return;
      await mutationUpdate.mutateAsync({
        name: role?.name,
        id: id || '',
        viName: role?.viName || '',
        permissionIds: seletedPermissions.map((item: SelectedPermissions) => item.id) ?? []
      });
    } catch {
      NotifyError('Đã xảy ra ngoại lệ. ', 'Cập nhật quyền không thành công');
    } finally {
      setLoading(false);
    }
  };
  const handleFilter = useCallback((value: FilterPermission) => {
    setFilter(value);
  }, []);
  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);
  const handleSeletedPermission = useCallback((values: SelectedPermissions[]) => {
    setSeletedPermissions(values);
  }, []);

  if (isLoadingRole || isLoading) {
    return <ModalUpsertSkeleton />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Text size='sm' mb={'lg'}>
        Tùy chỉnh quyền cho <b>{role?.viName}</b>. Điều này ảnh hưởng đến tất cả người dùng có vai trò này nhưng không
        có quyền tùy chỉnh.
      </Text>

      {role && (
        <Box className='space-y-6'>
          <Paper p={'lg'} className='sticky left-0 top-[65px] z-10 flex items-center justify-between bg-gray-100'>
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
                    setSeletedPermissions([
                      ...permissions.map(({ id, name, description }) => ({ id, name, description }))
                    ]);
                  } else {
                    setSeletedPermissions([]);
                  }
                }}
              />
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
              <FilterSection onFilterValue={handleFilter} onSearchValue={handleSearch} />
            </Flex>

            <PermissionSection
              searchValue={searchValue}
              filter={filter}
              seletedPermissions={seletedPermissions}
              onSeletedPermissions={handleSeletedPermission}
            />
          </Box>
        </Box>
      )}
    </form>
  );
}
