'use client';
import { Box, Flex, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconBell, IconGardenCart } from '@tabler/icons-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { formatPriceLocaleVi } from '~/lib/func-handler/Format';

export function CartFloating() {
  const [cart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const totalPrice = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + (Number(item?.price || 0) - Number(item?.discount || 0)) * Number(item?.quantity || 0),
      0
    );
  }, [cart]);
  if (cart && cart?.length === 0) return null;
  return (
    <Link href='/gio-hang'>
      <Box className='fixed bottom-0 right-[80px] z-50 cursor-pointer rounded-t-xl bg-mainColor text-white shadow-lg hover:opacity-80'>
        <Box className='absolute -top-4 right-[-14px] flex h-10 w-10 animate-shake items-center justify-center rounded-full bg-mainColor'>
          <IconBell size={24} className='text-white' />
        </Box>

        <Flex align='center' justify='center' gap={10} pt={4} pb={4} pl={20} pr={20}>
          <IconGardenCart size={50} className='text-white' />
          <Text className='text-xl font-bold text-white'>{formatPriceLocaleVi(totalPrice)}</Text>
        </Flex>
      </Box>
    </Link>
  );
}
