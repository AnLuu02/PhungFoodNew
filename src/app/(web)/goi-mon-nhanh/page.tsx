import { Box, Grid, GridCol } from '@mantine/core';
import { Metadata } from 'next';
import { api } from '~/trpc/server';
import { RecapCart } from '../../../components/RecapCart';
import { QuickMenu } from './components/QuickMenu';

export const revalidate = 60 * 60;
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Gọi món nhanh - Phụng Food',
  description: 'Gọi món nhanh các món ăn miền Tây tại Phụng Food. Đặt hàng tiện lợi và nhanh chóng.'
};

async function FastMenuPage() {
  const LIMIT_DATA = 10;

  const filters = {
    'danh-muc': null,
    search: ''
  };

  const [categoriesData, initFindInfiniteProduct] = await Promise.all([
    api.Category.getCategoriesWithRelationBasic(),
    api.Product.findInfiniteProduct({
      limit: LIMIT_DATA,
      filters
    })
  ]);

  const categories = categoriesData || [];

  return (
    <Box className='mx-auto w-full max-w-[1500px]'>
      <Grid gutter='lg' align='flex-start'>
        <GridCol order={{ base: 2, lg: 1 }} span={{ base: 12, lg: 8 }} h={'fit'}>
          <QuickMenu categories={categories} LIMIT_DATA={LIMIT_DATA} initData={initFindInfiniteProduct} />
        </GridCol>

        <GridCol order={{ base: 1, lg: 2 }} span={{ base: 12, lg: 4 }} h={'fit'} className='lg:sticky lg:top-[4.3rem]'>
          <RecapCart quickOrder={true} />
        </GridCol>
      </Grid>
    </Box>
  );
}

export default FastMenuPage;
