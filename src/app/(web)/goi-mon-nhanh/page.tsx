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
    tag?: string;
    'sort-price'?: string;
    'sort-name'?: string;
    price?: string;
    page?: string;
    limit?: string;
    'danh-muc'?: string;
    'loai-san-pham'?: string;
    filter?: string;
  };
}) => {
  const categoriesData = await api.Category.getAll();
  const foderItems = await api.Product.find({
    skip: Number(searchParams?.page) || 0,
    take: Number(searchParams?.limit) || 12,
    sort: {
      price: searchParams?.['sort-price'],
      name: searchParams?.['sort-name']
    },
    query: searchParams?.tag,
    'danh-muc': searchParams?.['danh-muc'],
    'loai-san-pham': searchParams?.['loai-san-pham'],
    newProduct: searchParams?.filter === 'san-pham-moi',
    price: {
      min: Number(searchParams?.price?.split('-')[0]) || undefined,
      max: Number(searchParams?.price?.split('-')[1]) || undefined
    }
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
