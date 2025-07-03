'use client';
import { Box, Flex, Indicator, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconBell, IconGardenCart } from '@tabler/icons-react';
import Link from 'next/link';
import { formatPriceLocaleVi } from '~/lib/func-handler/formatPrice';

export default function CartFloating() {
  const [cart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  if (cart && cart?.length <= 0) return null;
  return (
    <Link href='/gio-hang'>
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
}
