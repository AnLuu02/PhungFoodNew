'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Flex,
  Grid,
  Group,
  Paper,
  ScrollAreaAutosize,
  Select,
  SimpleGrid,
  Switch,
  Text,
  TextInput
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconFilter, IconSearch } from '@tabler/icons-react';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { api } from '~/trpc/react';

const roleSchema = z.object({
  name: z.string({ required_error: 'Tên vai trò là bắt buộc' }).min(1, 'Tên vai trò là bắt buộc'),
  viName: z.string({ required_error: 'Tên phiên âm vai trò là bắt buộc' }).min(1, 'Tên phiên âm vai trò là bắt buộc'),
  permissionIds: z.array(z.string()).nullable()
});

type RoleForm = z.infer<typeof roleSchema>;

export default function CreateRole({ setOpened }: { setOpened: Dispatch<SetStateAction<boolean>> }) {
  const { data: permissions = [], isLoading } = api.RolePermission.getAllPermission.useQuery();
  const [searchValue, setSearchValue] = useState('');
  const [filter, setFilter] = useState<
    'view' | 'update' | 'delete' | 'create' | 'hideHasPermission' | 'showHasPermission' | undefined
  >();
  const [permissionsRender, setPermissionsRender] = useState<any>([]);
  const [seletedPermissions, setSeletedPermissions] = useState<any>([]);
  const [searchDebouceValue] = useDebouncedValue(searchValue, 1000);

  useEffect(() => {
    let dataRender = [...permissions];

    if (searchDebouceValue) {
      const search = searchDebouceValue.toLowerCase();
      dataRender = dataRender.filter((item: any) => item.name.toLowerCase().includes(search));
    }

    if (filter) {
      const permissionNames = permissions.map((item: any) => item.name);
      switch (filter) {
        case 'hideHasPermission':
          dataRender = dataRender.filter((item: any) => !permissionNames.includes(item.name));
          break;
        case 'showHasPermission':
          dataRender = dataRender.filter((item: any) => permissionNames.includes(item.name));
          break;
        default:
          dataRender = dataRender.filter((item: any) => item.name.includes(filter));
      }
    }
    setPermissionsRender(dataRender);
  }, [searchDebouceValue, filter, permissions?.length]);

  const hasChange = useMemo(() => {
    return seletedPermissions?.length > 0;
  }, [seletedPermissions]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<RoleForm>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      viName: '',
      permissionIds: []
    }
  });

  const utils = api.useUtils();
  const createRoleMutation = api.RolePermission.createRole.useMutation({
    onSuccess: () => {
      utils.RolePermission.invalidate();
    }
  });

  const onSubmit: SubmitHandler<RoleForm> = async formData => {
    try {
      const result = await createRoleMutation.mutateAsync({
        ...formData,
        permissionIds: seletedPermissions
      });
      if (result) {
        NotifySuccess('Tạo vai trò thành công');
        setOpened(false);
      }
    } catch {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  };

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
                placeholder='Nhập tên phiên âm vai trò'
                error={errors.viName?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Box className='space-y-4'>
            <Flex align={'center'} justify={'space-between'}>
              <Text fw={700} size='md'>
                Quyền người dùng
              </Text>
              <Group align='center' gap={'md'}>
                <TextInput
                  leftSection={<IconSearch size={16} className='text-gray-300 dark:text-white' />}
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
                    { value: 'view_', label: 'Quyền xem' },
                    { value: 'create_', label: 'Quền tạo mới' },
                    { value: 'update_', label: 'Quyền cập nhật' },
                    { value: 'delete_', label: 'Quyền xóa' },
                    { value: 'hideHasPermission', label: 'Ẩn quyền các quyền hiện có' },
                    { value: 'showHasPermission', label: 'Chỉ hiển thị quyền hiện có' }
                  ]}
                  value={filter}
                  leftSection={<IconFilter size={16} className='text-gray-300 dark:text-white' />}
                  placeholder='Lọc theo quyền'
                  onChange={value => setFilter(value as any)}
                />

                <Switch
                  label='Áp dụng tất cả'
                  size='sm'
                  checked={seletedPermissions.length === permissions.length}
                  onChange={event => {
                    if (event.currentTarget.checked) {
                      setSeletedPermissions([...permissions?.map((item: any) => item?.id)]);
                    } else {
                      setSeletedPermissions([]);
                    }
                  }}
                />
              </Group>
            </Flex>

            {isLoading ? (
              <LoadingSpiner />
            ) : permissionsRender?.length > 0 ? (
              <ScrollAreaAutosize mah={300} scrollbarSize={5}>
                <SimpleGrid cols={2} pr={'xs'}>
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
                            checked={seletedPermissions?.some((p: any) => p === item?.id)}
                            onChange={checked => {
                              if (checked.target.checked) {
                                setSeletedPermissions([...seletedPermissions, item?.id]);
                              } else {
                                setSeletedPermissions(seletedPermissions.filter((p: any) => p !== item?.id));
                              }
                            }}
                          />
                        </Paper>
                      </label>
                    );
                  })}
                </SimpleGrid>
              </ScrollAreaAutosize>
            ) : (
              <Text c={'dimmed'} mt={'xl'} mb={'md'} className='text-center'>
                Không có két quả phù hợp.
              </Text>
            )}
          </Box>
        </Grid.Col>
      </Grid>

      <Group align='center' justify='flex-end' className='mt-4'>
        <Button
          variant='outline'
          size='xs'
          onClick={() => {
            setSeletedPermissions([]);
          }}
          disabled={!hasChange}
          className='disabled:border-1 disabled:border-solid disabled:border-gray-400 disabled:text-gray-400'
        >
          Đặt lại
        </Button>
        <Button type='submit' loading={isSubmitting} disabled={!isDirty}>
          Tạo mới
        </Button>
      </Group>
    </form>
  );
}
