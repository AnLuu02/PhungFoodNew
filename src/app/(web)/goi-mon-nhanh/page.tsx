import { Box, Grid, GridCol } from '@mantine/core';
import { Metadata } from 'next';
import { api, HydrateClient } from '~/trpc/server';
import { RecapCart } from '../../../components/RecapCart';
import { QuickMenu } from './components/QuickMenu';

export const revalidate = 60 * 60;
export const dynamic = 'force-static';

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
    s?: string;
  };
}) => {
  const category = (searchParams?.['danh-muc'] as string) ?? null;
  const search = (searchParams?.['s'] as string) ?? '';
  const LIMIT_DATA = 10;

  const filters = {
    'danh-muc': category,
    search
  };

  const [categoriesData, _] = await Promise.all([
    api.Category.getAll(),
    api.Product.findInfiniteProduct.prefetchInfinite({
      limit: LIMIT_DATA,
      filters
    })
  ]);

  const categories = categoriesData || [];

  return (
    <HydrateClient>
      <Box className='mx-auto w-full max-w-[1500px]'>
        <Grid gutter='lg' align='flex-start'>
          <GridCol order={{ base: 2, lg: 1 }} span={{ base: 12, lg: 8 }} h={'fit'}>
            <QuickMenu categories={categories} LIMIT_DATA={LIMIT_DATA} />
          </GridCol>

          <GridCol
            order={{ base: 1, lg: 2 }}
            span={{ base: 12, lg: 4 }}
            h={'fit'}
            // className='lg:sticky lg:top-[4.3rem]'
          >
            <RecapCart quickOrder={true} />
          </GridCol>
        </Grid>
      </Box>
    </HydrateClient>
  );
};

export default FastMenu;
