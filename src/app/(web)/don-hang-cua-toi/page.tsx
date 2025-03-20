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
  Paper,
  RingProgress,
  Table,
  Text,
  Title,
  Tooltip
} from '@mantine/core';
import { OrderStatus } from '@prisma/client';
import { IconTrash } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';
import InvoiceToPrint from '~/app/_components/Invoices/InvoceToPrint';
import { useModal } from '~/app/contexts/ModalContext';
import { handleDelete } from '~/app/lib/utils/button-handle/ButtonDeleteConfirm';
import { formatDate } from '~/app/lib/utils/func-handler/formatDate';
import { formatPriceLocaleVi } from '~/app/lib/utils/func-handler/formatPrice';
import { getStatusColor, getStatusIcon, getStatusText } from '~/app/lib/utils/func-handler/get-status-order';
import { api } from '~/trpc/react';
import { default as Empty } from '../../_components/Empty';

export default function MyOrderPage() {
  const { data: user } = useSession();
  const { data, isLoading } = api.Order.getFilter.useQuery({ query: user?.user?.email || '' });
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const orders = data ?? [];
  const filteredOrders = selectedStatus
    ? orders?.filter(order => order.status.toLowerCase() === selectedStatus.toLowerCase())
    : orders;
  const statusCounts = [
    { status: OrderStatus.PROCESSING, count: orders?.filter(i => i.status === OrderStatus.PROCESSING)?.length || 0 },
    { status: OrderStatus.PENDING, count: orders?.filter(i => i.status === OrderStatus.PENDING)?.length || 0 },
    { status: OrderStatus.DELIVERED, count: orders?.filter(i => i.status === OrderStatus.DELIVERED)?.length || 0 },
    { status: OrderStatus.COMPLETED, count: orders?.filter(i => i.status === OrderStatus.COMPLETED)?.length || 0 },
    { status: OrderStatus.CANCELLED, count: orders?.filter(i => i.status === OrderStatus.CANCELLED)?.length || 0 }
  ];
  const totalOrders = orders?.length || 0;
  const totalAmount = React.useMemo(() => {
    return orders?.reduce((total: number, item) => total + item.total, 0) || 0;
  }, [orders]);
  const mutationDelete = api.Order.delete.useMutation();
  const { openModal } = useModal();

  return (
    <Grid gutter='md'>
      <Grid.Col span={{ base: 12, md: 4, lg: 4 }} className='h-fit' pos={'sticky'} top={70}>
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
                  <Group>
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
                        {((count / (totalOrders || 1)) * 100).toFixed(1)}% of total
                      </Text>
                    </div>
                  </Group>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 8, lg: 8 }} className='h-fit'>
        <Paper withBorder shadow='sm' p='md' className='h-full'>
          <Flex justify={'space-between'} align={'flex-start'}>
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
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Thanh toán</Table.Th>
                <Table.Th>Tổng đơn</Table.Th>
                <Table.Th>Tạo ngày</Table.Th>
                <Table.Th>Trạng thái</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {!filteredOrders?.length ? (
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
                filteredOrders.map((order: any) => (
                  <Table.Tr key={order.id}>
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
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
