'use client';
import { Box, Flex, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconBell, IconShoppingBag } from '@tabler/icons-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';

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
      <Box className='group fixed bottom-0 right-[80px] z-50 hidden cursor-pointer rounded-t-xl bg-mainColor text-white shadow-lg duration-200 hover:scale-105 hover:bg-subColor hover:text-black sm:block'>
        <Box className='group:hover:text-black absolute -top-4 right-[-14px] flex h-10 w-10 animate-shake items-center justify-center rounded-full bg-mainColor duration-200 group-hover:bg-subColor'>
          <IconBell size={24} />
        </Box>

        <Flex align='center' justify='center' gap={10} p={20} py={10}>
          <IconShoppingBag size={24} />
          <Text className='text-xl font-bold'>{formatPriceLocaleVi(totalPrice)}</Text>
        </Flex>
      </Box>
    </Link>
  );
}
