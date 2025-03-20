'use client';

import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Center,
  Flex,
  Grid,
  GridCol,
  Group,
  Progress,
  Table,
  Tabs,
  Text,
  Tooltip
} from '@mantine/core';
import { OrderStatus } from '@prisma/client';
import { IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import InvoiceToPrint from '~/app/_components/Invoices/InvoceToPrint';
import LoadingComponent from '~/app/_components/Loading/Loading';
import { useModal } from '~/app/contexts/ModalContext';
import { handleDelete } from '~/app/lib/utils/button-handle/ButtonDeleteConfirm';
import { formatDate } from '~/app/lib/utils/func-handler/formatDate';
import { formatPriceLocaleVi } from '~/app/lib/utils/func-handler/formatPrice';
import {
  getStatusColor,
  getStatusIcon,
  getStatusText,
  getTotalOrderStatus
} from '~/app/lib/utils/func-handler/get-status-order';
import { api } from '~/trpc/react';
export default function OrderList({ orders, isLoading }: any) {
  const [activeTab, setActiveTab] = useState<string | null>('all');
  const mockOrders =
    orders?.map((order: any) => ({
      ...order,
      date: new Date(order.createdAt).toISOString().split('T')[0] || new Date('yyyy-mm-dd'),
      total: order.total
    })) || [];
  const mutationDelete = api.Order.delete.useMutation();

  const filteredOrders =
    activeTab === 'all' ? mockOrders : mockOrders.filter((order: any) => order.status === activeTab);

  const statusObj = getTotalOrderStatus(mockOrders);
  const { openModal } = useModal();

  return isLoading ? (
    <LoadingComponent />
  ) : (
    <Card shadow='sm' padding='lg' radius='md' withBorder>
      <Grid p={0} mb={'md'}>
        <GridCol span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
          <Badge color='green' size='lg' w={'100%'}>
            <Text ta='center' fw={700} size={'sm'}>
              <Text component='span' fw={700} mr={5}>
                {statusObj.completed}
              </Text>
              Hoàn thành
            </Text>
          </Badge>
        </GridCol>
        <GridCol span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
          <Badge color='yellow.9' size='lg' w={'100%'}>
            <Text ta='center' fw={700} size={'sm'}>
              <Text component='span' fw={700} mr={5}>
                {statusObj.processing}
              </Text>
              Đang xử lý
            </Text>
          </Badge>
        </GridCol>
        <GridCol span={{ base: 12, sm: 4, md: 4, lg: 4 }}>
          <Badge color='red' size='lg' w={'100%'}>
            <Text ta='center' fw={700} size={'sm'}>
              <Text component='span' fw={700} mr={5}>
                {statusObj.canceled}
              </Text>
              Đã hủy
            </Text>
          </Badge>
        </GridCol>
      </Grid>

      <Text fw={500} mb='xs' size='sm'>
        Tỷ lệ hoàn thành đơn hàng
      </Text>
      <Progress value={statusObj.completionRate} size='xl' radius='xl' mb='xs' />
      <Text size='sm' color='dimmed' mb='md'>
        {statusObj.completionRate?.toFixed(1)}% đơn đặt hàng của bạn đã được hoàn thành thành công
      </Text>

      <Tabs variant='pills' content='center' value={activeTab} onChange={setActiveTab}>
        <Tabs.List className='flex justify-end' bg={'gray.1'} mb={'md'}>
          <Group gap={0}>
            <Tabs.Tab size={'md'} fw={700} value='all'>
              Tất cả
            </Tabs.Tab>
            <Tabs.Tab size={'md'} fw={700} value={OrderStatus.COMPLETED}>
              Hoàn thành
            </Tabs.Tab>

            <Tabs.Tab size={'md'} fw={700} value={OrderStatus.PROCESSING}>
              Chưa thanh toán
            </Tabs.Tab>

            <Tabs.Tab size={'md'} fw={700} value={OrderStatus.PENDING}>
              Chờ xử lý
            </Tabs.Tab>

            <Tabs.Tab size={'md'} fw={700} value={OrderStatus.DELIVERED}>
              Đang giao hàng
            </Tabs.Tab>

            <Tabs.Tab size={'md'} fw={700} value={OrderStatus.CANCELLED}>
              Đã hủy
            </Tabs.Tab>
          </Group>
        </Tabs.List>

        <Tabs.Panel value={activeTab || 'all'}>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead className='rounded-lg text-sm uppercase leading-normal'>
              <Table.Tr>
                <Table.Th>Mã đơn</Table.Th>
                <Table.Th>Ngày đặt hàng</Table.Th>
                <Table.Th>Tổng tiền</Table.Th>
                <Table.Th>Trạng thái</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredOrders?.length > 0 ? (
                filteredOrders.map((order: any) => (
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
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Center>
                      <Text size='sm' color='dimmed'>
                        Không có đơn hàng
                      </Text>
                    </Center>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
}
