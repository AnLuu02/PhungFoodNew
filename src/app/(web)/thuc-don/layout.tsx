'use client';
import { Box, Flex, Grid, GridCol, Indicator, rem, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconBell, IconGardenCart } from '@tabler/icons-react';
import Link from 'next/link';
import { formatPriceLocaleVi } from '~/app/lib/utils/format/formatPrice';
import { CategoryNav } from './_components/CatgoryNavbar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart, resetCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  return (
    <Box className='relative' w={'100%'}>
      <Grid gutter={rem(30)} columns={24}>
        <GridCol span={{ base: 24, sm: 24, md: 8, lg: 6 }} className='overflow-hidden'>
          <CategoryNav />
        </GridCol>
        <GridCol span={{ base: 24, sm: 24, md: 16, lg: 18 }}>{children}</GridCol>
      </Grid>

      {cart?.length > 0 && (
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
      )}
    </Box>
  );
};

export default Layout;
