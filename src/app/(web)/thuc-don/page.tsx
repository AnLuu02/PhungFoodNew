'use client';
import { Box } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { api } from '~/trpc/react';
import HeaderMenu from './components/HeaderMenu';
import { MenuList } from './components/MenuList';

export default function MenuSection() {
  const searchParams = useSearchParams();
  const { data, isLoading } = api.Product.find.useQuery({
    skip: Number(searchParams?.get('page')) || 0,
    take: Number(searchParams?.get('limit')) || 12,
    sort: (searchParams?.getAll('sort') && searchParams?.getAll('sort'))?.filter(Boolean),
    s: searchParams?.get('tag') || searchParams?.get('s') || undefined,
    'nguyen-lieu': (searchParams?.getAll('nguyen-lieu') && searchParams?.getAll('nguyen-lieu')).filter(Boolean),
    'danh-muc': searchParams?.get('danh-muc') || undefined,
    'loai-san-pham': searchParams?.get('loai-san-pham') || undefined,
    newProduct: searchParams?.get('loai') === 'san-pham-moi',
    discount: searchParams?.get('loai') === 'san-pham-giam-gia',
    hotProduct: searchParams?.get('loai') === 'san-pham-hot',
    bestSaler: searchParams?.get('loai') === 'san-pham-ban-chay',
    price: {
      min: Number(searchParams?.get('minPrice')) || undefined,
      max: Number(searchParams?.get('maxPrice')) || undefined
    },
    rating: searchParams?.get('rating') ? Number(searchParams?.get('rating')) : undefined
  });
  console.log(data);

  return (
    <Box pos={'relative'}>
      <HeaderMenu responseData={data} isLoading={isLoading} />
      <MenuList responseData={data} isLoading={isLoading} />
    </Box>
  );
}
