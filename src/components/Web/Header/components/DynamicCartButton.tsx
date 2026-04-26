'use client';
import { Box } from '@mantine/core';
import { IconShoppingBag } from '@tabler/icons-react';
import BButton from '~/components/Button/Button';
import useScrollPosition from '~/components/Hooks/use-on-scroll';
import { HEIGHT_HEADER } from '~/constants';
import CartButton from './CartButton';

export default function DynamicCartButton({ heightShow }: { heightShow?: number }) {
  const scroll = useScrollPosition(heightShow || HEIGHT_HEADER);
  return scroll >= (heightShow || HEIGHT_HEADER) ? (
    <Box className={`animate-fadeDown`}>
      <Box className='md:hidden lg:block'>
        <CartButton />
      </Box>
    </Box>
  ) : (
    <>
      <BButton
        variant='outline'
        className='hidden md:invisible md:block'
        radius={'xl'}
        leftSection={
          <Box className='relative inline-block'>
            <IconShoppingBag size={20} />
          </Box>
        }
      >
        Giỏ hàng
      </BButton>
      <Box className='relative hidden text-mainColor sm:invisible sm:block md:hidden'>
        <IconShoppingBag size={40} />
      </Box>
    </>
  );
}
