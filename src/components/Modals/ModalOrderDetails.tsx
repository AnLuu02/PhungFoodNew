'use client';

import {
  Avatar,
  Badge,
  Card,
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
  Title,
  rem
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconCreditCard, IconPackage, IconTruck } from '@tabler/icons-react';
import { formatDate } from '~/lib/func-handler/formatDate';
import { formatPriceLocaleVi } from '~/lib/func-handler/formatPrice';
import { getStatusColor, getStatusIcon, getStatusText } from '~/lib/func-handler/get-status-order';
import { getImageProduct } from '~/lib/func-handler/getImageProduct';
import { LocalImageType } from '~/lib/zod/EnumType';
import InvoiceToPrint from '../InvoceToPrint';

function ModalOrderDetails({ type, order, opened, close }: { type: any; order: any; opened: any; close: any }) {
  const notDesktop = useMediaQuery(`(max-width: 1023px)`);
  return (
    <>
      <Modal
        scrollAreaComponent={ScrollAreaAutosize}
        className='animate-fadeBottom'
        opened={opened && type === 'orders'}
        radius={'md'}
        onClose={close}
        size={notDesktop ? '100%' : '70%'}
        h={'max-content'}
        transitionProps={{ transition: 'fade-down', duration: 200 }}
        padding='md'
        title={
          <Group align='center'>
            <Title order={2}>Thông tin đơn hàng</Title>
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
                <Stack>
                  <Card withBorder radius='md'>
                    <Group justify='space-between' mb='md'>
                      <Text fw={700} size='md'>
                        Chi tiết
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
                    </Group>
                    <Stack gap={5}>
                      <Text size='sm'>
                        <strong>Mã đơn:</strong> {order?.id}
                      </Text>
                      <Text size='sm'>
                        <strong>Ngày đặt:</strong> {formatDate(order?.createdAt)}
                      </Text>
                      <Text size='sm'>
                        <strong>Tổng:</strong> {formatPriceLocaleVi(order?.total)}
                      </Text>
                    </Stack>
                  </Card>

                  <Card withBorder radius='md'>
                    <Group gap='md' mb='md'>
                      <ThemeIcon size={40} radius='md' variant='light' color='grape'>
                        <IconTruck style={{ width: rem(24), height: rem(24) }} />
                      </ThemeIcon>
                      <Text fw={700} size='md'>
                        Thông tin vận chuyển
                      </Text>
                    </Group>
                    <Stack gap='xs'>
                      <Text size='sm'>
                        <strong>Khách hàng:</strong> {order?.delivery?.name}
                      </Text>
                      <Text size='sm'>
                        <strong>Email:</strong> {order?.delivery?.email}
                      </Text>
                      {order?.user?.address?.fullAddress && (
                        <Text size='sm'>
                          <strong>Địa chỉ:</strong> {order?.user?.address?.fullAddress}
                        </Text>
                      )}
                      <Text size='sm'>
                        <strong>Địa chỉ nhận:</strong>{' '}
                        {order?.delivery?.address?.fullAddress || '123 Main St, Anytown, AN 12345'}
                      </Text>

                      <Spoiler
                        maxHeight={66}
                        showLabel='Xem thêm'
                        hideLabel='Ẩn'
                        styles={{
                          control: { color: '#008b4b', fontWeight: 700, fontSize: '14px' }
                        }}
                      >
                        <Text size='sm'>
                          <strong>Ghi chú:</strong>{' '}
                          {order?.delivery?.note ||
                            'Please leave the package at the front door if no one answers. asd asd asdasdasdasd asdasd ádasd'}
                        </Text>
                      </Spoiler>
                    </Stack>
                  </Card>
                  <Card withBorder radius='md'>
                    <Group gap='md'>
                      <ThemeIcon size={40} radius='md' variant='light' color='blue'>
                        <IconCreditCard style={{ width: rem(24), height: rem(24) }} />
                      </ThemeIcon>
                      <div>
                        <Text fw={700} size='md'>
                          Phương thức thanh toán
                        </Text>
                        <Text size='sm' c='dimmed'>
                          {order?.payment?.name || 'Chưa thanh toán'}
                        </Text>
                      </div>
                    </Group>
                  </Card>
                </Stack>
              </ScrollAreaAutosize>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 12, md: 12, lg: 7 }}>
              <ScrollAreaAutosize scrollbarSize={5} mah={540}>
                <Card withBorder radius='md'>
                  <Group gap='md' mb='md'>
                    <ThemeIcon size={40} radius='md' variant='light' color='teal'>
                      <IconPackage style={{ width: rem(24), height: rem(24) }} />
                    </ThemeIcon>
                    <Text fw={700} size='md'>
                      Các mặt hàng đã đặt
                    </Text>
                  </Group>
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
                          <Table.Td>
                            <Avatar
                              size={40}
                              src={
                                getImageProduct(item?.product?.images || [], LocalImageType.THUMBNAIL) ||
                                '/images/jpg/empty-300x240.jpg'
                              }
                              radius={'md'}
                            />
                          </Table.Td>

                          <Table.Td>{item.quantity}</Table.Td>
                          <Table.Td>{formatPriceLocaleVi(item.price)}</Table.Td>
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
