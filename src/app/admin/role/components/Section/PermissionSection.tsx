'use client';
import { Box, Paper, SimpleGrid, Switch, Text } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import { UserRole } from '~/shared/constants/user';
import { api } from '~/trpc/react';
import { FilterPermission } from '../types';

export default function PermissionSection({
  onSeletedPermissions,
  seletedPermissions,
  searchValue,
  filter
}: {
  filter: FilterPermission;
  searchValue: string;
  seletedPermissions: any;
  onSeletedPermissions: (value: any) => void;
}) {
  const { data: user } = useSession();
  const { data: permissions = [], isLoading } = api.RolePermission.getAllPermission.useQuery(undefined, {});
  const permissionsRender = useMemo(() => {
    let dataRender = [...permissions];

    if (searchValue) {
      const search = searchValue.toLowerCase();
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
  }, [searchValue, permissions?.length, filter]);

  return isLoading ? (
    <LoadingSpiner />
  ) : permissionsRender?.length > 0 ? (
    <SimpleGrid cols={2}>
      {permissionsRender.map((item: any) => {
        return (
          <label htmlFor={`${item.id}`}>
            <Paper p={'md'} withBorder shadow='md' key={item.id} className='flex items-center justify-between'>
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
                    onSeletedPermissions([...seletedPermissions, item]);
                  } else {
                    onSeletedPermissions(seletedPermissions.filter((p: any) => p?.name !== item.name));
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
