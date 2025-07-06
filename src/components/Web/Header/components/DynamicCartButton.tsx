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
        <div className='hidden xl:block'>
          <CartButton />
        </div>
        <Link href='/gio-hang' className='text-white'>
          <Button
            variant='outline'
            className='border-mainColor text-mainColor hover:bg-mainColor hover:text-white xl:hidden'
            radius={'xl'}
            h={40}
            leftSection={
              <div className='relative mr-10 inline-block'>
                <IconShoppingBag size={20} className='text-mainColor' />
                <span className='absolute -right-2 -top-2 z-[100] flex h-[15px] w-[15px] items-center justify-center rounded-full bg-mainColor text-[10px] font-bold text-white'>
                  {cart.length || 0}
                </span>
              </div>
            }
          ></Button>
        </Link>
      </Box>
    )
  );
}
