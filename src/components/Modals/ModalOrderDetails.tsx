'use client';

import {
  Avatar,
  Badge,
  Box,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  Modal,
  ScrollAreaAutosize,
  Spoiler,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconCreditCard, IconPackage, IconTag, IconTruck } from '@tabler/icons-react';
import { formatDate, formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { getStatusColor, getStatusIcon, getStatusText } from '~/lib/func-handler/get-status-order';
import { getImageProduct } from '~/lib/func-handler/getImageProduct';
import { LocalImageType, LocalVoucherType } from '~/lib/zod/EnumType';
import InvoiceToPrint from '../InvoceToPrint';

function ModalOrderDetails({ type, order, opened, close }: { type: any; order: any; opened: any; close: any }) {
  const isDesktop = useMediaQuery(`(min-width:1024px)`);
  return (
    <>
      <Modal
        scrollAreaComponent={ScrollAreaAutosize}
        className='animate-fadeBottom'
        opened={opened && type === 'orders'}
        radius={'md'}
        onClose={close}
        size={!isDesktop ? '100%' : '70%'}
        h={'max-content'}
        transitionProps={{ transition: 'fade-down', duration: 200 }}
        padding='md'
        title={
          <Group gap='md'>
            <ThemeIcon size={40} radius='md' variant='light' color='teal'>
              <IconPackage style={{ width: 24, height: 24 }} />
            </ThemeIcon>
            <Box>
              <Title order={2}>Thông tin đơn hàng</Title>
              <Text size='sm' c={'dimmed'}>
                #{order?.id}
              </Text>
            </Box>
            <InvoiceToPrint id={order?.id || ''} />
          </Group>
        }
        pos={'relative'}
        styles={{
          header: {},
          content: {
            overflow: 'hidden'
          }
        }}
      >
        {type === 'orders' && (
          <Grid gutter='md'>
            <Grid.Col span={{ base: 12, sm: 12, md: 12, lg: 5 }}>
              <ScrollAreaAutosize scrollbarSize={5} mah={540}>
                <Stack mr={'xs'}>
                  <Card withBorder radius='md'>
                    <Group justify='space-between' mb='md'>
                      <Text fw={700} size='md'>
                        Chi tiết
                      </Text>
                    </Group>
                    <Stack gap={'md'}>
                      <Text size='sm' className='flex items-center justify-between'>
                        Mã đơn: <b>{order?.id}</b>
                      </Text>
                      <Text size='sm' className='flex items-center justify-between'>
                        Ngày đặt: <b>{formatDate(order?.createdAt)}</b>
                      </Text>

                      <Flex align={'center'} justify={'space-between'}>
                        <Text size='sm' className='flex items-center justify-between'>
                          Trạng thái:
                        </Text>
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
                      </Flex>
                    </Stack>
                  </Card>

                  <Card withBorder radius='md'>
                    <Group gap='md'>
                      <ThemeIcon size={40} radius='md' variant='light' color='blue'>
                        <IconCreditCard style={{ width: 24, height: 24 }} />
                      </ThemeIcon>
                      <Box>
                        <Text fw={700} size='md'>
                          Phương thức thanh toán
                        </Text>
                        <Text size='sm' c='dimmed'>
                          {order?.payment?.name || 'Chưa thanh toán'}
                        </Text>
                      </Box>
                    </Group>
                  </Card>

                  <Card withBorder radius='md'>
                    <Group justify='space-between' mb='md'>
                      <Text fw={700} size='md'>
                        Chi tiết thanh toán
                      </Text>
                    </Group>
                    <Stack>
                      <Box className='flex items-center justify-between'>
                        <Text size='sm'>Tổng tiền hàng:</Text>
                        <Text fw={700} size='md'>
                          {formatPriceLocaleVi(order.originalTotal || 0)}
                        </Text>
                      </Box>
                      {order?.vouchers?.length > 0 && (
                        <Box className='space-y-2'>
                          <Text size='xs' className='flex items-center gap-2 font-medium text-gray-700'>
                            <IconTag className='h-4 w-4' />
                            Voucher áp dụng
                          </Text>
                          {order.vouchers.map((voucher: any) => (
                            <Box key={voucher.id} className='ml-6 space-y-1'>
                              <Box className='flex items-center justify-between'>
                                <Box className='flex items-center gap-2'>
                                  <Badge
                                    variant='outline'
                                    radius={'md'}
                                    className='border-red-200 bg-red-50 text-xs text-red-600'
                                  >
                                    {voucher.name}
                                  </Badge>
                                  <span className='text-sm text-gray-600'>
                                    (
                                    {voucher.type === LocalVoucherType.PERCENTAGE
                                      ? `${voucher.discountValue}%`
                                      : formatPriceLocaleVi(voucher.value)}
                                    )
                                  </span>
                                </Box>
                                <span className='font-medium text-red-600'>
                                  -{formatPriceLocaleVi(voucher.discount)}
                                </span>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}

                      <Box className='flex items-center justify-between'>
                        <Text size='sm'> Phí vận chuyển:</Text>
                        <Text fw={700} size='sm'>
                          Miễn phí
                        </Text>
                      </Box>
                      <Divider />

                      {order?.discountAmount > 0 && (
                        <Text size='md' fw={700} className='flex items-center justify-between text-red-600'>
                          Tổng giảm giá: <b>-{formatPriceLocaleVi(order?.discountAmount)}</b>
                        </Text>
                      )}

                      <Text
                        size='sm'
                        className='flex items-center justify-between rounded-lg bg-emerald-50 p-3 text-lg font-bold text-emerald-600'
                      >
                        Thành tiền:
                        <b className='font-semibold'>{formatPriceLocaleVi(order?.finalTotal || 0)}</b>
                      </Text>
                    </Stack>
                  </Card>

                  <Card withBorder radius='md'>
                    <Group gap='md' mb='md'>
                      <ThemeIcon size={40} radius='md' variant='light' color='grape'>
                        <IconTruck style={{ width: 24, height: 24 }} />
                      </ThemeIcon>
                      <Text fw={700} size='md'>
                        Thông tin vận chuyển
                      </Text>
                    </Group>
                    <Stack gap='xs'>
                      <Text size='sm'>
                        <b>Khách hàng:</b> {order?.delivery?.name || order?.user?.name}
                      </Text>
                      <Text size='sm'>
                        <b>Email:</b> {order?.delivery?.email || order?.user?.email}
                      </Text>
                      {order?.user?.address?.fullAddress && (
                        <Text size='sm'>
                          <b>Địa chỉ:</b> {order?.user?.address?.fullAddress || order?.user?.address?.fullAddress}
                        </Text>
                      )}
                      <Text size='sm'>
                        <b>Địa chỉ nhận:</b> {order?.delivery?.address?.fullAddress || 'Chờ cập nhật.'}
                      </Text>

                      <Spoiler
                        maxHeight={66}
                        showLabel='Xem thêm'
                        hideLabel='Ẩn'
                        classNames={{
                          control: 'text-sm font-bold text-mainColor'
                        }}
                      >
                        <Text size='sm'>
                          <b>Ghi chú:</b> {order?.delivery?.note || 'Không có./'}
                        </Text>
                      </Spoiler>
                    </Stack>
                  </Card>
                </Stack>
              </ScrollAreaAutosize>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 12, md: 12, lg: 7 }}>
              <ScrollAreaAutosize scrollbarSize={5} mah={540}>
                <Card withBorder radius='md'>
                  <Group gap='md' mb='md'>
                    <ThemeIcon size={40} radius='md' variant='light' color='teal'>
                      <IconPackage style={{ width: 24, height: 24 }} />
                    </ThemeIcon>
                    <Text fw={700} size='md'>
                      Các mặt hàng đã đặt
                    </Text>
                  </Group>
                  <Divider />
                  <Table striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Sản phẩm</Table.Th>
                        <Table.Th>Ảnh</Table.Th>
                        <Table.Th>Số lượng</Table.Th>
                        <Table.Th>Giá</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {order?.orderItems.map((item: any) => (
                        <Table.Tr key={item.id}>
                          <Table.Td w={'40%'}>{item.product.name}</Table.Td>
                          <Table.Td className='text-sm'>
                            <Avatar
                              size={40}
                              src={
                                getImageProduct(item?.product?.images || [], LocalImageType.THUMBNAIL) ||
                                '/images/jpg/empty-300x240.jpg'
                              }
                              radius={'md'}
                            />
                          </Table.Td>

                          <Table.Td className='text-sm'>{item.quantity}</Table.Td>
                          <Table.Td className='text-sm'>{formatPriceLocaleVi(item.price)}</Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Card>
              </ScrollAreaAutosize>
            </Grid.Col>
          </Grid>
        )}
      </Modal>
    </>
  );
}

export default ModalOrderDetails;
