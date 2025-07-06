'use client';
import { Box, Flex, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconBell, IconGardenCart } from '@tabler/icons-react';
import Link from 'next/link';
import { formatPriceLocaleVi } from '~/lib/func-handler/formatPrice';

export default function CartFloating() {
  const [cart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  if (cart && cart?.length <= 0) return null;
  const totalPrice = formatPriceLocaleVi(
    cart.reduce(
      (total, item) => total + (Number(item?.price || 0) - Number(item?.discount || 0)) * Number(item?.quantity || 0),
      0
    )
  );
  return (
    <Link href='/gio-hang'>
      <Box className='fixed bottom-0 right-[80px] z-50 cursor-pointer rounded-t-xl bg-mainColor text-white shadow-lg hover:opacity-80'>
        {/* Bell icon notification */}
        <Box className='absolute -top-4 right-[-14px] flex h-10 w-10 animate-shake items-center justify-center rounded-full bg-mainColor'>
          <IconBell size={24} className='text-white' />
        </Box>

        {/* Main cart content */}
        <Flex align='center' justify='center' gap={10} pt={4} pb={4} pl={20} pr={20}>
          <IconGardenCart size={50} className='text-white' />
          <Text className='text-xl font-bold text-white'>{totalPrice}</Text>
        </Flex>
      </Box>
    </Link>
  );
}
