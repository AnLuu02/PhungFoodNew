'use client';
import { Box, Paper, SimpleGrid, Switch, Text } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import { UserRole } from '~/shared/constants/user.constants';
import { api } from '~/trpc/react';
import { FilterPermission, SelectedPermissions } from '../types';

export default function PermissionSection({
  onSeletedPermissions,
  seletedPermissions,
  searchValue,
  filter
}: {
  filter: FilterPermission;
  searchValue: string;
  seletedPermissions: SelectedPermissions[];
  onSeletedPermissions: (values: SelectedPermissions[]) => void;
}) {
  const { data: user } = useSession();
  const { data: permissions = [], isLoading } = api.RolePermission.getAllPermission.useQuery(undefined, {});
  const permissionsRender = useMemo(() => {
    let dataRender = [...permissions.map(({ id, name, description }) => ({ id, name, description }))];

    if (searchValue) {
      const search = searchValue.toLowerCase();
      dataRender = dataRender.filter((item: SelectedPermissions) => item.name.toLowerCase().includes(search));
    }
    if (filter) {
      const permissionNames = seletedPermissions.map((item: SelectedPermissions) => item.name) ?? [];

      switch (filter) {
        case 'hasNotPermission':
          dataRender = dataRender.filter((item: SelectedPermissions) => !permissionNames.includes(item.name));

          break;
        case 'hasPermission':
          dataRender = [...seletedPermissions];
          break;
        default:
          dataRender = dataRender.filter((item: SelectedPermissions) => item.name.includes(filter));
      }
    }
    return dataRender;
  }, [searchValue, permissions?.length, filter]);

  return isLoading ? (
    <LoadingSpiner />
  ) : permissionsRender?.length > 0 ? (
    <SimpleGrid cols={2}>
      {permissionsRender.map((item: SelectedPermissions) => {
        return (
          <label htmlFor={`${item.id}`}>
            <Paper p={'md'} withBorder shadow='md' key={item.id} className='flex items-center justify-between'>
              <Box>
                <Text fw={600}>{item.name}</Text>
                <Text className='text-muted-foreground text-sm'>{item?.description || 'Đang cập nhật'}</Text>
              </Box>
              <Switch
                id={`${item.id}`}
                disabled={user?.user.role !== UserRole.ADMIN}
                checked={seletedPermissions?.some((p: SelectedPermissions) => p.name === item.name)}
                onChange={checked => {
                  if (checked.target.checked) {
                    onSeletedPermissions([...seletedPermissions, item]);
                  } else {
                    onSeletedPermissions(seletedPermissions.filter((p: SelectedPermissions) => p?.name !== item.name));
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
  );
}
