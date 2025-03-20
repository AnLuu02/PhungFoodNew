import { Grid, GridCol } from '@mantine/core';
import { api } from '~/trpc/server';
import QuickCart from './components/quick-cart';
import QuickMenu from './components/quick-menu';
interface CartItemType {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

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
  const foderItems = await api.Product.find({
    skip: Number(searchParams?.page) || 0,
    take: Number(searchParams?.limit) || 12,
    'danh-muc': searchParams?.['danh-muc']
  });
  const categories = categoriesData || [];
  const products = foderItems?.products || [];

  return (
    <Grid>
      <GridCol span={{ base: 12, sm: 6, md: 7, lg: 9 }} className='h-fit' p={0} pt={'xs'}>
        <QuickMenu categories={categories} products={products} searchParams={searchParams} />
      </GridCol>
      <GridCol span={{ base: 12, sm: 6, md: 5, lg: 3 }} className='h-fit' pos={'sticky'} top={70} p={0} pt={'xs'}>
        <QuickCart />
      </GridCol>
    </Grid>
  );
};

export default FastMenu;
