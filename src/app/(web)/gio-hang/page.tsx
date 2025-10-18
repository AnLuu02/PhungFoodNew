'use client';

import { Divider, Grid, GridCol, Paper } from '@mantine/core';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';
import dynamic from 'next/dynamic';
import Empty from '~/components/Empty';
import { breakpoints, TOP_POSITION_STICKY } from '~/constants';
import { RecapCart } from '../thanh-toan/components/RecapCart';
import { CartTable } from './components/CartTable';

const ShoppingCartMobile = dynamic(() => import('./components/CartMobile').then(mod => mod.ShoppingCartMobile), {
  ssr: false
});

export default function ShoppingCart() {
  const [cart, setCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.sm}px)`);

  if (cart && cart?.length === 0)
    return (
      <Empty
        url='/thuc-don'
        title='Giỏ hàng trống'
        content='Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.'
      />
    );

  return (
    <Grid>
      <GridCol span={{ base: 12, sm: 6, md: 8 }} className='h-fit' order={{ base: 2, sm: 1, md: 1, lg: 1 }}>
        {isMobile ? (
          <ShoppingCartMobile />
        ) : (
          <Paper shadow='xs' radius='md' className='p-0 lg:p-6'>
            <CartTable
              updateQuantity={(id: number, quantity: number) => {
                setCart(items =>
                  items.map(item => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item))
                );
              }}
            />
            <Divider mb={10} />
          </Paper>
        )}
      </GridCol>
      <GridCol
        span={{ base: 12, sm: 6, md: 4 }}
        className='h-fit'
        pos={isMobile ? 'relative' : 'sticky'}
        top={isMobile ? 0 : TOP_POSITION_STICKY}
        order={{ base: 1, sm: 2, md: 2, lg: 2 }}
      >
        <RecapCart />
      </GridCol>
    </Grid>
  );
}
