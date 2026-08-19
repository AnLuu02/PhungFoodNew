'use client';

import { Box, Divider, Grid, GridCol, Paper } from '@mantine/core';
import { useEffect, useState } from 'react';
import Empty from '~/components/Empty';
import { useCartCount } from '~/components/Hooks/use-cart';
import { RecapCart } from '../../../components/RecapCart';
import { RecapCartSkeleton } from '../../../components/RecapCartSkeleton';
import { ShoppingCartMobile, ShoppingCartMobileSkeleton } from './components/CartMobile';
import { CartTable } from './components/CartTable';
import { CartTableSkeleton } from './components/CartTableSkeleton';

export default function ShoppingCart() {
  const cartSize = useCartCount();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [cartSize]);

  if (!isMounted)
    return (
      <Grid>
        <GridCol span={{ base: 12, sm: 6, md: 8 }} className='h-fit' order={{ base: 2, sm: 1, md: 1, lg: 1 }}>
          <Box className='hidden h-fit md:block'>
            <CartTableSkeleton />
          </Box>
          <Box className='h-fit md:hidden'>
            <ShoppingCartMobileSkeleton />
          </Box>
          <Divider mb={10} />
        </GridCol>
        <GridCol
          span={{ base: 12, sm: 6, md: 4 }}
          className='relative top-0 h-fit md:sticky md:top-[70px]'
          order={{ base: 1, sm: 2, md: 2, lg: 2 }}
        >
          <RecapCartSkeleton />
        </GridCol>
      </Grid>
    );
  if (cartSize === 0)
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
        <Box className='md:hidden'>
          <ShoppingCartMobile />
        </Box>
        <Paper shadow='xs' className='hidden p-0 md:block lg:p-6'>
          <CartTable />
          <Divider mb={10} />
        </Paper>
      </GridCol>
      <GridCol
        span={{ base: 12, sm: 6, md: 4 }}
        className='relative top-0 h-fit md:sticky md:top-[70px]'
        order={{ base: 1, sm: 2, md: 2, lg: 2 }}
      >
        <RecapCart />
      </GridCol>
    </Grid>
  );
}
