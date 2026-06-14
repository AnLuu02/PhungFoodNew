'use client';

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Group,
  Menu,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  ThemeIcon,
  Title,
  Tooltip
} from '@mantine/core';
import { OrderStatus } from '@prisma/client';
import { IconCheck, IconChevronDown, IconMoodEmpty, IconTrash } from '@tabler/icons-react';
import { Session } from 'next-auth';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import InvoiceToPrint from '~/components/InvoceToPrint';
import { CommonSkeleton } from '~/components/Loading/LoadingSkeleton';
import PaginationLocal from '~/components/PaginationLocal';
import SearchLocal from '~/components/Search/SearchLocal';
import { useModalActions } from '~/contexts/ModalContext';
import { onHandleModalAction } from '~/lib/ButtonHandler/ButtonHandleAction';
import { formatDateViVN, formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { getStatusInfo, getTotalOrderStatus, ORDER_STATUS_UI } from '~/lib/FuncHandler/status-order';
import { TGetFilterOrder } from '~/shared/type-trpc/order.type-trpc';
import { api } from '~/trpc/react';
type DisplayOrder = TGetFilterOrder[number] & {
  date: string | undefined;
};

const primaryOrderTabs = [
  { value: 'all', label: 'Tất cả' },
  { value: OrderStatus.PENDING, label: 'Chờ xử lý' },
  { value: OrderStatus.UNPAID, label: 'Chưa thanh toán' }
];

const moreOrderTabs = [
  { value: OrderStatus.COMPLETED, label: 'Hoàn thành' },
  { value: OrderStatus.SHIPPING, label: 'Đang giao' },
  { value: OrderStatus.CANCELLED, label: 'Đã hủy' }
];

export function OrderList({ session }: { session: Session | null }) {
  const userId = session?.user?.id;
  const { data: orders, isLoading } = api.Order.getFilter.useQuery({ s: userId || '' });
  const [activeTab, setActiveTab] = useState<string>('all');
  const isMoreActive = moreOrderTabs.some(tab => tab.value === activeTab);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [valueSearch, setValueSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const utils = api.useUtils();
  const mutationDelete = api.Order.delete.useMutation({
    onSuccess: () => {
      utils.Order.invalidate();
    }
  });
  const { openModal } = useModalActions();

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(valueSearch), 300);
    return () => clearTimeout(handler);
  }, [valueSearch]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, perPage, debouncedSearch]);

  const { orderCompletedRate, orderCancledRate, orderData } = useMemo(() => {
    let orderCompletedRate = 0;
    let orderCancledRate = 0;
    let totalOrders = 0;
    if (orders && orders?.length > 0) {
      totalOrders = orders?.length ?? 0;
      const result = orders.reduce(
        (
          acc: {
            orderCompletedRate: number;
            orderCancledRate: number;
          },
          item: (typeof orders)[number]
        ) => {
          acc.orderCompletedRate += item?.status === OrderStatus.COMPLETED ? (1 / (totalOrders ?? 1)) * 100 : 0;
          acc.orderCancledRate += item?.status === OrderStatus.CANCELLED ? (1 / (totalOrders ?? 1)) * 100 : 0;
          return acc;
        },
        { orderCompletedRate: 0, orderCancledRate: 0 }
      );
      orderCompletedRate = result.orderCompletedRate;
      orderCancledRate = result.orderCancledRate;
    }

    return {
      orderCompletedRate,
      orderCancledRate,
      orderData:
        orders?.map((order: TGetFilterOrder[number]) => ({
          ...order,
          date: new Date(order.createdAt || new Date()).toISOString().split('T')[0],
          finalAmount: order?.finalAmount || 0,
          originalAmount: order?.originalAmount || 0,
          discountAmount: order?.discountAmount || 0
        })) || []
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orderData;
    return orderData.filter(({ status }) => status === activeTab);
  }, [orderData, activeTab]);

  const filteredOrdersSearch = useMemo(() => {
    if (!debouncedSearch) return filteredOrders;
    const search = debouncedSearch.toLowerCase();
    return filteredOrders.filter((order: DisplayOrder) =>
      [
        order?.payment?.name,
        order?.status,
        order?.finalAmount?.toString(),
        order?.originalAmount?.toString(),
        order?.discountAmount?.toString(),
        order?.id?.toString()
      ]
        .filter(Boolean)
        .some(field => field?.toLowerCase()?.includes(search))
    );
  }, [filteredOrders, debouncedSearch]);

  const totalPages = Math.ceil(filteredOrdersSearch.length / perPage);
  const displayedOrders = useMemo(
    () => filteredOrdersSearch.slice((page - 1) * perPage, page * perPage),
    [filteredOrdersSearch, page, perPage]
  );

  const statusObj = useMemo(() => {
    const orderData =
      orders?.map((order: TGetFilterOrder[number]) => ({
        id: order.id,
        date: new Date(order.createdAt ? order.createdAt : new Date()).toISOString().split('T')[0],

        finalAmount: order?.finalAmount || 0,
        status: order.status
      })) || [];
    const statusObj = getTotalOrderStatus(orderData);
    return { ...statusObj, cancelRate: 0 };
  }, [orders]);

  return (
    <>
      <Stack gap='xl'>
        <Paper
          p={{ base: 'lg', md: 'xl' }}
          className='relative overflow-hidden border border-mainColor/10 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-dark-card'
        >
          <Box className='absolute -right-24 -top-24 h-72 w-72 rounded-full bg-mainColor/10 blur-3xl' />
          <Box className='absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-subColor/10 blur-3xl' />

          <Stack gap='xl' className='relative'>
            <Flex
              align={{ base: 'stretch', sm: 'center' }}
              justify='space-between'
              direction={{ base: 'column', sm: 'row' }}
              gap='lg'
            >
              <Box>
                <Group gap='xs' mb={8}>
                  <Box className='h-px w-9 bg-mainColor' />

                  <Text size='xs' fw={900} tt='uppercase' lts={2} className='text-mainColor'>
                    Đơn hàng của bạn
                  </Text>
                </Group>

                <Title
                  order={2}
                  className='font-quicksand text-2xl font-black text-slate-950 dark:text-white sm:text-3xl'
                >
                  Quản lý đơn hàng
                </Title>

                <Text size='sm' c='dimmed' mt={6} className='max-w-xl leading-6'>
                  Theo dõi trạng thái xử lý, thanh toán và lịch sử các đơn hàng đã đặt tại Phụng Food.
                </Text>
              </Box>

              <Link href='/gio-hang'>
                <Button
                  size='md'
                  className='bg-mainColor px-5 text-white shadow-[0_12px_30px_rgba(21,93,252,0.22)] transition hover:-translate-y-0.5 hover:bg-mainColor/90'
                >
                  Tạo đơn hàng mới
                </Button>
              </Link>
            </Flex>

            {isLoading ? (
              <CommonSkeleton.StatsGrid cols={5} />
            ) : (
              <Stack gap='md'>
                <SimpleGrid cols={{ base: 2, sm: 3 }} spacing='md'>
                  {ORDER_STATUS_UI.map(item => (
                    <Paper
                      key={item.key}
                      p='md'
                      className='group relative overflow-hidden border border-slate-100 bg-slate-50/80 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_45px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
                    >
                      <Box
                        className='absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-15 transition group-hover:opacity-25'
                        style={{ backgroundColor: item.color }}
                      />

                      <Stack gap={10} className='relative'>
                        <Group justify='space-between' align='center' wrap='nowrap'>
                          <ThemeIcon size={40} radius='xl' color={item.color} variant='light'>
                            {item.icon}
                          </ThemeIcon>

                          <Text fw={900} className='font-quicksand text-2xl' style={{ color: item.color }}>
                            {statusObj[item.key] ?? 0}
                          </Text>
                        </Group>

                        <Text size='xs' fw={800} c='dimmed' lineClamp={1}>
                          {item.label}
                        </Text>
                      </Stack>
                    </Paper>
                  ))}
                </SimpleGrid>

                <SimpleGrid cols={{ base: 1, md: 2 }} spacing='md'>
                  <Paper p='md' className='border border-slate-100 bg-slate-50/80 dark:border-white/10 dark:bg-white/5'>
                    <Stack gap='sm'>
                      <Flex justify='space-between' align='flex-start' gap='md'>
                        <Box>
                          <Text fw={900} className='font-quicksand text-slate-950 dark:text-white'>
                            Tỷ lệ hoàn thành
                          </Text>

                          <Text size='xs' c='dimmed' mt={3}>
                            Đơn hàng đã được xử lý thành công.
                          </Text>
                        </Box>

                        <Text fw={900} className='font-quicksand text-xl text-green-600'>
                          {orderCompletedRate?.toFixed(1) ?? 0}%
                        </Text>
                      </Flex>

                      <Progress
                        value={orderCompletedRate ?? 0}
                        size='lg'
                        radius='xl'
                        color='green'
                        classNames={{
                          root: 'bg-white dark:bg-white/10'
                        }}
                      />
                    </Stack>
                  </Paper>

                  <Paper p='md' className='border border-slate-100 bg-slate-50/80 dark:border-white/10 dark:bg-white/5'>
                    <Stack gap='sm'>
                      <Flex justify='space-between' align='flex-start' gap='md'>
                        <Box>
                          <Text fw={900} className='font-quicksand text-slate-950 dark:text-white'>
                            Tỷ lệ hủy đơn
                          </Text>

                          <Text size='xs' c='dimmed' mt={3}>
                            Các đơn hàng đã bị hủy trong lịch sử đặt món.
                          </Text>
                        </Box>

                        <Text fw={900} className='font-quicksand text-xl text-red-600'>
                          {orderCancledRate?.toFixed(1) ?? 0}%
                        </Text>
                      </Flex>

                      <Progress
                        value={orderCancledRate ?? 0}
                        size='lg'
                        radius='xl'
                        color='red'
                        classNames={{
                          root: 'bg-white dark:bg-white/10'
                        }}
                      />
                    </Stack>
                  </Paper>
                </SimpleGrid>
              </Stack>
            )}
          </Stack>
        </Paper>

        <Paper
          p={{ base: 'md', sm: 'lg' }}
          className='relative overflow-hidden border border-slate-100 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-dark-card'
        >
          <Box className='absolute -right-24 -top-24 h-64 w-64 rounded-full bg-mainColor/10 blur-3xl' />

          <Tabs
            variant='unstyled'
            value={activeTab}
            onChange={value => setActiveTab(value as any)}
            className='relative'
          >
            <Flex
              align={{ base: 'stretch', md: 'center' }}
              justify='space-between'
              direction={{ base: 'column', md: 'row' }}
              gap='md'
              mb='lg'
            >
              <Box>
                <Text fw={900} className='font-quicksand text-xl text-slate-950 dark:text-white'>
                  Lịch sử đơn hàng
                </Text>

                <Text size='sm' c='dimmed' mt={4}>
                  Lọc nhanh theo trạng thái hoặc tìm kiếm mã đơn hàng.
                </Text>
              </Box>

              <Box className='w-full md:w-[320px] md:shrink-0'>
                <SearchLocal setValue={setValueSearch} />
              </Box>
            </Flex>

            <Flex
              align={{ base: 'stretch', md: 'center' }}
              justify='space-between'
              direction={{ base: 'column', md: 'row' }}
              gap='md'
              mb='lg'
            >
              <Group
                gap={8}
                wrap='nowrap'
                className='overflow-x-auto rounded-2xl bg-slate-50 p-1 [scrollbar-width:none] dark:bg-white/5 [&::-webkit-scrollbar]:hidden'
              >
                <Tabs.List>
                  <Group gap={8} wrap='nowrap'>
                    {primaryOrderTabs.map(tab => {
                      const active = activeTab === tab.value;

                      return (
                        <Tabs.Tab
                          key={tab.value}
                          value={tab.value}
                          className={[
                            'shrink-0 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-300',
                            active
                              ? 'bg-white text-mainColor shadow-sm dark:bg-dark-card dark:text-white'
                              : 'text-slate-500 hover:bg-white/80 hover:text-mainColor dark:text-dark-text dark:hover:bg-white/10'
                          ].join(' ')}
                        >
                          {tab.label}
                        </Tabs.Tab>
                      );
                    })}
                  </Group>
                </Tabs.List>

                <Menu position='bottom-start' shadow='lg' withinPortal>
                  <Menu.Target>
                    <Button
                      variant='subtle'
                      className={
                        isMoreActive
                          ? 'bg-white text-mainColor shadow-sm hover:bg-white dark:bg-dark-card dark:text-white'
                          : 'text-slate-500 hover:bg-white hover:text-mainColor dark:text-dark-text dark:hover:bg-white/10'
                      }
                      rightSection={<IconChevronDown size={16} />}
                    >
                      {isMoreActive ? moreOrderTabs.find(tab => tab.value === activeTab)?.label : 'Thêm'}
                    </Button>
                  </Menu.Target>

                  <Menu.Dropdown>
                    {moreOrderTabs.map(tab => {
                      const active = activeTab === tab.value;

                      return (
                        <Menu.Item
                          key={tab.value}
                          onClick={() => setActiveTab(tab.value as any)}
                          leftSection={active ? <IconCheck size={16} /> : null}
                          className={active ? 'font-bold text-mainColor' : ''}
                        >
                          {tab.label}
                        </Menu.Item>
                      );
                    })}
                  </Menu.Dropdown>
                </Menu>
              </Group>

              <Text size='sm' c='dimmed' className='md:text-right'>
                Hiển thị <b>{displayedOrders?.length || 0}</b> đơn hàng
              </Text>
            </Flex>

            <Tabs.Panel value={activeTab || 'all'}>
              <Box className='w-full overflow-hidden rounded-3xl border border-slate-100 dark:border-white/10'>
                <Box className='w-full overflow-x-auto'>
                  <Table verticalSpacing='md' highlightOnHover>
                    <Table.Thead>
                      <Table.Tr className='bg-slate-50 dark:bg-white/5'>
                        <Table.Th className='whitespace-nowrap'>Mã đơn</Table.Th>
                        <Table.Th className='whitespace-nowrap'>Ngày đặt</Table.Th>
                        <Table.Th className='whitespace-nowrap'>Tổng tiền</Table.Th>
                        <Table.Th className='whitespace-nowrap'>Trạng thái</Table.Th>
                        <Table.Th className='whitespace-nowrap'>Thao tác</Table.Th>
                      </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                      {isLoading ? (
                        <Table.Tr>
                          <Table.Td colSpan={5}>
                            <CommonSkeleton.Table />
                          </Table.Td>
                        </Table.Tr>
                      ) : displayedOrders?.length > 0 ? (
                        displayedOrders.map((order: DisplayOrder) => {
                          const statusInfo = getStatusInfo(order.status as OrderStatus);

                          return (
                            <Table.Tr key={order.id} className='transition hover:bg-slate-50/80 dark:hover:bg-white/5'>
                              <Table.Td maw={150}>
                                <Tooltip label={order.id} withArrow>
                                  <Text truncate fw={900} className='cursor-help text-mainColor'>
                                    #{order.id}
                                  </Text>
                                </Tooltip>
                              </Table.Td>

                              <Table.Td>
                                <Text size='sm' c='dimmed'>
                                  {formatDateViVN(order.date)}
                                </Text>
                              </Table.Td>

                              <Table.Td>
                                <Text size='sm' fw={900} className='text-slate-950 dark:text-white'>
                                  {formatPriceLocaleVi(order.finalAmount || 0)}
                                </Text>
                              </Table.Td>

                              <Table.Td>
                                <Badge
                                  radius='xl'
                                  size='lg'
                                  variant='light'
                                  leftSection={<statusInfo.icon size={15} />}
                                  color={statusInfo.color}
                                >
                                  {statusInfo.label}
                                </Badge>
                              </Table.Td>

                              <Table.Td>
                                <Group gap={8} wrap='nowrap'>
                                  {order?.status === OrderStatus.UNPAID && (
                                    <Link href={`/thanh-toan/${order.id}`}>
                                      <Button size='xs' className='bg-mainColor'>
                                        Thanh toán
                                      </Button>
                                    </Link>
                                  )}

                                  {order?.status === OrderStatus.CANCELLED && (
                                    <Link href={`/thanh-toan/${order.id}`}>
                                      <Button size='xs' variant='light'>
                                        Đặt lại
                                      </Button>
                                    </Link>
                                  )}

                                  {order?.status === OrderStatus.COMPLETED && (
                                    <InvoiceToPrint orderId={order?.id || ''} />
                                  )}

                                  <Button size='xs' variant='light' onClick={() => openModal('orders', null, order)}>
                                    Chi tiết
                                  </Button>

                                  <Tooltip label='Xóa đơn hàng'>
                                    <ActionIcon
                                      variant='light'
                                      color='red'
                                      onClick={() => {
                                        order?.id &&
                                          onHandleModalAction({
                                            type: 'delete',
                                            customProps: {
                                              onConfirm: async () => {
                                                await mutationDelete.mutateAsync({ id: order.id });
                                              }
                                            }
                                          });
                                      }}
                                    >
                                      <IconTrash size={16} />
                                    </ActionIcon>
                                  </Tooltip>
                                </Group>
                              </Table.Td>
                            </Table.Tr>
                          );
                        })
                      ) : (
                        <Table.Tr>
                          <Table.Td colSpan={5}>
                            <Center py={56}>
                              <Stack align='center' gap={8}>
                                <IconMoodEmpty />

                                <Text fw={900} className='font-quicksand text-lg'>
                                  Không có đơn hàng
                                </Text>

                                <Text size='sm' c='dimmed' ta='center' className='max-w-sm'>
                                  Khi bạn đặt món, đơn hàng sẽ hiển thị tại đây để bạn theo dõi trạng thái và thanh
                                  toán.
                                </Text>

                                <Link href='/gio-hang'>
                                  <Button mt='sm' className='bg-mainColor'>
                                    Đặt món ngay
                                  </Button>
                                </Link>
                              </Stack>
                            </Center>
                          </Table.Td>
                        </Table.Tr>
                      )}
                    </Table.Tbody>
                  </Table>
                </Box>
              </Box>
            </Tabs.Panel>
          </Tabs>

          <PaginationLocal
            onChangePage={setPage}
            onSetPerpage={setPerPage}
            page={page}
            perPage={perPage}
            totalPages={totalPages}
            dataSelectPerpage={[5, 10, 15, 20]}
          />
        </Paper>
      </Stack>
    </>
  );
}
