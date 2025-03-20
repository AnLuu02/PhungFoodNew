'use client';

import {
  Badge,
  Box,
  Button,
  Divider,
  Grid,
  GridCol,
  Group,
  Image,
  NumberInput,
  Paper,
  Stack,
  Table,
  Text
} from '@mantine/core';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';
import { ImageType } from '@prisma/client';
import { breakpoints } from '~/app/lib/utils/constants/device';
import { formatPriceLocaleVi } from '~/app/lib/utils/func-handler/formatPrice';
import { getImageProduct } from '~/app/lib/utils/func-handler/getImageProduct';
import Empty from '../../_components/Empty';
import RecapCart from '../thanh-toan/_components/recapCart';
import ShoppingCartMobile from './_mobile/gio-hang-mobile';

export default function ShoppingCart() {
  const [cart, setCart, resetCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.sm - 1}px)`);
  const updateQuantity = (id: number, quantity: number) => {
    setCart(items => items.map(item => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item)));
  };

  return cart.length === 0 ? (
    <Empty url='/thuc-don' title='Giỏ hàng trống' content='Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.' />
  ) : (
    <Grid>
      <GridCol span={{ base: 12, md: 8 }} className='h-fit' order={{ base: 2, sm: 1, md: 1, lg: 1 }}>
        {isMobile ? (
          <ShoppingCartMobile />
        ) : (
          <Paper shadow='xs' radius='md' className='p-0 md:p-6'>
            <Table className='mb-6'>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Thông tin</Table.Th>
                  <Table.Th>Đơn giá</Table.Th>
                  <Table.Th>Số lượng</Table.Th>
                  <Table.Th>Giảm giá</Table.Th>
                  <Table.Th>Thành tiền</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {cart.map(item => (
                  <Table.Tr key={item.id}>
                    <Table.Td>
                      <Group wrap='nowrap'>
                        <Box w={80} h={80} className='hidden md:block'>
                          <Image
                            loading='lazy'
                            src={
                              getImageProduct(item?.images || [], ImageType.THUMBNAIL) ||
                              '/images/jpg/empty-300x240.jpg'
                            }
                            w={80}
                            h={80}
                            radius='md'
                            alt={item.name}
                          />
                        </Box>
                        <Stack gap='xs' align='start'>
                          <Text size='md' fw={700}>
                            {item.name}
                          </Text>
                          <Group>
                            <Button
                              h={'max-content'}
                              c={'red'}
                              variant='transparent'
                              w={'max-content'}
                              size='xs'
                              p={0}
                              m={0}
                              onClick={() => setCart(cart.filter(cartItem => cartItem.id !== item.id))}
                            >
                              Xóa
                            </Button>
                            {item?.discount > 0 && (
                              <Badge color='red'>
                                {item?.discount ? `-${formatPriceLocaleVi(item?.discount)} ` : `180.000đ`}
                              </Badge>
                            )}
                          </Group>
                        </Stack>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text className='text-red-500' size='md' fw={700}>
                        {item.price.toLocaleString()}₫
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <NumberInput
                        thousandSeparator=','
                        clampBehavior='strict'
                        value={item.quantity}
                        onChange={quantity => {
                          if (Number(quantity) === 0) {
                            setCart(cart.filter(cartItem => cartItem.id !== item.id));
                          }
                          updateQuantity(item.id, Number(quantity));
                        }}
                        min={0}
                        max={Number(item?.availableQuantity) || 100}
                        style={{ width: '80px' }}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Text className='text-red-500' size='md' fw={700}>
                        {formatPriceLocaleVi(item.discount * item.quantity)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text className='text-red-500' size='md' fw={700}>
                        {formatPriceLocaleVi((item.price - item.discount) * item.quantity)}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
            <Divider mb={10} />
          </Paper>
        )}
      </GridCol>
      <GridCol
        span={{ base: 12, md: 4 }}
        className='h-fit'
        pos={'sticky'}
        top={70}
        order={{ base: 1, sm: 2, md: 2, lg: 2 }}
      >
        <RecapCart order={cart} loading={false} paymentMethod={''} type={'cart'} />
      </GridCol>
    </Grid>
  );
}
