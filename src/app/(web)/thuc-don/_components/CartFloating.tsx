'use client';
import { Box, Flex, Indicator, Text } from '@mantine/core';
import { IconBell, IconGardenCart } from '@tabler/icons-react';
import Link from 'next/link';
import { formatPriceLocaleVi } from '~/app/lib/utils/func-handler/formatPrice';

const CartFloating = (cart: any) => {
  return (
    <Link href='/gio-hang' prefetch={false}>
      <Indicator
        inline
        size={40}
        color='green.9'
        bg={'green.9'}
        label={<IconBell size={30} color='white' className='animate-shake' />}
        className='fixed bottom-0 right-[80px] z-50 cursor-pointer rounded-t-xl hover:opacity-80'
      >
        <Box mr={20}>
          <Flex align={'center'} justify={'center'} gap={10} pt={4} pb={4} pl={20} pr={20}>
            <IconGardenCart size={50} color='white' />
            <Text className='text-xl font-bold' color='white'>
              {formatPriceLocaleVi(
                cart.reduce(
                  (total: number, item: any) =>
                    total + (Number(item?.price || 0) - Number(item?.discount || 0)) * Number(item?.quantity || 0),
                  0
                )
              )}
            </Text>
          </Flex>
        </Box>
      </Indicator>
    </Link>
  );
};
export default CartFloating;
