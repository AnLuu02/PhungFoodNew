'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Center, Divider, Flex, Grid, Group, ScrollAreaAutosize, Text, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import { ModalUpsertSkeleton } from '~/components/ModelUpsertSkeleton';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { baseRoleSchema, RoleInput } from '~/shared/schema/role.schema';
import { api } from '~/trpc/react';
import FilterSection from '../Section/FilterSection';
import PermissionSection from '../Section/PermissionSection';
import { FilterPermission } from '../types';

export default function RoleUpsert({
  setOpened,
  roleId
}: {
  roleId?: string;
  setOpened: Dispatch<SetStateAction<any>>;
}) {
  const { data: permissions = [], isLoading } = api.RolePermission.getAllPermission.useQuery();
  const { data: role, isLoading: isLoadingRole } = api.RolePermission.getOne.useQuery(
    { id: roleId || '' },
    { enabled: !!roleId }
  );
  const [searchValue, setSearchValue] = useState('');
  const [filter, setFilter] = useState<FilterPermission>();
  const [seletedPermissions, setSeletedPermissions] = useState<any>([]);
  const [searchDebouceValue] = useDebouncedValue(searchValue, 1000);

  const hasChange = useMemo(() => {
    return seletedPermissions?.length > 0;
  }, [seletedPermissions]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<RoleInput>({
    resolver: zodResolver(baseRoleSchema),
    defaultValues: {
      id: undefined,
      name: '',
      viName: '',
      permissionIds: []
    }
  });

  useEffect(() => {
    if (role) {
      const rolePermission = role?.permissions ?? [];
      setSeletedPermissions(rolePermission);
      reset({
        ...role,
        viName: role?.viName || 'Đang cập nhật.'
      });
    }
  }, [role, reset]);

  const utils = api.useUtils();
  const createRoleMutation = api.RolePermission.upsertRole.useMutation({
    onSuccess: () => {
      NotifySuccess('Tạo vai trò thành công');
      setOpened(null);
      utils.RolePermission.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  const onSubmit: SubmitHandler<RoleInput> = async formData => {
    try {
      await createRoleMutation.mutateAsync({
        ...formData,
        permissionIds: seletedPermissions?.map(({ id }: any) => id)?.filter(Boolean) || []
      });
    } catch {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
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

  if (isLoadingRole || isLoading) {
    return <ModalUpsertSkeleton />;
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid gutter='md'>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='name'
            render={({ field }) => (
              <TextInput
                {...field}
                label='Tên vai trò'
                required
                size='sm'
                radius='md'
                placeholder='Nhập tên vai trò'
                error={errors.name?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='viName'
            render={({ field }) => (
              <TextInput
                {...field}
                label='Tên phiên âm vai trò'
                required
                size='sm'
                radius='md'
                placeholder='Nhập tên phiên âm vai trò'
                error={errors.viName?.message}
              />
            )}
          />
          <Controller control={control} name='permissionIds' render={({ field }) => <input {...field} hidden />} />
        </Grid.Col>
        <Grid.Col span={12}>
          <Center>
            <Divider w={'60%'} />
          </Center>
        </Grid.Col>

        <Grid.Col span={12}>
          <Box className='space-y-4'>
            <Flex align={'center'} justify={'space-between'} pos='sticky' top={100} h={50} className='z-[999]'>
              <Group align='center' gap={4}>
                <Text fw={700} size='md'>
                  Quyền người dùng
                </Text>
                <Text size='sm'>(Có {seletedPermissions?.length} quyền)</Text>
              </Group>
              <FilterSection onFilterValue={handleFilter} onSearchValue={handleSearch} />
            </Flex>

            <ScrollAreaAutosize mah={320} scrollbarSize={5}>
              <PermissionSection
                searchValue={searchValue}
                filter={filter}
                seletedPermissions={seletedPermissions}
                onSeletedPermissions={handleSeletedPermission}
              />
            </ScrollAreaAutosize>
          </Box>
        </Grid.Col>
      </Grid>

      <Group align='center' justify='flex-end' className='mt-4'>
        <Button
          variant='outline'
          radius={'md'}
          size='xs'
          onClick={() => {
            setSeletedPermissions([]);
            setSearchValue('');
          }}
          disabled={!hasChange}
          className='disabled:border-1 disabled:border-solid disabled:border-gray-400 disabled:text-gray-400'
        >
          Đặt lại
        </Button>
        <BButton
          type='submit'
          loading={isSubmitting}
          disabled={!isDirty && seletedPermissions.length === permissions.length}
        >
          Tạo mới / Cập nhật
        </BButton>
      </Group>
    </form>
  );
}
