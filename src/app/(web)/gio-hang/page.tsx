'use client';

import { Divider, Grid, GridCol, Paper } from '@mantine/core';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';
import dynamic from 'next/dynamic';
import { TOP_POSITION_STICKY } from '~/app/lib/utils/constants/constant';
import { breakpoints } from '~/app/lib/utils/constants/device';
import RecapCart from '../thanh-toan/_components/recapCart';
import ShoppingCartMobile from './_mobile/gio-hang-mobile';
import CartTable from './components/CartTable';

const Empty = dynamic(() => import('../../_components/Empty'), { ssr: false });

export default function ShoppingCart() {
  const [cart, setCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.sm - 1}px)`);
  const updateQuantity = (id: number, quantity: number) => {
    setCart(items => items.map(item => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item)));
  };
  return cart.length === 0 ? (
    <Empty url='/thuc-don' title='Giỏ hàng trống' content='Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.' />
  ) : (
    <Grid>
      <GridCol span={{ base: 12, md: 8 }} className='h-fit' order={{ base: 2, sm: 1, md: 1, lg: 1 }}>
        {isMobile ? (
          <ShoppingCartMobile />
        ) : (
          <Paper shadow='xs' radius='md' className='p-0 md:p-6'>
            <CartTable cart={cart} setCart={setCart} updateQuantity={updateQuantity} />
            <Divider mb={10} />
          </Paper>
        )}
      </GridCol>
      <GridCol
        span={{ base: 12, md: 4 }}
        className='h-fit'
        pos={isMobile ? 'relative' : 'sticky'}
        top={isMobile ? 0 : TOP_POSITION_STICKY}
        order={{ base: 1, sm: 2, md: 2, lg: 2 }}
      >
        <RecapCart order={cart} loading={false} paymentMethod={''} type={'cart'} />
      </GridCol>
    </Grid>
  );
}
