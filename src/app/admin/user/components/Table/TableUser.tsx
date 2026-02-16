'use client';

import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Flex,
  Group,
  Highlight,
  Paper,
  Select,
  SimpleGrid,
  Table,
  Text,
  Title
} from '@mantine/core';
import { IconAlertTriangle, IconCircleCheck, IconForbid2, IconUserPlus } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import PageSizeSelector from '~/components/Admin/Perpage';
import CustomPagination from '~/components/Pagination';
import { SearchInput } from '~/components/Search/SearchInput';
import { getInfoLevelUser, UserRole } from '~/constants';
import { formatDateViVN } from '~/lib/FuncHandler/Format';
import { LocalUserLevel } from '~/lib/ZodSchema/enum';
import { api } from '~/trpc/react';
import { UserAll, UserFind } from '~/types/client-type-trpc';
import { DeleteUserButton, UpdatePermissions, UpdateUserButton } from '../Button';

export default function TableUser({ s, data, allData }: { s: string; data: UserFind; allData: UserAll }) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '5';
  const sortArr = searchParams.getAll('sort');
  const filter = searchParams.get('filter');

  const { data: dataClient } = api.User.find.useQuery(
    { skip: +page, take: +limit, s, sort: sortArr, filter: filter + '@#@$@@' },
    { initialData: data }
  );
  const { data: allDataClient } = api.User.getAll.useQuery(undefined, { initialData: allData });
  const currentItems = dataClient?.users || [];

  const dataFilter = useMemo(() => {
    if (!allDataClient) return [];
    const summary = allDataClient.reduce(
      (acc: { total: number; customers: number; staff: number; block: number }, item) => {
        acc.total += 1;
        if (item.role?.name === UserRole.CUSTOMER) {
          acc.customers += 1;
        }
        if (item.role?.name === UserRole.STAFF) {
          acc.staff += 1;
        }
        if (!item.isActive) {
          acc.block += 1;
        }

        return acc;
      },
      { total: 0, customers: 0, staff: 0, block: 0 }
    );

    return [
      {
        label: 'Tổng tài khoản',
        value: summary.total,
        icon: IconUserPlus,
        color: '#446DAE'
      },
      {
        label: 'Khách hàng',
        value: summary.customers,
        icon: IconCircleCheck,
        color: '#499764'
      },
      {
        label: 'Nhân viên',
        value: summary.staff,
        icon: IconAlertTriangle,
        color: '#C0A453'
      },
      {
        label: 'Bị cấm',
        value: summary.block,
        icon: IconForbid2,
        color: '#CA041D'
      }
    ];
  }, [allDataClient]);
  return (
    <>
      <SimpleGrid cols={4}>
        {dataFilter?.map((item, index) => {
          const IconR = item.icon;
          return (
            <Card
              style={{ backgroundColor: item.color + 10 }}
              shadow='md'
              radius={'lg'}
              pos={'relative'}
              key={index}
              p={'md'}
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
          <Group>
            <Select
              allowDeselect={false}
              radius='md'
              placeholder='Sắp xếp'
              value={searchParams.get('sort') || 'all'}
              onChange={value => {
                if (value === 'all') params.delete('sort');
                else {
                  params.set('sort', value as string);
                  params.delete('page');
                }
                const url = `${location.pathname}?${params.toString()}`;
                router.push(url);
              }}
              data={[
                { value: 'all', label: 'Tất cả đánh giá' },
                { value: 'pointUser-asc', label: 'Điểm tăng dần' },
                { value: 'pointUser-desc', label: 'Điểm giảm dần' },
                { value: 'name-asc', label: 'Tên từ a-z' },
                { value: 'name-desc', label: 'Tên từ z-a' }
              ]}
            />

            <Select
              allowDeselect={false}
              radius='md'
              placeholder='Bộ lọc'
              value={searchParams.get('filter') || 'all'}
              onChange={value => {
                if (value === 'all') params.delete('filter');
                else {
                  params.set('filter', value as string);
                  params.delete('page');
                }
                const url = `${location.pathname}?${params.toString()}`;
                router.push(url);
              }}
              data={[
                { value: 'all', label: 'Tất cả' },
                {
                  value: 'ACTIVE',
                  label: 'Hoaạt động'
                },
                {
                  value: 'INACTIVE',
                  label: 'Tạm khóa'
                },
                {
                  value: 'STAFF',
                  label: 'Nhân viên'
                },
                {
                  value: 'CUSTOMER',
                  label: 'Khách hàng'
                }
              ]}
            />
          </Group>
        </Group>
      </Paper>
      <Paper radius={'lg'} withBorder shadow='md' p={'md'}>
        <Box className={`tableAdmin w-full overflow-x-auto`}>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Tên</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Vai trò</Table.Th>
                <Table.Th>Tình trạng</Table.Th>
                <Table.Th>Điện thoại</Table.Th>
                <Table.Th>Địa chỉ</Table.Th>
                <Table.Th>Ngày tạo</Table.Th>
                <Table.Th>Điểm</Table.Th>
                <Table.Th>Cấp điểm</Table.Th>
                <Table.Th>Thao tác</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {currentItems.length > 0 ? (
                currentItems.map(item => (
                  <Table.Tr key={item.id}>
                    <Table.Td className='text-sm'>
                      <Highlight size='sm' highlight={s}>
                        {item.name || 'Đang cập nhật...'}
                      </Highlight>
                    </Table.Td>
                    <Table.Td className='text-sm'>
                      <Highlight size='sm' highlight={s}>
                        {item.email || 'Đang cập nhật...'}
                      </Highlight>
                    </Table.Td>
                    <Table.Td className='text-sm'>
                      <Badge p='sm' radius='md' color={item.role?.name !== UserRole.ADMIN ? '#195EFE' : 'red'}>
                        {item.role?.viName || 'Đang cập nhật...'}
                      </Badge>
                    </Table.Td>
                    <Table.Td className='text-sm'>
                      <Badge p='sm' radius='md' color={item.isActive ? '#195EFE' : 'red'}>
                        {item.isActive ? 'Hoạt động' : 'Bị cấm'}
                      </Badge>
                    </Table.Td>
                    <Table.Td className='text-sm'>
                      <Highlight size='sm' highlight={s}>
                        {item.phone || 'Đang cập nhật...'}
                      </Highlight>
                    </Table.Td>
                    <Table.Td className='text-sm'>
                      <Highlight size='sm' highlight={s}>
                        {item.address?.[0]?.fullAddress || 'Đang cập nhật...'}
                      </Highlight>
                    </Table.Td>
                    <Table.Td className='text-sm'>
                      <Text size='sm'>{formatDateViVN(item.createdAt)} </Text>
                    </Table.Td>
                    <Table.Td className='text-sm'>
                      <Text size='sm'>{item.pointUser}</Text>
                    </Table.Td>
                    <Table.Td className='text-sm'>
                      <Text size='sm'>{getInfoLevelUser(item.level as LocalUserLevel)?.viName}</Text>
                    </Table.Td>
                    <Table.Td className='text-sm'>
                      <Group>
                        <>
                          <UpdatePermissions email={item.email} />
                          <UpdateUserButton email={item.email} />
                          <DeleteUserButton id={item.id} />
                        </>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={9} className='bg-gray-100 text-center'>
                    <Text size='md' c='dimmed'>
                      Không có bản ghi phù hợp.
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Box>

        <Group justify='space-between' align='center' my={'md'}>
          <PageSizeSelector />
          <CustomPagination totalPages={dataClient?.pagination.totalPages || 1} />
        </Group>
      </Paper>
    </>
  );
}
