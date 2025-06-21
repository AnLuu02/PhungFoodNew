'use client';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Flex,
  Grid,
  Group,
  Highlight,
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
import { IconTrash } from '@tabler/icons-react';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useModal } from '~/app/contexts/ModalContext';
import { handleDelete } from '~/app/lib/utils/button-handle/ButtonDeleteConfirm';
import { TOP_POSITION_STICKY } from '~/app/lib/utils/constants/constant';
import { formatDate } from '~/app/lib/utils/func-handler/formatDate';
import { formatPriceLocaleVi } from '~/app/lib/utils/func-handler/formatPrice';
import { getStatusColor, getStatusIcon, getStatusText } from '~/app/lib/utils/func-handler/get-status-order';
import { LocalOrderStatus } from '~/app/lib/utils/zod/EnumType';
import { api } from '~/trpc/react';

const InvoiceToPrint = dynamic(() => import('~/app/_components/Invoices/InvoceToPrint'), { ssr: false });
const SearchLocal = dynamic(() => import('~/app/_components/Search/SearchLocal'));
const Empty = dynamic(() => import('../../_components/Empty'));
export default function MyOrderPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [valueSearch, setValueSearch] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const { data: user } = useSession();
  const { data } = api.Order.getFilter.useQuery({ s: user?.user?.email || '' });
  const orders = data ?? [];

  const filteredOrders = useMemo(() => {
    if (!selectedStatus) return orders;
    return orders.filter(order => order.status.toLowerCase() === selectedStatus.toLowerCase());
  }, [orders, selectedStatus]);

  const filteredOrdersSearch = useMemo(() => {
    if (!valueSearch) return filteredOrders;
    const search = valueSearch.toLowerCase();
    return filteredOrders.filter(order =>
      [
        order?.payment?.name,
        order?.status,
        formatDate(order?.createdAt),
        order?.total?.toString(),
        order?.id?.toString()
      ]
        .filter(Boolean)
        .some((field: any) => field.toLowerCase().includes(search))
    );
  }, [filteredOrders, valueSearch]);

  const totalPages = Math.ceil(filteredOrdersSearch.length / perPage);
  const displayedOrders = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredOrdersSearch.slice(start, start + perPage);
  }, [filteredOrdersSearch, page, perPage]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach(order => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [orders]);

  const totalOrders = orders.length;
  const totalAmount = useMemo(() => orders.reduce((sum, order) => sum + order.total, 0), [orders]);

  const mutationDelete = api.Order.delete.useMutation();
  const { openModal } = useModal();

  return (
    <Grid gutter='md'>
      {/* Sidebar */}
      <Grid.Col
        span={{ base: 12, sm: 12, md: 5, lg: 4 }}
        className='h-fit'
        pos={{ base: 'relative', lg: 'sticky' }}
        top={{ base: 0, lg: TOP_POSITION_STICKY }}
      >
        <Paper withBorder shadow='sm' p='md' className='h-full'>
          <Title order={3} className='mb-4 font-quicksand'>
            Thống kê nhanh
          </Title>
          <Grid gutter='md'>
            <Grid.Col span={{ base: 6, sm: 4, md: 6, lg: 6 }}>
              <Card withBorder bg='gray.2' shadow='sm' h='100%' className='cursor-pointer transition-all duration-300'>
                <Stack gap={0}>
                  <Text size='xl' className='font-bold'>
                    {totalOrders}
                  </Text>
                  <Text size='sm' c='dimmed' fw={700}>
                    Đơn hàng
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
            {statusCounts.map(({ status, count }) => (
              <Grid.Col key={status} span={{ base: 6, sm: 4, md: 6, lg: 6 }}>
                <Card
                  withBorder
                  shadow='sm'
                  h='100%'
                  className={clsx('cursor-pointer transition-all duration-300', {
                    'ring-2 ring-blue-500': selectedStatus === status,
                    'hover:bg-gray-50': selectedStatus !== status
                  })}
                  onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
                >
                  <RingProgress
                    size={50}
                    roundCaps
                    thickness={5}
                    sections={[{ value: (count / totalOrders) * 100, color: getStatusColor(status) }]}
                    pos='absolute'
                    top={2}
                    right={2}
                    className='hidden md:block'
                    label={
                      <Center>
                        <Text size='xs' c='dimmed' fw={700}>
                          {count}
                        </Text>
                      </Center>
                    }
                  />
                  <Stack gap={0}>
                    <Text size='xl' className='font-bold'>
                      {count}
                    </Text>
                    <Text size='sm' c={getStatusColor(status)} fw={700}>
                      {getStatusText(status)}
                    </Text>
                    <Text size='xs' c='dimmed'>
                      Chiếm {((count / totalOrders) * 100).toFixed(1)}%
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 12, md: 7, lg: 8 }} className='h-fit'>
        <Paper withBorder shadow='sm' p='md' className='h-full'>
          <Stack gap={5}>
            <Flex justify='space-between' align='flex-start' gap='xs' direction={{ base: 'column', sm: 'row' }}>
              <Title order={3} className='font-quicksand'>
                Chi tiết đặt hàng
              </Title>
              <Group gap='xl'>
                <Text size='lg' fw={700}>
                  Tổng đơn: <b className='text-red-500'>{totalOrders}</b>
                </Text>
                <Text size='lg' fw={700}>
                  Tổng chi: <b className='text-red-500'>{formatPriceLocaleVi(totalAmount)}</b>
                </Text>
              </Group>
            </Flex>
            <Flex justify='space-between' align='center' my='xs'>
              <Box w={{ base: '100%', sm: 300 }}>
                <SearchLocal setValue={setValueSearch} />
              </Box>
            </Flex>
            <Box className={clsx('w-full overflow-x-auto', 'tableAdmin')}>
              <Table striped highlightOnHover withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Mã đơn</Table.Th>
                    <Table.Th>Thanh toán</Table.Th>
                    <Table.Th>Tổng đơn</Table.Th>
                    <Table.Th>Tạo ngày</Table.Th>
                    <Table.Th>Trạng thái</Table.Th>
                    <Table.Th>Thao tác</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {!displayedOrders.length ? (
                    <Table.Tr>
                      <Table.Td colSpan={6}>
                        <Empty
                          title='Chưa có đơn hàng nào'
                          content='Vui lòng mua hàng để tạo hóa đơn'
                          url='/gio-hang'
                          size='xs'
                        />
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    displayedOrders.map(order => (
                      <Table.Tr key={order.id}>
                        <Table.Td>
                          <Highlight size='sm' highlight={valueSearch || ''}>
                            {`ORDER-${order.id}`}
                          </Highlight>
                        </Table.Td>
                        <Table.Td>
                          <Highlight size='sm' highlight={valueSearch || ''}>
                            {order.payment?.name || 'Chưa thanh toán'}
                          </Highlight>
                        </Table.Td>
                        <Table.Td>
                          <Highlight size='sm' highlight={valueSearch || ''}>
                            {formatPriceLocaleVi(order.total)}
                          </Highlight>
                        </Table.Td>
                        <Table.Td>
                          <Highlight size='sm' highlight={valueSearch || ''}>
                            {formatDate(order.createdAt)}
                          </Highlight>
                        </Table.Td>
                        <Table.Td>
                          <Tooltip label={getStatusText(order.status)}>
                            <Badge size='xs' color={getStatusColor(order.status)} p='xs'>
                              <Flex align='center'>
                                <Text size='10px' fw={700}>
                                  {getStatusText(order.status)}
                                </Text>
                                {getStatusIcon(order.status)}
                              </Flex>
                            </Badge>
                          </Tooltip>
                        </Table.Td>
                        <Table.Td>
                          <Group gap={8}>
                            <Tooltip label='Xóa đơn hàng'>
                              <ActionIcon
                                color='red'
                                onClick={() => handleDelete({ id: order.id }, mutationDelete, 'Order')}
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            </Tooltip>
                            {order.status === LocalOrderStatus.COMPLETED && <InvoiceToPrint id={order.id} />}
                            {order.status === LocalOrderStatus.PROCESSING && (
                              <Link href={`/thanh-toan/${order.id}`} prefetch={false}>
                                <Tooltip label='Tiếp tục thanh toán'>
                                  <Button size='xs'>Thanh toán</Button>
                                </Tooltip>
                              </Link>
                            )}
                            {order.status === LocalOrderStatus.CANCELLED && (
                              <Link href={`/thanh-toan/${order.id}`} prefetch={false}>
                                <Tooltip label='Đặt lại đơn hàng'>
                                  <Button size='xs'>Đặt lại</Button>
                                </Tooltip>
                              </Link>
                            )}
                            <Tooltip label='Chi tiết'>
                              <Button size='xs' onClick={() => openModal('orders', null, order)}>
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
            </Box>
            <Flex justify='flex-end' align='center' gap='md' direction={{ base: 'column-reverse', md: 'row' }}>
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
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
