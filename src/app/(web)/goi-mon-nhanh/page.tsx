import { Grid, GridCol } from '@mantine/core';
import { Metadata } from 'next';
import { TOP_POSITION_STICKY } from '~/constants';
import { api } from '~/trpc/server';
import { QuickCart } from './components/QuickCart';
import { QuickMenu } from './components/QuickMenu';

export const metadata: Metadata = {
  title: 'Gọi món nhanh - Phụng Food',
  description: 'Gọi món nhanh các món ăn miền Tây tại Phụng Food. Đặt hàng tiện lợi và nhanh chóng.'
};

const FastMenu = async ({
  searchParams
}: {
  searchParams?: {
    page?: string;
    limit?: string;
    'danh-muc'?: string;
  };
}) => {
  const categoriesData = await api.Category.getAll();
  const foodItems = await api.Product.find({
    skip: Number(searchParams?.page) || 0,
    take: Number(searchParams?.limit) || 12,
    'danh-muc': searchParams?.['danh-muc']
  });
  const categories = categoriesData || [];
  const products = foodItems?.products || [];

  return (
    <Grid gutter={'md'}>
      <GridCol span={{ base: 12, sm: 7, md: 7, lg: 9 }} className='h-fit' pt={'xs'}>
        <QuickMenu categories={categories} products={products} searchParams={searchParams} />
      </GridCol>
      <GridCol
        span={{ base: 12, sm: 5, md: 5, lg: 3 }}
        className='h-fit'
        pos={'sticky'}
        top={TOP_POSITION_STICKY}
        pt={'xs'}
      >
        <QuickCart />
      </GridCol>
    </Grid>
  );
};

export default FastMenu;
