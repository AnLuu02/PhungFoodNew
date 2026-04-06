'use client';
import { Box, Button, Flex, Group, Paper, Text } from '@mantine/core';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import FilterSection from '~/app/admin/role/components/Section/FilterSection';
import PermissionSection from '~/app/admin/role/components/Section/PermissionSection';
import { FilterPermission } from '~/app/admin/role/components/types';
import BButton from '~/components/Button/Button';
import { ModalUpsertSkeleton } from '~/components/ModelUpsertSkeleton';
import { syncPermissions } from '~/lib/FuncHandler/SyncPermissions';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { api } from '~/trpc/react';

export default function UpdatePermissionUser({
  email,
  setOpened
}: {
  email: any;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: user, isLoading: isLoadingUser } = api.User.getOne.useQuery({ s: email }, { enabled: !!email });
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filter, setFilter] = useState<FilterPermission>();
  const [seletedPermissions, setSeletedPermissions] = useState<any>([]);
  const [initPermissions, setInitPermissions] = useState<any>([]);

  useEffect(() => {
    const userPermission = user?.role?.permissions ?? [];
    setSeletedPermissions(userPermission);
    setInitPermissions(userPermission);
  }, [user]);

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

  const handleFilter = useCallback((value: any) => {
    setFilter(value);
  }, []);
  const handleSearch = useCallback((value: any) => {
    setSearchValue(value);
  }, []);
  const handleSeletedPermission = useCallback((value: any) => {
    setSeletedPermissions(value);
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
            radius={'md'}
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
              <BButton type='submit' disabled={!hasChange} loading={loading}>
                Lưu thay đổi
              </BButton>
              <Button
                variant='outline'
                radius={'md'}
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
