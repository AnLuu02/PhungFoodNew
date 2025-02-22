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
  Text
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { formatPriceLocaleVi } from '~/app/lib/utils/format/formatPrice';

export default function ShoppingCartMobile() {
  const [cart, setCart, resetCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const updateQuantity = (id: number, quantity: number) => {
    setCart(items => items.map(item => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item)));
  };
  const coupon = 0;
  return cart.map((item: any) => {
    return (
      <Paper shadow='xs' radius='md' p={'xs'} mb={'xs'} withBorder key={item.id}>
        <Grid>
          <GridCol span={6}>
            <Group>
              <Box w={80} h={80} className=''>
                <Image
                  loading='lazy'
                  src={item.thumbnail || '/images/jpg/empty-300x240.jpg'}
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
          </GridCol>
          <GridCol span={6}>
            <Stack>
              <NumberInput
                thousandSeparator=','
                value={item.quantity}
                label='Số lượng'
                onChange={quantity => {
                  if (Number(quantity) === 0) {
                    setCart(cart.filter(cartItem => cartItem.id !== item.id));
                  }
                  updateQuantity(item.id, Number(quantity));
                }}
                min={0}
                max={99}
                style={{ width: '80px' }}
              />
              <Divider />

              <Text size='md' fw={700}>
                Giá:<b className='text-red-500'> {formatPriceLocaleVi(item.price)}</b>
              </Text>
              <Divider />
              <Text size='md' fw={700}>
                Được giảm: <b className='text-red-500'>{formatPriceLocaleVi(item.discount * item.quantity)}</b>
              </Text>
              <Divider />

              <Text size='md' fw={700}>
                Thành tiền:{' '}
                <b className='text-red-500'>{formatPriceLocaleVi((item.price - item.discount) * item.quantity)}</b>
              </Text>
            </Stack>
          </GridCol>
        </Grid>
      </Paper>
    );
  });
}
