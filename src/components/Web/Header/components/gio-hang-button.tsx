'use client';
import { Box, Button, Divider, Flex, Group, Menu, ScrollAreaAutosize, Stack, Text } from '@mantine/core';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';
import { IconShoppingBag } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import BButton from '~/components/Button';
import { formatPriceLocaleVi } from '~/lib/func-handler/formatPrice';
import { getImageProduct } from '~/lib/func-handler/getImageProduct';
import { LocalImageType } from '~/lib/zod/EnumType';
import CartItemFastMenu from '../../Home/components/CartItemFastMenu';

const CartButton = () => {
  const isDesktop = useMediaQuery(`(min-width: 1024px)`);
  const [cart, setCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });

  const updateQuantity = (id: number, quantity: number) => {
    setCart(cart.map(item => (item.id === id ? { ...item, quantity } : item)));
  };

  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Menu
      shadow='md'
      width={350}
      trigger='hover'
      disabled={!isDesktop}
      transitionProps={{ transition: 'fade-down', duration: 300, exitDelay: 300, enterDelay: 300 }}
    >
      <Menu.Target>
        <Link href='/gio-hang' className='text-white'>
          <Button
            variant='outline'
            className='border-mainColor text-mainColor hover:bg-mainColor hover:text-white'
            radius={'xl'}
            leftSection={
              <div className='relative inline-block'>
                <IconShoppingBag size={20} className='text-mainColor' />
                <span className='absolute -right-2 -top-2 z-[100] flex h-[15px] w-[15px] items-center justify-center rounded-full bg-mainColor text-[10px] font-bold text-white'>
                  {cart.length || 0}
                </span>
              </div>
            }
          >
            Giỏ hàng
          </Button>
        </Link>
      </Menu.Target>
      <Menu.Dropdown>
        {cart.length > 0 ? (
          <Stack pb={10}>
            <ScrollAreaAutosize mah={'40vh'}>
              {cart.map(item => (
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
              ))}
            </ScrollAreaAutosize>

            <Group justify='space-between' className='px-4'>
              <Text fw={700}>Tạm tính:</Text>
              <Text fw={700} size='lg' c='red'>
                {formatPriceLocaleVi(total)}
              </Text>
            </Group>

            <Group gap='md' className='px-4' justify='space-between' align='center'>
              <Text size='sm' c={'dimmed'}>
                {cart?.length || 0} sản phẩm
              </Text>
              <Link href='/gio-hang' className='text-white'>
                <BButton title={'Xem giỏ hàng'} radius='xl' size='sm' w={'max-content'} />
              </Link>
            </Group>
          </Stack>
        ) : (
          <Flex direction={'column'} justify={'center'} align={'center'} py={10}>
            <Image
              loading='lazy'
              src={'/images/png/empty_cart.png'}
              width={100}
              height={100}
              alt={'empty cart'}
              style={{ objectFit: 'cover' }}
            />
            <Text size='sm' c={'dimmed'}>
              Không có sản phẩm nào trong giỏ hàng
            </Text>
          </Flex>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

export default CartButton;
