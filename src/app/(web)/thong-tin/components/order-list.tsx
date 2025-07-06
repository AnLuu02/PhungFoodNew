'use client';

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Flex,
  Group,
  Pagination,
  Progress,
  Select,
  Table,
  Tabs,
  Text,
  Tooltip
} from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import InvoiceToPrint from '~/components/InvoceToPrint';
import SearchLocal from '~/components/Search/SearchLocal';
import { useModal } from '~/contexts/ModalContext';
import { handleDelete } from '~/lib/button-handle/ButtonDeleteConfirm';
import { formatDate } from '~/lib/func-handler/formatDate';
import { formatPriceLocaleVi } from '~/lib/func-handler/formatPrice';
import { getStatusColor, getStatusIcon, getStatusText, getTotalOrderStatus } from '~/lib/func-handler/get-status-order';
import { LocalOrderStatus } from '~/lib/zod/EnumType';
import { api } from '~/trpc/react';

export default function OrderList({ data }: { data: any[] }) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [valueSearch, setValueSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const mutationDelete = api.Order.delete.useMutation();
  const { openModal } = useModal();

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(valueSearch), 300);
    return () => clearTimeout(handler);
  }, [valueSearch]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, perPage, debouncedSearch]);

  const orderData = useMemo(
    () =>
      data?.map(order => ({
        ...order,
        date: new Date(order.createdAt).toISOString().split('T')[0],
        total: order.total
      })) || [],
    [data]
  );

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orderData;
    return orderData.filter(order => order.status === activeTab);
  }, [orderData, activeTab]);

  const filteredOrdersSearch = useMemo(() => {
    if (!debouncedSearch) return filteredOrders;
    const search = debouncedSearch.toLowerCase();
    return filteredOrders.filter(order =>
      [order?.payment?.name, order?.status, order?.total?.toString(), order?.id?.toString()]
        .filter(Boolean)
        .some(field => field.toLowerCase().includes(search))
    );
  }, [filteredOrders, debouncedSearch]);

  const totalPages = Math.ceil(filteredOrdersSearch.length / perPage);
  const displayedOrders = useMemo(
    () => filteredOrdersSearch.slice((page - 1) * perPage, page * perPage),
    [filteredOrdersSearch, page, perPage]
  );

  const statusObj = useMemo(() => getTotalOrderStatus(orderData), [orderData]);

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder>
      <Flex wrap={'wrap'} align={'center'} gap={10} mb={'xs'}>
        <Badge color={getStatusColor(LocalOrderStatus.COMPLETED)} size='lg' w={'max-content'}>
          <Text ta='center' fw={700} size={'sm'}>
            <Text component='span' fw={700} mr={5}>
              {statusObj.completed}
            </Text>
            Hoàn thành
          </Text>
        </Badge>
        <Badge color={getStatusColor(LocalOrderStatus.PROCESSING)} size='lg' w={'max-content'}>
          <Text ta='center' fw={700} size={'sm'}>
            <Text component='span' fw={700} mr={5}>
              {statusObj.processing}
            </Text>
            Chưa thanh toán
          </Text>
        </Badge>
        <Badge color={getStatusColor(LocalOrderStatus.PENDING)} size='lg' w={'max-content'}>
          <Text ta='center' fw={700} size={'sm'}>
            <Text component='span' fw={700} mr={5}>
              {statusObj.pending}
            </Text>
            Chờ xử lý
          </Text>
        </Badge>
        <Badge color={getStatusColor(LocalOrderStatus.DELIVERED)} size='lg' w={'max-content'}>
          <Text ta='center' fw={700} size={'sm'}>
            <Text component='span' fw={700} mr={5}>
              {statusObj.delivered}
            </Text>
            Đang giao hàng
          </Text>
        </Badge>
        <Badge color={getStatusColor(LocalOrderStatus.CANCELLED)} size='lg' w={'max-content'}>
          <Text ta='center' fw={700} size={'sm'}>
            <Text component='span' fw={700} mr={5}>
              {statusObj.canceled}
            </Text>
            Đã hủy
          </Text>
        </Badge>
      </Flex>

      <Text fw={500} mb='xs' size='sm'>
        Tỷ lệ hoàn thành đơn hàng
      </Text>
      <Progress value={statusObj.completionRate} size='xl' radius='xl' mb='xs' />
      <Text size='sm' c='dimmed' mb='md'>
        {statusObj.completionRate?.toFixed(1)}% đơn đặt hàng của bạn đã được hoàn thành thành công
      </Text>

      <Tabs
        variant='pills'
        content='center'
        value={activeTab}
        onChange={(value: any) => setActiveTab(value)}
        styles={{
          tab: {
            border: '1px solid #228be6',
            margin: 6
          }
        }}
      >
        <Tabs.List className='bg-gray-100' mb={'md'} p={'xs'}>
          <Flex w={'100%'} direction={{ base: 'column', sm: 'column', md: 'column', lg: 'row' }}>
            <Group gap={0}>
              <Tabs.Tab size={'md'} fw={500} value='all'>
                Tất cả
              </Tabs.Tab>
              <Tabs.Tab size={'md'} fw={500} value={LocalOrderStatus.COMPLETED}>
                Hoàn thành
              </Tabs.Tab>

              <Tabs.Tab size={'md'} fw={500} value={LocalOrderStatus.PENDING}>
                Chờ xử lý
              </Tabs.Tab>
              <Tabs.Tab size={'md'} fw={500} value={LocalOrderStatus.PROCESSING}>
                Chưa thanh toán
              </Tabs.Tab>

              <Tabs.Tab size={'md'} fw={500} value={LocalOrderStatus.DELIVERED}>
                Đang giao hàng
              </Tabs.Tab>
              <Tabs.Tab size={'md'} fw={500} value={LocalOrderStatus.CANCELLED}>
                Đã hủy
              </Tabs.Tab>
            </Group>
            {/* <Stack flex={1} ml={{ base: 0, sm: 0, md: 0, lg: 'md' }} mt={{ base: 'xs', sm: 'xs', md: 'xs', lg: 0 }}>
              <SearchLocal setValue={setValueSearch} />
            </Stack> */}
            <Flex flex={1} justify={'space-between'} align={'center'} mt={{ base: 'xs', sm: 'xs', md: 'xs', lg: 0 }}>
              <Box w={0}></Box>
              <Box w={{ base: '100%', sm: 300, md: 300, lg: 300 }}>
                <SearchLocal setValue={setValueSearch} />
              </Box>
            </Flex>
          </Flex>
        </Tabs.List>

        <Tabs.Panel value={activeTab || 'all'}>
          <div className={clsx('w-full overflow-x-auto', 'tableAdmin')}>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
              <Table.Thead className='rounded-lg text-sm uppercase leading-normal'>
                <Table.Tr>
                  <Table.Th style={{ minWidth: 100 }}>Mã đơn</Table.Th>
                  <Table.Th style={{ minWidth: 100 }}>Ngày đặt hàng</Table.Th>
                  <Table.Th style={{ minWidth: 100 }}>Tổng tiền</Table.Th>
                  <Table.Th style={{ minWidth: 100 }}>Trạng thái</Table.Th>
                  <Table.Th style={{ minWidth: 100 }}>Thao tác</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {displayedOrders?.length > 0 ? (
                  displayedOrders.map((order: any) => (
                    <Table.Tr key={order.id}>
                      <Table.Td>{order.id}</Table.Td>
                      <Table.Td>{formatDate(order.date)}</Table.Td>
                      <Table.Td>{formatPriceLocaleVi(order.total)}</Table.Td>
                      <Table.Td style={{ textTransform: 'capitalize' }}>
                        <Badge
                          size='xs'
                          color={getStatusColor(order.status)}
                          p={'xs'}
                          className='align-items-center flex'
                        >
                          <Flex align={'center'}>
                            <Text size='10px' fw={700}>
                              {getStatusText(order.status)}
                            </Text>
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

                          {order?.status === LocalOrderStatus.COMPLETED && <InvoiceToPrint id={order?.id || ''} />}

                          {order?.status === LocalOrderStatus.PROCESSING && (
                            <Link href={`/thanh-toan/${order.id}`}>
                              <Tooltip label='Tiếp tục thanh toán'>
                                <Button size='xs'>Thanh toán</Button>
                              </Tooltip>
                            </Link>
                          )}

                          {order?.status === LocalOrderStatus.CANCELLED && (
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
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={4}>
                      <Center>
                        <Text size='sm' c='dimmed'>
                          Không có đơn hàng
                        </Text>
                      </Center>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </div>
        </Tabs.Panel>
      </Tabs>
      <Flex mt='xl' justify='flex-end' align={'center'} gap={'md'} direction={{ base: 'column-reverse', md: 'row' }}>
        <Pagination classNames={{ control: 'bg-mainColor' }} total={totalPages} value={page} onChange={setPage} />
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
    </Card>
  );
}
