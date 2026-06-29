'use client';
import { Box, Button, Divider, Flex, Group, Menu, Paper, ScrollAreaAutosize, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconShoppingBag } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartAmount, useCartItems } from '~/components/Hooks/use-cart';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { useCartStore } from '~/stores/cart.store';
import CartItemFastMenu from '../../Home/components/CartItemFastMenu';

const CartButton = ({ notResponsive }: { notResponsive?: boolean }) => {
  const isDesktop = useMediaQuery(`(min-width: 1024px)`);
  const cart = useCartItems();
  const removeCart = useCartStore(s => s.removeCart);
  const updateCart = useCartStore(s => s.updateCart);
  const originalAmount = useCartAmount();
  const cartSize = cart.length;

  return (
    <Menu
      shadow='md'
      width={350}
      trigger='hover'
      offset={16}
      withArrow
      disabled={!isDesktop}
      transitionProps={{ transition: 'fade-down', duration: 300, exitDelay: 300, enterDelay: 300 }}
    >
      <Menu.Target>
        <Link href='/gio-hang' className='text-white'>
          <Button
            variant='outline'
            className={`cart-btn ${!notResponsive ? 'sm:hidden md:block' : ''}`}
            radius={'xl'}
            leftSection={
              <Box className='relative inline-block'>
                <IconShoppingBag size={20} />
                <span className='absolute -right-2 -top-2 z-[100] flex h-[15px] w-[15px] items-center justify-center rounded-full bg-mainColor text-[10px] font-bold text-white'>
                  {cartSize}
                </span>
              </Box>
            }
          >
            Giỏ hàng
          </Button>

          <Paper
            w={40}
            radius={'lg'}
            h={40}
            withBorder
            className={`cart-btn relative hidden items-center justify-center text-mainColor ${!notResponsive ? 'sm:flex md:hidden' : ''}`}
          >
            <IconShoppingBag size={24} />
            <span className='absolute -right-2 -top-2 z-[100] flex h-[15px] w-[15px] items-center justify-center rounded-full bg-mainColor text-[10px] font-bold text-white'>
              {cartSize}
            </span>
          </Paper>
        </Link>
      </Menu.Target>
      <Menu.Dropdown>
        {cartSize > 0 ? (
          <Stack pb={10}>
            <ScrollAreaAutosize mah={'40vh'} scrollbarSize={5}>
              {cart.map(item => (
                <Box key={item?.product.id}>
                  <CartItemFastMenu
                    key={item?.product.id}
                    thumbnail={item.product.thumbnail}
                    name={item?.product.name}
                    price={item?.product.price}
                    quantity={item?.quantity}
                    onQuantityChange={value =>
                      updateCart({
                        productId: item?.product.id,
                        quantity: value
                      })
                    }
                    onDelete={() => removeCart(item?.product.id)}
                  />
                  <Divider />
                </Box>
              ))}
            </ScrollAreaAutosize>

            <Group
              justify='space-between'
              className='border-t-[0.5px] border-solid border-transparent border-t-gray-200 px-4 pt-4'
            >
              <Text fw={700}>Tạm tính:</Text>
              <Text fw={700} size='lg' c='red'>
                {formatPriceLocaleVi(originalAmount)}
              </Text>
            </Group>

            <Group gap='md' className='px-4' justify='space-between' align='center'>
              <Text size='sm' c={'dimmed'}>
                {cartSize || 0} sản phẩm
              </Text>
              <Link href='/gio-hang' className='text-white'>
                <Button children={'Xem giỏ hàng'} radius='xl' w={'max-content'} />
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
