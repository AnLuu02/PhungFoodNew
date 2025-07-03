'use client';
import { Box, Card, Center, Divider, Group, ScrollAreaAutosize, Stack, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useMemo } from 'react';
import Empty from '~/components/Empty';
import CartItemFastMenu from '~/components/Web/Home/components/CartItemFastMenu';
import { formatPriceLocaleVi } from '~/lib/func-handler/formatPrice';
import { getImageProduct } from '~/lib/func-handler/getImageProduct';
import { LocalImageType } from '~/lib/zod/EnumType';
import { ButtonCheckout } from '../../thanh-toan/components/ButtonCheckout';

const QuickCart = () => {
  const [cart, setCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const updateQuantity = (id: number, quantity: number) => {
    setCart(cart.map(item => (item.id === id ? { ...item, quantity } : item)));
  };

  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity || 0), 0);
  }, [cart]);

  return (
    <Card radius={'md'} bg={'gray.2'}>
      <Card.Section>
        <Stack>
          <ScrollAreaAutosize mah={'40vh'}>
            {!cart?.length ? (
              <>
                <Empty hasButton={false} size='xs' title='Giỏ hàng trống' content='Vui lòng mua hàng' />
                <Center>
                  <Divider mt={'md'} w={'90%'} />
                </Center>
              </>
            ) : (
              cart.map(item => (
                <Box key={item?.id}>
                  <CartItemFastMenu
                    key={item?.id}
                    image={
                      getImageProduct(item?.images || [], LocalImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg'
                    }
                    name={item?.name}
                    price={item?.price}
                    quantity={item?.quantity}
                    onQuantityChange={(value: any) => updateQuantity(item?.id, value)}
                    onDelete={() => removeItem(item?.id)}
                  />

                  <Divider />
                </Box>
              ))
            )}
          </ScrollAreaAutosize>

          <Group justify='space-between' className='px-4'>
            <Text fw={500}>Tổng tiền:</Text>
            <Text fw={700} size='lg' c='red'>
              {formatPriceLocaleVi(total)}
            </Text>
          </Group>

          <Stack gap='md' className='px-4' mb={10}>
            <ButtonCheckout
              total={total}
              data={cart}
              stylesButtonCheckout={{ title: 'Thanh toán', fullWidth: true, size: 'md', radius: 'sm' }}
            />
          </Stack>
        </Stack>
      </Card.Section>
    </Card>
  );
};

export default QuickCart;
