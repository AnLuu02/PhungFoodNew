'use client';
import { Box, Button, Flex, Group, Paper, Text } from '@mantine/core';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FilterSection from '~/app/admin/role/components/Section/FilterSection';
import PermissionSection from '~/app/admin/role/components/Section/PermissionSection';
import { FilterPermission, SelectedPermissions } from '~/app/admin/role/components/types';
import { ModalUpsertSkeleton } from '~/components/ModelUpsertSkeleton';
import { syncPermissions } from '~/lib/FuncHandler/SyncPermissions';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { api } from '~/trpc/react';

export default function UpdatePermissionUser({
  email,
  setOpened
}: {
  email: string;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: user, isLoading: isLoadingUser } = api.User.getOne.useQuery({ key: email }, { enabled: !!email });
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filter, setFilter] = useState<FilterPermission>();
  const [selectedPermissions, setSelectedPermissions] = useState<SelectedPermissions[]>([]);

  const defaultPermissions = useRef<Map<string, SelectedPermissions>>(new Map());

  useEffect(() => {
    const userPermission: SelectedPermissions[] = [];

    (user?.role?.permissions ?? []).forEach(up => {
      const item = {
        id: up?.id,
        name: up?.name,
        description: up?.description ?? null,
        type: 'default' as const
      };

      userPermission.push(item);
      defaultPermissions.current.set(item.id, item);
    });

    setSelectedPermissions(userPermission);
  }, [user]);

  const hasChange = useMemo(() => {
    return syncPermissions(defaultPermissions.current, selectedPermissions).length > 0;
  }, [selectedPermissions]);

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const usePermissions = syncPermissions(defaultPermissions.current, selectedPermissions);
      if (!user?.id) return;
      await mutationUpdate.mutateAsync(
        usePermissions
          .filter(item => !!item.id && typeof item.granted === 'boolean')
          .map(item => ({
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

  const handleFilter = useCallback((value: FilterPermission) => {
    setFilter(value);
  }, []);
  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);
  const handleSelectedPermission = useCallback((value: any) => {
    setSelectedPermissions(value);
  }, []);

  if (isLoadingUser) {
    return <ModalUpsertSkeleton />;
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
            className='sticky left-0 top-[65px] z-10 flex items-center justify-between bg-gray-100 dark:bg-dark-card'
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
                  setSelectedPermissions([...defaultPermissions.current.values()]);
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
                <Text size='sm'>(Có {selectedPermissions?.length} quyền)</Text>
              </Group>
              <FilterSection onFilterValue={handleFilter} onSearchValue={handleSearch} />
            </Flex>

            <PermissionSection
              searchValue={searchValue}
              filter={filter}
              selectedPermissions={selectedPermissions}
              defaultPermissions={defaultPermissions.current}
              onSelectedPermissions={handleSelectedPermission}
            />
          </Box>
        </Box>
      )}
    </form>
  );
}
