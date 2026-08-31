'use client';
import { Box, Paper, SimpleGrid, Switch, Text } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import { UserRole } from '~/shared/constants/user.constants';
import { api } from '~/trpc/react';
import { FilterPermission, SelectedPermissions } from '../types';

export default function PermissionSection({
  onSelectedPermissions,
  selectedPermissions,
  defaultPermissions,
  searchValue,
  filter
}: {
  filter: FilterPermission;
  searchValue: string;
  defaultPermissions: Map<string, SelectedPermissions>;
  selectedPermissions: SelectedPermissions[];
  onSelectedPermissions: (values: SelectedPermissions[]) => void;
}) {
  const { data: user } = useSession();
  const { data, isLoading } = api.RolePermission.getAllPermission.useQuery(undefined, {});
  const permissions = data ?? [];

  const permissionsRender = useMemo(() => {
    let dataRender = [...permissions.map(({ id, name, description }) => ({ id, name, description }))];

    if (searchValue) {
      const search = searchValue.toLowerCase();
      dataRender = dataRender.filter(item => item.name.toLowerCase().includes(search));
    }
    if (filter) {
      const permissionNames = selectedPermissions.map((item: SelectedPermissions) => item.name) ?? [];

      switch (filter) {
        case 'hasNotPermission':
          dataRender = dataRender.filter(item => !permissionNames.includes(item.name));

          break;
        case 'hasPermission':
          dataRender = [...selectedPermissions];
          break;
        default:
          dataRender = dataRender.filter(item => item.name.includes(filter));
      }
    }
    return dataRender;
  }, [searchValue, permissions?.length, filter]);

  return isLoading ? (
    <LoadingSpiner />
  ) : permissionsRender?.length > 0 ? (
    <SimpleGrid cols={2}>
      {permissionsRender.map(item => {
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
                checked={selectedPermissions?.some(
                  (p: SelectedPermissions) => p.name === item.name && p.type !== 'deleted'
                )}
                onChange={checked => {
                  const hasDefault = defaultPermissions.has(item.id);
                  if (checked.target.checked) {
                    if (hasDefault) {
                      const updated = selectedPermissions.map(p =>
                        p.id === item.id ? { ...p, type: 'default' as const } : p
                      );
                      onSelectedPermissions(updated);
                    } else {
                      onSelectedPermissions([...selectedPermissions, { ...item, type: 'added' as const }]);
                    }
                  } else {
                    if (hasDefault) {
                      const updated = selectedPermissions.map(p =>
                        p.id === item.id ? { ...p, type: 'deleted' as const } : p
                      );
                      onSelectedPermissions(updated);
                    } else {
                      const filtered = selectedPermissions.filter(p => p.id !== item.id);
                      onSelectedPermissions(filtered);
                    }
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
