'use client';
import { ActionIcon, Box, Card, Divider, Flex, Group, Paper, Select, SimpleGrid, Tabs, Title } from '@mantine/core';
import { IconCategory, IconCategoryPlus, IconCircleCheck } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { SearchInput } from '~/components/Search/SearchInput';
import { UserRole } from '~/constants';
import { api } from '~/trpc/react';
import { CreateManyPermissionButton, CreateManyRoleButton, CreatePermissionButton, CreateRoleButton } from './Button';
import { RoleSection } from './Section/role-section';
import TablePermission from './Section/TablePermissions';

export default function RoleClient({ s, allData, dataRole, dataPermission }: any) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '5';
  const [activeTab, setActiveTab] = useState<'role' | 'permission'>('role');
  const { data: dataClient } =
    activeTab === 'role'
      ? api.RolePermission.find.useQuery({ skip: +page, take: +limit, s }, { initialData: dataRole })
      : api.RolePermission.findPermission.useQuery({ skip: +page, take: +limit, s }, { initialData: dataPermission });

  const { data: allDataClient } = api.RolePermission.getAllRole.useQuery(undefined, { initialData: allData });

  const dataFilter = useMemo(() => {
    if (!allDataClient) return [];
    const summary = allDataClient.reduce(
      (acc: any, item: any) => {
        acc.totalRole += 1;
        acc.totlePermissions += item.permissions?.length || 0;
        item?.users?.forEach((user: any) => {
          if (user.role?.name === UserRole.CUSTOMER) {
            acc.customers += 1;
          } else if (user.role?.name === UserRole.STAFF) {
            acc.staff += 1;
          }
        });

        return acc;
      },
      { totalRole: 0, customers: 0, staff: 0, totlePermissions: 0 }
    );

    return [
      {
        label: 'Tổng số vai trò',
        value: summary.totalRole,
        icon: IconCategory,
        color: '#446DAE'
      },

      {
        label: 'Tổng số các quyền',
        value: summary.totlePermissions,
        icon: IconCategoryPlus,
        color: '#C0A453'
      },
      {
        label: 'Tổng số khách hàng',
        value: summary.customers,
        icon: IconCircleCheck,
        color: '#499764'
      },
      {
        label: 'Số nhân viên',
        value: summary.staff,
        icon: IconCircleCheck,
        color: '#CA041D'
      }
    ];
  }, [allDataClient]);
  return (
    <>
      <SimpleGrid cols={4}>
        {dataFilter.map((item, index) => {
          const IconR = item.icon;
          return (
            <Card
              shadow='md'
              radius={'lg'}
              pos={'relative'}
              key={index}
              p={'md'}
              style={{
                backgroundColor: item.color + 10
              }}
            >
              <Flex align={'center'} gap={'md'}>
                <ActionIcon variant='light' size={'xl'} radius={'md'} color={item.color}>
                  <IconR size={20} />
                </ActionIcon>
                <Box>
                  <Title order={6} className='font-quicksand'>
                    {item.label}
                  </Title>
                  <Title order={3} className='font-quicksand'>
                    {item.value}
                  </Title>
                </Box>
              </Flex>
            </Card>
          );
        })}
      </SimpleGrid>

      <Paper radius={'lg'} withBorder shadow='md' p={'md'}>
        <Group justify='space-between'>
          <SearchInput width={500} />
          {activeTab === 'role' ? (
            <>
              <CreateManyRoleButton />
            </>
          ) : (
            <>
              <CreateManyPermissionButton />
            </>
          )}
        </Group>
      </Paper>

      <Tabs
        variant='pills'
        value={activeTab}
        onChange={(value: any) => {
          setActiveTab(value);
          history.pushState(null, '', window.location.pathname);
        }}
        styles={{
          tab: {
            border: '1px solid ',
            marginRight: 6
          }
        }}
        classNames={{
          tab: `!rounded-md !border-[#e5e5e5] !font-bold hover:bg-mainColor/10 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`
        }}
      >
        <Flex
          gap={'md'}
          direction={{ base: 'column', md: 'row' }}
          justify={'space-between'}
          className='items-center sm:items-start md:items-center'
        >
          <Tabs.List>
            <Group gap={0}>
              <Tabs.Tab size={'md'} fw={700} value={'role'}>
                Vai trò
              </Tabs.Tab>
              <Tabs.Tab size={'md'} fw={700} value={'permission'}>
                Quyền người dùng
              </Tabs.Tab>
            </Group>
          </Tabs.List>
          <Group>
            <Select
              allowDeselect={false}
              placeholder='Bộ lọc'
              radius='md'
              value={searchParams.get('s') || 'all'}
              onChange={value => {
                if (value === 'all') params.delete('s');
                else {
                  params.set('s', value as string);
                  params.delete('page');
                }
                const url = `${location.pathname}?${params.toString()}`;
                router.push(url);
              }}
              data={[
                { value: 'all', label: 'Tất cả' },
                {
                  value: 'create',
                  label: 'Quyền tạo mới'
                },
                {
                  value: 'update',
                  label: 'Quyền chỉnh sửa'
                },
                {
                  value: 'delete',
                  label: 'Quyền xóa'
                },
                {
                  value: 'read',
                  label: 'Quyền xem'
                }
              ]}
            />
            {activeTab === 'role' ? (
              <>
                <CreateRoleButton />
              </>
            ) : (
              <>
                <CreatePermissionButton />
              </>
            )}
          </Group>
        </Flex>

        <Divider my='sm' />
        <Tabs.Panel value={activeTab}>
          {activeTab === 'role' ? <RoleSection data={dataClient} s={s} /> : <TablePermission data={dataClient} s={s} />}
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
