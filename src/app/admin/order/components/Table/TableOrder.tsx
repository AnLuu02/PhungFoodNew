'use client';

import { Badge, Box, Group, Highlight, Table, Text } from '@mantine/core';
import { IconBellPause, IconCircleCheck, IconSum, IconTruckDelivery, IconXboxX } from '@tabler/icons-react';
import PageSizeSelector from '~/components/Admin/Perpage';
import CustomPagination from '~/components/Pagination';
import { formatDateViVN, formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { getStatusInfo, ORDER_STATUS_UI } from '~/lib/FuncHandler/status-order';
import { LocalOrderStatus } from '~/lib/ZodSchema/enum';
import {
  CopyOrderButton,
  DeleteOrderButton,
  HandleStateOrderButton,
  SendMessageOrderButton,
  SendOrderButton,
  UpdateOrderButton
} from '../Button';

import { ActionIcon, Card, Flex, Paper, Select, SimpleGrid, Title } from '@mantine/core';
import { OrderStatus } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { SearchInput } from '~/components/Search/SearchInput';
import { api } from '~/trpc/react';

export default function TableOrder({ s, data, allData }: { s: string; data: any; allData?: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const filter = searchParams.get('filter') as LocalOrderStatus;
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '5';
  const sortArr = searchParams.getAll('sort');
  const { data: dataClient } = api.Order.find.useQuery(
    { skip: +page, take: +limit, s, filter, sort: sortArr },
    { initialData: data }
  );
  const { data: allDataClient } = api.Order.getAll.useQuery(undefined, { initialData: allData });
  const currentItems = dataClient.orders || [];
  const dataFilter = useMemo(() => {
    if (!allDataClient) return [];
    const summary = allDataClient.reduce(
      (acc: any, item: any) => {
        acc.total += 1;
        acc[item.status] += 1;
        return acc;
      },
      {
        total: 0,
        [OrderStatus.COMPLETED]: 0,
        [OrderStatus.SHIPPING]: 0,
        [OrderStatus.PENDING]: 0,
        [OrderStatus.CANCELLED]: 0,
        [OrderStatus.CONFIRMED]: 0
      }
    );

    return [
      {
        label: 'Tổng số đơn hàng',
        value: summary.total,
        icon: IconSum,
        color: '#446DAE'
      },
      {
        label: 'Hoàn thành',
        value: summary[OrderStatus.COMPLETED],
        icon: IconCircleCheck,
        color: '#499764'
      },
      {
        label: 'Vận chuyển',
        value: summary[OrderStatus.SHIPPING],
        icon: IconTruckDelivery,
        color: '#C0A453'
      },
      {
        label: 'Chờ xác nhận',
        value: summary[OrderStatus.PENDING],
        icon: IconBellPause,
        color: '#F16329'
      },

      {
        label: 'Đã hủy',
        value: summary[OrderStatus.CANCELLED],
        icon: IconXboxX,
        color: '#CA041D'
      }
    ];
  }, [allDataClient]);

  return (
    <>
      <SimpleGrid cols={5}>
        {dataFilter?.map((item, index) => {
          const IconR = item.icon;
          return (
            <Card
              shadow='md'
              radius={'lg'}
              pos={'relative'}
              key={index}
              p={'md'}
              style={{ backgroundColor: item.color + 10 }}
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
              placeholder='Status'
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
                { value: 'all', label: 'Tất cả trạng thái' },
                ...ORDER_STATUS_UI.map(item => ({
                  value: item.key,
                  label: item.label
                }))
              ]}
            />

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
                { value: 'all', label: 'Tất cả' },
                { value: 'finalTotal-asc', label: 'Tổng đơn tăng dần' },
                { value: 'finalTotal-desc', label: 'Tổng đơn giảm dần' }
              ]}
            />
          </Group>
        </Group>
      </Paper>
      <Box className={`tableAdmin w-full overflow-x-auto`}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead className='rounded-lg text-sm uppercase leading-normal'>
            <Table.Tr>
              <Table.Th>Mã hóa đơn</Table.Th>
              <Table.Th>Khách hàng</Table.Th>
              <Table.Th>Thanh toán</Table.Th>
              <Table.Th>Tổng hóa đơn</Table.Th>
              <Table.Th>Ngày tạo</Table.Th>
              <Table.Th>Trạng thái</Table.Th>
              <Table.Th>Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {currentItems.length > 0 ? (
              currentItems.map((order: any) => {
                const statusInfo = getStatusInfo(order.status as LocalOrderStatus);
                return (
                  <Table.Tr key={order.id}>
                    <Table.Td className='text-sm'>
                      <Highlight size='sm' highlight={s}>
                        {order.id}
                      </Highlight>
                    </Table.Td>
                    <Table.Td className='text-sm'>
                      <Highlight size='sm' highlight={s}>
                        {order.user?.name}
                      </Highlight>
                    </Table.Td>
                    <Table.Td className='text-sm'>
                      <Highlight size='sm' highlight={s}>
                        {order.payment?.name}
                      </Highlight>
                    </Table.Td>
                    <Table.Td className='text-sm'>{formatPriceLocaleVi(order?.finalTotal || 0)}</Table.Td>
                    <Table.Td className='text-sm'>{formatDateViVN(order.createdAt)} </Table.Td>
                    <Table.Td className='text-sm'>
                      <Group className='text-center'>
                        <Badge leftSection={<statusInfo.icon size={16} />} color={statusInfo.color}>
                          {statusInfo.label}
                        </Badge>
                      </Group>
                    </Table.Td>
                    <Table.Td className='text-sm'>
                      <Group className='text-center'>
                        <>
                          <Group>
                            {order.status === LocalOrderStatus.PENDING && (
                              <HandleStateOrderButton
                                id={order.id}
                                status={LocalOrderStatus.CONFIRMED}
                                title='Xác nhận'
                              />
                            )}
                            {order.status === LocalOrderStatus.CONFIRMED && (
                              <HandleStateOrderButton
                                id={order.id}
                                status={LocalOrderStatus.SHIPPING}
                                title='Giao hàng'
                              />
                            )}
                            {order.status === LocalOrderStatus.SHIPPING && (
                              <HandleStateOrderButton
                                id={order.id}
                                status={LocalOrderStatus.COMPLETED}
                                title='Hoàn thành'
                              />
                            )}
                            {order.status !== LocalOrderStatus.CANCELLED && (
                              <HandleStateOrderButton
                                id={order.id}
                                status={LocalOrderStatus.CANCELLED}
                                title='Hủy đơn'
                              />
                            )}
                            <UpdateOrderButton id={order.id} />
                            <DeleteOrderButton id={order.id} />
                            <CopyOrderButton data={order} />
                          </Group>
                          <Group>
                            {order?.user && <SendOrderButton order={order} />}
                            {order.status !== LocalOrderStatus.COMPLETED && order?.user && (
                              <SendMessageOrderButton user={order.user} />
                            )}
                          </Group>
                        </>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                );
              })
            ) : (
              <Table.Tr>
                <Table.Td colSpan={7} className='bg-gray-100 text-center dark:bg-dark-card'>
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
        <CustomPagination totalPages={data?.pagination.totalPages || 1} />
      </Group>
    </>
  );
}
