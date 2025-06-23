'use client';
import { Box, Flex, Grid, GridCol } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import dynamic from 'next/dynamic';
import Empty from '~/app/_components/Empty';
import CardSkeleton from '~/app/_components/Web/_components/CardSkeleton';
import { api } from '~/trpc/react';
import CartFloating from './_components/CartFloating';
import HeaderMenu from './_components/HeaderMenu';
const CustomPagination = dynamic(() => import('~/app/_components/Pagination'));
const ProductCardCarouselVertical = dynamic(
  () => import('~/app/_components/Web/Home/_Components/ProductCardCarouselVertical'),
  { ssr: false }
);
const HeaderSearchResults = dynamic(() => import('./_components/Header'), { ssr: false });

const MenuSection = ({
  searchParams
}: {
  searchParams?: {
    tag?: string;
    s?: string;
    sort?: any;
    price?: string;
    'nguyen-lieu'?: any;
    page?: string;
    limit?: string;
    'danh-muc'?: string;
    'loai-san-pham'?: string;
    loai?: string;
  };
}) => {
  const { data: foderItems, isLoading } = api.Product.find.useQuery({
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
      min: Number(searchParams?.price?.split(',')[0]) || undefined,
      max: Number(searchParams?.price?.split(',')[1]) || undefined
    }
  });
  const [cart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });

  const data = foderItems?.products || [];

  return (
    <Box pos={'relative'}>
      <HeaderSearchResults products={data} />
      <HeaderMenu isLoading={isLoading} products={data} />
      <Flex direction={'column'} align={'flex-start'}>
        {isLoading ? (
          <Grid w={'100%'}>
            {[1, 2, 3, 4, 5, 6].map(item => (
              <GridCol key={item} span={{ base: 12, sm: 6, lg: 4 }}>
                <CardSkeleton />
              </GridCol>
            ))}
          </Grid>
        ) : (
          <Grid w={'100%'} p={0}>
            {data?.length > 0 ? (
              data.map(item => (
                <GridCol key={item.id} span={{ base: 12, sm: 4, md: 4, lg: 3 }}>
                  <ProductCardCarouselVertical key={item.id} product={item} />
                </GridCol>
              ))
            ) : (
              <GridCol span={12}>
                <Empty title={'Không tìm thấy sản phẩm'} content='' hasButton={false} />
              </GridCol>
            )}
          </Grid>
        )}

        <Flex w={'100%'} align={'center'} justify={'center'}>
          <CustomPagination totalPages={foderItems?.pagination?.totalPages || 1} />
        </Flex>
      </Flex>
      {cart?.length > 0 && <CartFloating cart={cart} />}
    </Box>
  );
};

export default MenuSection;
