import { Badge, Box, Button, Divider, Grid, GridCol, Group, NumberInput, Paper, Stack, Text } from '@mantine/core';
import Image from 'next/image';
import { formatPriceLocaleVi } from '~/lib/func-handler/formatPrice';
import { getImageProduct } from '~/lib/func-handler/getImageProduct';
import { LocalImageType } from '~/lib/zod/EnumType';

export default function ShoppingCartMobile({ cart, setCart }: any) {
  const updateQuantity = (id: number, quantity: number) => {
    setCart((items: any) =>
      items.map((item: any) => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item))
    );
  };
  return cart.map((item: any) => (
    <Paper shadow='xs' radius='md' p={'xs'} mb={'xs'} withBorder key={item.id}>
      <Grid>
        <GridCol span={6}>
          <Group>
            <Box w={80} h={80} className='overflow-hidden rounded-md' pos={'relative'}>
              <Image
                loading='lazy'
                src={getImageProduct(item?.images || [], LocalImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg'}
                fill
                style={{ objectFit: 'cover' }}
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
                  onClick={() => setCart(cart.filter((cartItem: any) => cartItem.id !== item.id))}
                >
                  Xóa
                </Button>
                {item?.discount > 0 && (
                  <Badge color='red'>{item?.discount ? `-${formatPriceLocaleVi(item?.discount)} ` : `180.000đ`}</Badge>
                )}
              </Group>
            </Stack>
          </Group>
        </GridCol>
        <GridCol span={6}>
          <Stack>
            <NumberInput
              thousandSeparator=','
              clampBehavior='strict'
              value={item.quantity}
              label='Số lượng'
              onChange={quantity => {
                if (Number(quantity) === 0) {
                  setCart(cart.filter((cartItem: any) => cartItem.id !== item.id));
                }
                updateQuantity(item.id, Number(quantity));
              }}
              min={0}
              max={Number(item?.availableQuantity) || 100}
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
  ));
}
