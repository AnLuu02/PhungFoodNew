import { Grid, GridCol } from '@mantine/core';
import { Metadata } from 'next';
import { api, HydrateClient } from '~/trpc/server';
import { RecapCart } from '../../../components/RecapCart';
import { QuickMenu } from './components/QuickMenu';

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
  };
}) => {
  const category = (searchParams?.['danh-muc'] as string) ?? null;
  const LIMIT_DATA = 8;
  const filters = {
    'danh-muc': category
  };
  const [categoriesData, _] = await Promise.all([
    api.Category.getAll(),
    api.Product.findInfiniteProduct.prefetchInfinite({
      limit: 8,
      filters: filters
    })
  ]);
  const categories = categoriesData || [];
  return (
    <HydrateClient>
      <Grid gutter={'md'}>
        <GridCol span={{ base: 12, sm: 7, md: 7, lg: 8 }} className='h-fit' pt={'xs'}>
          <QuickMenu categories={categories} LIMIT_DATA={LIMIT_DATA} />
        </GridCol>
        <GridCol
          span={{ base: 12, sm: 5, md: 5, lg: 4 }}
          className='h-fit animate-fadeUp'
          // pos={'sticky'}
          // top={TOP_POSITION_STICKY}
          pt={'xs'}
        >
          <RecapCart quickOrder={true} />
        </GridCol>
      </Grid>
    </HydrateClient>
  );
};

export default FastMenu;
