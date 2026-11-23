'use client';
import { Box, Button } from '@mantine/core';
import { IconShoppingBag } from '@tabler/icons-react';
import useScrollPosition from '~/components/hooks/use-on-scroll';
import { HEIGHT_HEADER } from '~/shared/constants/common.constants';
import CartButton from '~/components/web/header/components/cart-button';

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
      <Button
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
      </Button>
      <Box className='relative hidden text-mainColor sm:invisible sm:block md:hidden'>
        <IconShoppingBag size={40} />
      </Box>
    </>
  );
}
