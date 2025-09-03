'use client';

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Group,
  Pagination,
  Progress,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  ThemeIcon,
  Title,
  Tooltip
} from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import InvoiceToPrint from '~/components/InvoceToPrint';
import SearchLocal from '~/components/Search/SearchLocal';
import { useModal } from '~/contexts/ModalContext';
import { confirmDelete } from '~/lib/button-handle/ButtonDeleteConfirm';
import { formatDateViVN, formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { getStatusInfo, getTotalOrderStatus, ORDER_STATUS_UI } from '~/lib/func-handler/status-order';
import { LocalOrderStatus } from '~/lib/zod/EnumType';
import { api } from '~/trpc/react';

export default function OrderList({ orders }: { orders: any }) {
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
      orders?.map((order: any) => ({
        ...order,
        date: new Date(order.createdAt || new Date()).toISOString().split('T')[0],
        finalTotal: order?.finalTotal || 0,
        originalTotal: order?.originalTotal || 0,
        discountAmount: order?.discountAmount || 0
      })) || [],
    [orders]
  );

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orderData;
    return orderData.filter((order: any) => order.status === activeTab);
  }, [orderData, activeTab]);

  const filteredOrdersSearch = useMemo(() => {
    if (!debouncedSearch) return filteredOrders;
    const search = debouncedSearch.toLowerCase();
    return filteredOrders.filter((order: any) =>
      [
        order?.payment?.name,
        order?.status,
        order?.finalTotal?.toString(),
        order?.originalTotal?.toString(),
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

  const { statusObj }: any = useMemo(() => {
    const orderData =
      orders?.map((order: any) => ({
        id: order.id,
        date: new Date(order.createdAt).toISOString().split('T')[0] || new Date('yyyy-mm-dd'),
        finalTotal: order?.finalTotal || 0,
        status: order.status
      })) || [];
    const statusObj = getTotalOrderStatus(orderData);
    return { statusObj };
  }, [orders]);

  return (
    <Stack>
      <Flex className='sm:items-center' gap={'md'} justify={'space-between'} direction={{ base: 'column', sm: 'row' }}>
        <Box w={{ base: '100%', sm: '50%' }}>
          <Title order={2} className='font-quicksand'>
            Quản lý đơn hàng
          </Title>
          <Text size='sm' c={'dimmed'}>
            Theo dõi và quản lý tất cả đơn hàng của bạn
          </Text>
        </Box>
        <Button className='rounded-md bg-mainColor hover:bg-mainColor/90'>Tạo đơn hàng mới</Button>
      </Flex>
      <Card shadow='sm' padding='lg' radius='md' withBorder>
        <SimpleGrid cols={{ base: 2, sm: 2, md: 3, xl: 5 }} mb={'lg'}>
          {ORDER_STATUS_UI.map(status => (
            <Box
              bg={`${status.color}10`}
              className={`flex min-w-[120px] items-center gap-[10px] rounded-md px-4 py-3 shadow-md`}
              key={status.key}
            >
              <ThemeIcon size={32} radius='xl' color={status.color} variant='light'>
                {status.icon}
              </ThemeIcon>
              <Box>
                <Text fw={700} size='md' style={{ color: status.color }}>
                  {statusObj[status.key] ?? 0}
                </Text>
                <Text size='xs' c='dimmed'>
                  {status.label}
                </Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>

        <Flex mt={'md'} gap={'md'} justify={'space-between'} direction={{ base: 'column', sm: 'row' }}>
          <Stack gap={'xs'} className='w-[100%] sm:w-[45%]'>
            <Text fw={500} size='sm'>
              Tỷ lệ hoàn thành đơn hàng
            </Text>
            <Progress value={statusObj.completionRate} size='md' radius='xl' />
            <Text size='sm' c='dimmed'>
              {statusObj.completionRate?.toFixed(1)}% đơn đặt hàng của bạn đã được hoàn thành thành công
            </Text>
          </Stack>

          <Divider orientation='vertical' size={2} mx={'md'} />

          <Stack gap={'xs'} className='w-[100%] sm:w-[45%]'>
            <Text fw={500} size='sm'>
              Tỷ lệ hủy đơn
            </Text>
            <Progress value={statusObj.completionRate} size='md' radius='xl' />
            <Text size='sm' c='dimmed'>
              {statusObj.completionRate?.toFixed(1)}% đơn đặt hàng của bạn đã bị hủy
            </Text>
          </Stack>
        </Flex>
      </Card>
      <Card shadow='sm' padding='lg' radius='md' withBorder>
        <Tabs
          variant='pills'
          content='center'
          value={activeTab}
          radius={'md'}
          onChange={(value: any) => setActiveTab(value)}
          styles={{
            tab: {
              border: '1px solid',
              marginRight: 6
            }
          }}
          classNames={{
            tab: `!rounded-md !border-[#e5e5e5] !font-bold hover:bg-mainColor/10 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed`
          }}
        >
          <Tabs.List mb={'md'} p={0}>
            <Flex w={'100%'} direction={{ base: 'column', sm: 'column', md: 'column', lg: 'row' }}>
              <Group gap={0} p={0} m={0}>
                <Tabs.Tab size={'md'} fw={500} value='all'>
                  Tất cả
                </Tabs.Tab>
                <Tabs.Tab size={'md'} fw={500} value={LocalOrderStatus.COMPLETED}>
                  Hoàn thành
                </Tabs.Tab>
                <Tabs.Tab size={'md'} fw={500} value={LocalOrderStatus.PENDING}>
                  Chờ xác nhận
                </Tabs.Tab>
                <Tabs.Tab size={'md'} fw={500} value={LocalOrderStatus.UNPAID}>
                  Chưa thanh toán
                </Tabs.Tab>
                <Tabs.Tab size={'md'} fw={500} value={LocalOrderStatus.SHIPPING}>
                  Đang giao
                </Tabs.Tab>
                <Tabs.Tab size={'md'} fw={500} value={LocalOrderStatus.CANCELLED}>
                  Đã hủy
                </Tabs.Tab>
              </Group>
              <Flex flex={1} justify={'space-between'} align={'center'} mt={{ base: 'xs', sm: 'xs', md: 'xs', lg: 0 }}>
                <Box w={0}></Box>
                <Box w={{ base: '100%', sm: 300, md: 300, lg: 300 }}>
                  <SearchLocal setValue={setValueSearch} />
                </Box>
              </Flex>
            </Flex>
          </Tabs.List>

          <Tabs.Panel value={activeTab || 'all'}>
            <Box className={`tableAdmin w-full overflow-x-auto`}>
              <Table striped highlightOnHover withTableBorder withColumnBorders>
                <Table.Thead className='rounded-lg text-sm uppercase leading-normal'>
                  <Table.Tr>
                    <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                      Mã đơn
                    </Table.Th>
                    <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                      Ngày đặt hàng
                    </Table.Th>
                    <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                      Tổng tiền
                    </Table.Th>
                    <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                      Trạng thái
                    </Table.Th>
                    <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                      Thao tác
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {displayedOrders?.length > 0 ? (
                    displayedOrders.map((order: any) => {
                      const statusInfo = getStatusInfo(order.status as LocalOrderStatus);
                      return (
                        <Table.Tr key={order.id}>
                          <Table.Td w={100} style={{ maxWidth: 100, overflow: 'hidden' }}>
                            <Tooltip label={order.id} withArrow>
                              <span className='block cursor-help truncate font-medium text-blue-600'>{order.id}</span>
                            </Tooltip>
                          </Table.Td>
                          <Table.Td className='text-sm'>{formatDateViVN(order.date)}</Table.Td>
                          <Table.Td className='text-sm'>{formatPriceLocaleVi(order.finalTotal || 0)}</Table.Td>
                          <Table.Td style={{ textTransform: 'capitalize' }}>
                            <Badge
                              size='xs'
                              color={statusInfo.color || 'gray'}
                              p={'xs'}
                              className='align-items-center flex'
                            >
                              <Flex align={'center'}>
                                <Text size='10px' fw={700}>
                                  {statusInfo.label}
                                </Text>
                                <statusInfo.icon />
                              </Flex>
                            </Badge>
                          </Table.Td>
                          <Table.Td className='text-sm'>
                            <Group gap={8}>
                              <Tooltip label='Xóa đơn hàng'>
                                <ActionIcon
                                  color='red'
                                  onClick={() => {
                                    confirmDelete({
                                      id: { id: order.id },
                                      mutationDelete,
                                      entityName: 'đơn hàng'
                                    });
                                  }}
                                >
                                  <IconTrash size={16} />
                                </ActionIcon>
                              </Tooltip>

                              {order?.status === LocalOrderStatus.COMPLETED && <InvoiceToPrint id={order?.id || ''} />}

                              {order?.status === LocalOrderStatus.UNPAID && (
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
                      );
                    })
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
            </Box>
          </Tabs.Panel>
        </Tabs>
        <Flex mt='xl' justify='flex-end' align={'center'} gap={'md'} direction={{ base: 'column-reverse', md: 'row' }}>
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
            onChange={value => {
              setPerPage(Number(value));
              setPage(1);
            }}
            data={['5', '10', '15', '20']}
          />
        </Flex>
      </Card>
    </Stack>
  );
}
