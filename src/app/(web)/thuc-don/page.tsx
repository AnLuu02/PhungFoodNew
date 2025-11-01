import { Box } from '@mantine/core';
import { api } from '~/trpc/server';
import { CartFloating } from './components/CartFloating';
import HeaderMenu from './components/HeaderMenu';
import { MenuList } from './components/MenuList';

export const revalidate = 60;
export const dynamic = 'force-static';

export default async function MenuSection({
  searchParams
}: {
  searchParams?: {
    tag?: string;
    s?: string;
    sort?: any;
    minPrice?: string;
    maxPrice?: string;
    'nguyen-lieu'?: any;
    page?: string;
    limit?: string;
    'danh-muc'?: string;
    'loai-san-pham'?: string;
    loai?: string;
    rating?: string;
  };
}) {
  const responseData = await api.Product.find({
    skip: Number(searchParams?.page) || 0,
    take: Number(searchParams?.limit) || 12,
    sort: (searchParams?.sort && Array.isArray(searchParams?.sort) ? searchParams?.sort : [searchParams?.sort])?.filter(
      Boolean
    ),
    s: searchParams?.tag || searchParams?.s,
    'nguyen-lieu': (searchParams?.['nguyen-lieu'] && Array.isArray(searchParams?.['nguyen-lieu'])
      ? searchParams?.['nguyen-lieu']
      : [searchParams?.['nguyen-lieu']]
    ).filter(Boolean),
    'danh-muc': searchParams?.['danh-muc'],
    'loai-san-pham': searchParams?.['loai-san-pham'],
    newProduct: searchParams?.loai === 'san-pham-moi',
    discount: searchParams?.loai === 'san-pham-giam-gia',
    hotProduct: searchParams?.loai === 'san-pham-hot',
    bestSaler: searchParams?.loai === 'san-pham-ban-chay',
    price: {
      min: Number(searchParams?.minPrice) || undefined,
      max: Number(searchParams?.maxPrice) || undefined
    },
    rating: searchParams?.rating ? Number(searchParams?.rating) : undefined
  });
  const data = responseData?.products || [];

  return (
    <Box pos={'relative'}>
      <HeaderMenu products={data} />
      <MenuList responseData={responseData} />
      <CartFloating />
    </Box>
  );
}
