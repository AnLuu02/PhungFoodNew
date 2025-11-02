import { Grid, GridCol } from '@mantine/core';
import { Metadata } from 'next';
import { TOP_POSITION_STICKY } from '~/constants';
import { api } from '~/trpc/server';
import { RecapCart } from '../thanh-toan/components/RecapCart';
import { QuickMenu } from './components/QuickMenu';

export const dynamic = 'force-static';
export const revalidate = 60 * 60;

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
    take: Number(searchParams?.limit) || 8,
    'danh-muc': searchParams?.['danh-muc']
  });
  const categories = categoriesData || [];
  const products = foodItems?.products || [];

  return (
    <Grid gutter={'md'}>
      <GridCol span={{ base: 12, sm: 7, md: 7, lg: 8 }} className='h-fit' pt={'xs'}>
        <QuickMenu
          categories={categories}
          initProducts={products}
          totalPages={foodItems.pagination.totalPages}
          searchParams={searchParams}
        />
      </GridCol>
      <GridCol
        span={{ base: 12, sm: 5, md: 5, lg: 4 }}
        className='h-fit animate-fadeUp'
        pos={'sticky'}
        top={TOP_POSITION_STICKY}
        pt={'xs'}
      >
        <RecapCart quickOrder={true} />
      </GridCol>
    </Grid>
  );
};

export default FastMenu;
