'use client';
import { Box, Button } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconShoppingBag } from '@tabler/icons-react';
import clsx from 'clsx';
import Link from 'next/link';
import useScrollPosition from '~/components/Hooks/use-on-scroll';
import { HEIGHT_HEADER } from '~/constants';
import CartButton from './gio-hang-button';

export default function DynamicCartButton({ heightShow }: { heightShow?: number }) {
  const scroll = useScrollPosition(heightShow || HEIGHT_HEADER);
  const [cart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  return (
    scroll >= (heightShow || HEIGHT_HEADER) && (
      <Box className={clsx('animate-fadeTop')}>
        <Box className='md:hidden lg:block'>
          <CartButton />
        </Box>
        <Link href='/gio-hang' className='hidden text-white md:block lg:hidden'>
          <Button
            variant='outline'
            className='border-mainColor text-mainColor'
            radius={'xl'}
            p={0}
            h={70}
            leftSection={
              <Box className='relative mr-10 inline-block'>
                <IconShoppingBag size={40} />
                <span className='absolute -right-2 -top-2 z-[100] flex h-[25px] w-[25px] items-center justify-center rounded-full bg-mainColor text-[14px] font-bold text-white'>
                  {cart.length || 0}
                </span>
              </Box>
            }
          ></Button>
        </Link>
      </Box>
    )
  );
}
