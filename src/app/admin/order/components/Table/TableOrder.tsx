'use client';

import { Badge, Box, Flex, Group, Highlight, Table, Text } from '@mantine/core';
import PageSizeSelector from '~/components/Admin/Perpage';
import CustomPagination from '~/components/Pagination';
import { formatDateViVN, formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { getStatusInfo } from '~/lib/func-handler/status-order';
import { LocalOrderStatus } from '~/lib/zod/EnumType';
import {
  CancleOrderButton,
  DeleteOrderButton,
  HandleStateOrderButton,
  SendMessageOrderButton,
  SendOrderButton,
  UpdateOrderButton
} from '../Button';

export default function TableOrder({ s, data, user }: { data: any; s: string; user?: any }) {
  const currentItems = data?.orders || [];

  return (
    <>
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
                        <Badge size='xs' color={statusInfo.color} p='xs' className='align-items-center flex'>
                          <Flex align='center'>
                            <Text size='10px' fw={700}>
                              {statusInfo.label}
                            </Text>
                            <statusInfo.icon />
                          </Flex>
                        </Badge>
                      </Group>
                    </Table.Td>
                    <Table.Td className='text-sm'>
                      <Group className='text-center'>
                        {user?.user && (
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
                              {order.status !== LocalOrderStatus.CANCELLED && <CancleOrderButton id={order.id} />}
                              <UpdateOrderButton id={order.id} />
                              {(user.user.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN ||
                                user.user.role?.name === 'ADMIN') && <DeleteOrderButton id={order.id} />}
                            </Group>
                            <Group>
                              <SendOrderButton order={order} />
                              {order.status !== LocalOrderStatus.COMPLETED && (
                                <SendMessageOrderButton userId={order.user?.id} email={order.user?.email} />
                              )}
                            </Group>
                          </>
                        )}
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                );
              })
            ) : (
              <Table.Tr>
                <Table.Td colSpan={7} className='bg-gray-100 text-center'>
                  <Text size='md' c='dimmed'>
                    Không có bản ghi phù hợp.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Box>

      <Group justify='space-between' mt='md'>
        <PageSizeSelector />
        <CustomPagination totalPages={data?.pagination.totalPages || 1} />
      </Group>
    </>
  );
}
