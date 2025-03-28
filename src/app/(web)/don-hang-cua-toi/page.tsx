'use client';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Center,
  Flex,
  Grid,
  Group,
  Pagination,
  Paper,
  RingProgress,
  Select,
  Stack,
  Table,
  Text,
  Title,
  Tooltip
} from '@mantine/core';
import { OrderStatus } from '@prisma/client';
import { IconTrash } from '@tabler/icons-react';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';
import InvoiceToPrint from '~/app/_components/Invoices/InvoceToPrint';
import SearchLocal from '~/app/_components/Search/SearchLocal';
import { useModal } from '~/app/contexts/ModalContext';
import { handleDelete } from '~/app/lib/utils/button-handle/ButtonDeleteConfirm';
import { formatDate } from '~/app/lib/utils/func-handler/formatDate';
import { formatPriceLocaleVi } from '~/app/lib/utils/func-handler/formatPrice';
import { getStatusColor, getStatusIcon, getStatusText } from '~/app/lib/utils/func-handler/get-status-order';
import { api } from '~/trpc/react';
import { default as Empty } from '../../_components/Empty';

export default function MyOrderPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [valueSearch, setValueSearch] = useState<string | null>(null);
  const { data: user } = useSession();
  const { data } = api.Order.getFilter.useQuery({ s: user?.user?.email || '' });
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const orders = data ?? [];
  const filteredOrders = selectedStatus
    ? orders?.filter(order => order.status.toLowerCase() === selectedStatus.toLowerCase())
    : orders;
  const filteredOrdersSearch = valueSearch
    ? filteredOrders?.filter(order => {
        const search = valueSearch?.toLowerCase() || '';
        return [order?.payment?.name, order?.status, order?.total?.toString(), order?.id?.toString()]
          .filter(Boolean)
          .some((field: any) => field?.toLowerCase().includes(search));
      })
    : filteredOrders;

  const totalPages = Math.ceil(filteredOrdersSearch.length / perPage);
  const displayedOrders = filteredOrdersSearch.slice((page - 1) * perPage, page * perPage);
  const statusCounts = Object.values(OrderStatus).map(status => ({
    status,
    count: orders?.reduce((acc, order) => (order.status === status ? acc + 1 : acc), 0) || 0
  }));

  const totalOrders = orders?.length || 0;
  const totalAmount = React.useMemo(() => {
    return orders?.reduce((total: number, item) => total + item.total, 0) || 0;
  }, [orders]);
  const mutationDelete = api.Order.delete.useMutation();
  const { openModal } = useModal();
  return (
    <Grid gutter='md'>
      <Grid.Col
        span={{ base: 12, md: 4, lg: 4 }}
        className='h-fit'
        pos={{ base: 'relative', lg: 'sticky' }}
        top={{ base: 0, lg: 70 }}
      >
        <Paper withBorder shadow='sm' p='md' className='h-full'>
          <Title order={3} className='mb-4 font-quicksand'>
            Thống kê nhanh
          </Title>
          <Grid gutter='md'>
            {statusCounts?.map(({ status, count }) => (
              <Grid.Col key={status} span={{ base: 12, sm: 4, md: 12, lg: 12 }}>
                <Card
                  withBorder
                  shadow='sm'
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedStatus === status ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedStatus(status === selectedStatus ? null : status)}
                >
                  <Flex align={'center'} gap={'md'}>
                    <RingProgress
                      size={80}
                      roundCaps
                      thickness={8}
                      sections={[{ value: (count / totalOrders) * 100, color: getStatusColor(status) }]}
                      label={<Center>{getStatusIcon(status)}</Center>}
                    />
                    <div>
                      <Text size='xl' className='font-bold'>
                        {count}
                      </Text>
                      <Text size='sm' c={getStatusColor(status)}>
                        {status}
                      </Text>
                      <Text size='xs' c='dimmed'>
                        Chiếm {((count / (totalOrders || 1)) * 100).toFixed(1)}%
                      </Text>
                    </div>
                  </Flex>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 8, lg: 8 }} className='h-fit'>
        <Paper withBorder shadow='sm' p='md' className='h-full'>
          <Flex
            justify={'space-between'}
            align={'flex-start'}
            direction={{ base: 'column', sm: 'row', md: 'row', lg: 'row' }}
            mb={{ base: 20, sm: 0, md: 0, lg: 0 }}
          >
            <Title order={3} className='mb-4 font-quicksand'>
              Chi tiết đặt hàng
            </Title>
            <Group gap={'xl'}>
              <Text size='lg' fw={700}>
                Tổng đơn: <b className='text-red-500'>{totalOrders}</b>
              </Text>
              <Text size='lg' fw={700}>
                Tổng chi: <b className='text-red-500'>{formatPriceLocaleVi(totalAmount)}</b>
              </Text>
            </Group>
          </Flex>
          <Stack my='md'>
            <SearchLocal setValue={setValueSearch} />
          </Stack>
          <div className={clsx('w-full overflow-x-auto', 'tableAdmin')}>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ minWidth: 100 }}>Mã đơn</Table.Th>
                  <Table.Th style={{ minWidth: 100 }}>Thanh toán</Table.Th>
                  <Table.Th style={{ minWidth: 100 }}>Tổng đơn</Table.Th>
                  <Table.Th style={{ minWidth: 100 }}>Tạo ngày</Table.Th>
                  <Table.Th style={{ minWidth: 100 }}>Trạng thái</Table.Th>
                  <Table.Th style={{ minWidth: 100 }}>Thao tác</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {!displayedOrders?.length ? (
                  <Table.Tr bg={'transparent'}>
                    <Table.Td colSpan={12}>
                      <Empty
                        title='Chưa có hóa đơn'
                        content={'Vui lòng mua hàng để tạo hóa đơn'}
                        url='/gio-hang'
                        size='md'
                      />
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  displayedOrders.map((order: any) => (
                    <Table.Tr key={order.id}>
                      <Table.Td>ORDER-{order.id}</Table.Td>
                      <Table.Td>{order.payment?.name}</Table.Td>
                      <Table.Td>{formatPriceLocaleVi(order.total)}</Table.Td>
                      <Table.Td>{formatDate(order.createdAt)}</Table.Td>
                      <Table.Td>
                        <Badge
                          size='xs'
                          color={getStatusColor(order.status)}
                          p={'xs'}
                          className='align-items-center flex'
                        >
                          <Flex align={'center'}>
                            {getStatusText(order.status)}
                            {getStatusIcon(order.status)}
                          </Flex>
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={8}>
                          <Tooltip label='Delete Order'>
                            <ActionIcon
                              color='red'
                              onClick={() => {
                                handleDelete({ id: order.id }, mutationDelete, 'Order');
                              }}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Tooltip>

                          {order?.status === OrderStatus.COMPLETED && <InvoiceToPrint id={order?.id || ''} />}

                          {order?.status === OrderStatus.PROCESSING && (
                            <Link href={`/thanh-toan/${order.id}`}>
                              <Tooltip label='Tiếp tục thanh toán'>
                                <Button size='xs'>Thanh toán</Button>
                              </Tooltip>
                            </Link>
                          )}

                          {order?.status === OrderStatus.CANCELLED && (
                            <Link href={`/thanh-toan/${order.id}`}>
                              <Tooltip label='Đặt lại đơn hàng'>
                                <Button size='xs'>Đặt lại</Button>
                              </Tooltip>
                            </Link>
                          )}
                          <Tooltip label='Chi tiết'>
                            <Button
                              size='xs'
                              onClick={() => {
                                openModal('orders', null, order);
                              }}
                            >
                              Chi tiết
                            </Button>
                          </Tooltip>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </div>
          <Flex
            mt='xl'
            justify='flex-end'
            align={'center'}
            gap={'md'}
            direction={{ base: 'column-reverse', md: 'row' }}
          >
            <Pagination total={totalPages} value={page} onChange={setPage} />
            <Select
              value={String(perPage)}
              w={100}
              onChange={value => {
                setPerPage(Number(value));
                setPage(1);
              }}
              data={['5', '10', '15', '20']}
            />
          </Flex>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
