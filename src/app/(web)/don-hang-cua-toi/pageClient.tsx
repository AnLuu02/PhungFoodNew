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
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import Empty from '~/components/Empty';
import { TOP_POSITION_STICKY } from '~/constants';
import { useModalActions } from '~/contexts/ModalContext';
import { confirmDelete } from '~/lib/button-handle/ButtonDeleteConfirm';
import { formatDateViVN, formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { getStatusInfo } from '~/lib/func-handler/status-order';
import { LocalOrderStatus } from '~/lib/zod/EnumType';
import { api } from '~/trpc/react';

const InvoiceToPrint = dynamic(() => import('~/components/InvoceToPrint'), {
  ssr: false
});
const SearchLocal = dynamic(() => import('~/components/Search/SearchLocal'), {
  ssr: false
});
export default function MyOrderPageClient({ data }: any) {
  const { openModal } = useModalActions();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [valueSearch, setValueSearch] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const orders = data ?? [];

  const filteredOrders = useMemo(() => {
    if (!selectedStatus) return orders;
    return orders.filter((order: any) => order.status.toLowerCase() === selectedStatus.toLowerCase());
  }, [orders, selectedStatus]);

  const filteredOrdersSearch = useMemo(() => {
    if (!valueSearch) return filteredOrders;
    const search = valueSearch.toLowerCase();
    return filteredOrders.filter((order: any) =>
      [
        order?.payment?.name,
        order?.status,
        formatDateViVN(order?.createdAt),
        order?.originalTotal?.toString(),
        order?.finalTotal?.toString(),
        order?.discountAmount?.toString(),
        order?.id?.toString()
      ]
        .filter(Boolean)
        .some((field: any) => field.toLowerCase().includes(search))
    );
  }, [filteredOrders, valueSearch]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredOrdersSearch.length / perPage);
  }, [filteredOrdersSearch]);

  const displayedOrders = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredOrdersSearch.slice(start, start + perPage);
  }, [filteredOrdersSearch, page, perPage]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((order: any) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [orders]);

  const totalOrders = orders.length || 0;
  const totalAmount = useMemo(
    () =>
      orders.reduce((sum: any, order: any) => {
        if (order.status === LocalOrderStatus.COMPLETED) {
          return sum + order.finalTotal;
        }
        return sum;
      }, 0),
    [orders]
  );

  const mutationDelete = api.Order.delete.useMutation();

  return (
    <Grid gutter='md'>
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
              <Card
                withBorder
                shadow='sm'
                h='100%'
                className='cursor-pointer bg-gray-200 transition-all duration-300 dark:bg-dark-card'
              >
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
            {statusCounts.map(({ status, count }) => {
              const statusInfo = getStatusInfo(status as LocalOrderStatus);
              return (
                <Grid.Col key={status} span={{ base: 6, sm: 4, md: 6, lg: 6 }}>
                  <Card
                    withBorder
                    shadow='sm'
                    h='100%'
                    className={`cursor-pointer transition-all duration-300 ${selectedStatus === status ? 'ring-2 ring-blue-500' : 'hover:bg-mainColor/10'} `}
                    onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
                  >
                    <RingProgress
                      size={50}
                      roundCaps
                      thickness={5}
                      sections={[{ value: (count / totalOrders) * 100, color: statusInfo.color }]}
                      pos='absolute'
                      top={2}
                      right={2}
                      className='hidden sm:block'
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
                      <Text size='sm' c={statusInfo.color} fw={700}>
                        {statusInfo.label}
                      </Text>
                      <Text size='xs' c='dimmed'>
                        Chiếm {((count / totalOrders) * 100).toFixed(1)}%
                      </Text>
                    </Stack>
                  </Card>
                </Grid.Col>
              );
            })}
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
            <Box className={`tableAdmin w-full overflow-x-auto`}>
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
                    displayedOrders.map((order: any) => {
                      const statusInfo = getStatusInfo(order.status as LocalOrderStatus);
                      return (
                        <Table.Tr key={order.id}>
                          <Table.Td w={100} className='max-w-[100px] overflow-hidden'>
                            <Tooltip label={order.id} withArrow>
                              <span className='block cursor-help truncate font-medium text-blue-600'>{order.id}</span>
                            </Tooltip>
                          </Table.Td>
                          <Table.Td className='text-sm'>
                            <Highlight size='sm' highlight={valueSearch || ''}>
                              {order.payment?.name || 'Chưa thanh toán'}
                            </Highlight>
                          </Table.Td>
                          <Table.Td className='text-sm'>
                            <Highlight size='sm' highlight={valueSearch || ''}>
                              {formatPriceLocaleVi(order.finalTotal || 0)}
                            </Highlight>
                          </Table.Td>
                          <Table.Td className='text-sm'>
                            <Highlight size='sm' highlight={valueSearch || ''}>
                              {formatDateViVN(order.createdAt)}
                            </Highlight>
                          </Table.Td>
                          <Table.Td className='text-sm'>
                            <Tooltip label={statusInfo.label}>
                              <Badge leftSection={<statusInfo.icon size={16} />} color={statusInfo.color}>
                                {statusInfo.label}
                              </Badge>
                            </Tooltip>
                          </Table.Td>
                          <Table.Td className='text-sm'>
                            <Group gap={8}>
                              <Tooltip label='Xóa đơn hàng'>
                                <ActionIcon
                                  color='red'
                                  onClick={() =>
                                    confirmDelete({
                                      id: { id: order.id },
                                      mutationDelete,
                                      entityName: 'đơn hàng'
                                    })
                                  }
                                >
                                  <IconTrash size={16} />
                                </ActionIcon>
                              </Tooltip>
                              {order.status === LocalOrderStatus.COMPLETED && <InvoiceToPrint id={order.id} />}
                              {order.status === LocalOrderStatus.UNPAID && (
                                <Link href={`/thanh-toan/${order.id}`}>
                                  <Tooltip label='Tiếp tục thanh toán'>
                                    <Button size='xs'>Thanh toán</Button>
                                  </Tooltip>
                                </Link>
                              )}
                              {order.status === LocalOrderStatus.CANCELLED && (
                                <Link href={`/thanh-toan/${order.id}`}>
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
                      );
                    })
                  )}
                </Table.Tbody>
              </Table>
            </Box>
            <Flex justify='flex-end' align='center' gap='md' direction={{ base: 'column-reverse', md: 'row' }}>
              <Pagination
                classNames={{
                  control:
                    'hover:bg-mainColor/10 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white'
                }}
                total={totalPages}
                value={page}
                onChange={setPage}
              />
              <Select
                value={String(perPage)}
                w={100}
                radius='md'
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
