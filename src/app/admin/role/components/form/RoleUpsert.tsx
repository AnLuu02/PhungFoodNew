'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Group,
  ScrollAreaAutosize,
  Switch,
  Text,
  TextInput
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconReload, IconTrash } from '@tabler/icons-react';
import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ModalUpsertSkeleton } from '~/components/ModelUpsertSkeleton';
import { syncPermissions } from '~/lib/FuncHandler/SyncPermissions';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { baseRoleSchema, RoleInput } from '~/shared/schema/role.schema';
import { api } from '~/trpc/react';
import FilterSection from '../Section/FilterSection';
import PermissionSection from '../Section/PermissionSection';
import { FilterPermission, SelectedPermissions } from '../types';

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
  const [selectedPermissions, setSelectedPermissions] = useState<SelectedPermissions[]>([]);

  const [searchDebouceValue] = useDebouncedValue(searchValue, 1000);

  const defaultPermissions = useRef<Map<string, SelectedPermissions>>(new Map());

  const hasChange = useMemo(() => {
    return syncPermissions(defaultPermissions.current, selectedPermissions).length > 0;
  }, [selectedPermissions]);

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
      permissionPayload: []
    }
  });

  useEffect(() => {
    if (role) {
      const userPermission: SelectedPermissions[] = [];

      (role?.permissions ?? []).forEach(up => {
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
        permissionPayload: selectedPermissions?.map(({ id, type }) => ({ id, type }))?.filter(Boolean) || []
      });
    } catch {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  };

  const handleFilter = useCallback((value: FilterPermission) => {
    setFilter(value);
  }, []);
  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);
  const handleSelectedPermission = useCallback((values: SelectedPermissions[]) => {
    setSelectedPermissions(values);
  }, []);

  if (isLoadingRole || isLoading) {
    return <ModalUpsertSkeleton />;
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid gutter='md'>
        <Grid.Col span={4}>
          <Controller
            control={control}
            name='name'
            render={({ field }) => (
              <TextInput
                {...field}
                label='Tên vai trò'
                required
                size='sm'
                placeholder='Nhập tên vai trò'
                error={errors.name?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Controller
            control={control}
            name='viName'
            render={({ field }) => (
              <TextInput
                {...field}
                label='Tên phiên âm vai trò'
                required
                size='sm'
                placeholder='Nhập tên phiên âm vai trò'
                error={errors.viName?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={4} className='flex flex-col items-center justify-end'>
          <Controller
            control={control}
            name='default'
            render={({ field: { value, onChange, ...restField } }) => (
              <Switch
                {...restField}
                label='Đặt làm mặc định'
                size='sm'
                checked={!!value}
                onChange={event => {
                  const checked = typeof event === 'boolean' ? event : event.target.checked;
                  onChange(checked);
                }}
                classNames={{
                  label: 'font-bold'
                }}
                error={errors.default?.message}
              />
            )}
          />
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
                <Text size='sm'>(Có {selectedPermissions?.length} quyền)</Text>
              </Group>
              <Group>
                <Group align='center' gap={4}>
                  <Text size={'sm'} fw={600}>
                    Áp dụng tất cả
                  </Text>
                  <Switch
                    size='sm'
                    checked={selectedPermissions.length === permissions.length}
                    onChange={event => {
                      if (event.currentTarget.checked) {
                        const newData = permissions.map(({ id, name, description }) => {
                          const hasDefault = defaultPermissions.current.has(id);
                          if (hasDefault) {
                            return { id, name, description, type: 'default' as const };
                          }
                          return { id, name, description, type: 'added' as const };
                        });
                        setSelectedPermissions(newData);
                      } else {
                        setSelectedPermissions([...defaultPermissions.current.values()]);
                      }
                    }}
                  />
                </Group>
                <FilterSection onFilterValue={handleFilter} onSearchValue={handleSearch} />
              </Group>
            </Flex>

            <ScrollAreaAutosize mah={320} scrollbarSize={5}>
              <PermissionSection
                searchValue={searchDebouceValue}
                filter={filter}
                selectedPermissions={selectedPermissions}
                defaultPermissions={defaultPermissions.current}
                onSelectedPermissions={handleSelectedPermission}
              />
            </ScrollAreaAutosize>
          </Box>
        </Grid.Col>
      </Grid>

      <Group align='center' justify='flex-end' className='mt-4'>
        <Button
          variant='danger'
          size='xs'
          leftSection={<IconTrash size={12} />}
          onClick={() => {
            setSelectedPermissions([]);
            setSearchValue('');
          }}
          disabled={!selectedPermissions.length}
          className='disabled:border-1 disabled:border-solid disabled:border-gray-400 disabled:text-gray-400'
        >
          Xóa tất cả quyền
        </Button>
        <Button
          variant='outline'
          size='xs'
          leftSection={<IconReload size={12} />}
          onClick={() => {
            setSelectedPermissions([...defaultPermissions.current.values()]);
            setSearchValue('');
          }}
          disabled={!hasChange}
          className='disabled:border-1 disabled:border-solid disabled:border-gray-400 disabled:text-gray-400'
        >
          Đặt về ban đầu
        </Button>
        <Button type='submit' loading={isSubmitting} disabled={!isDirty && !hasChange}>
          Tạo mới / Cập nhật
        </Button>
      </Group>
    </form>
  );
}
