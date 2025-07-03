import { Box, Flex, Grid, GridCol } from '@mantine/core';
import Empty from '~/components/Empty';
import CustomPagination from '~/components/Pagination';
import ProductCardCarouselVertical from '~/components/Web/Home/components/ProductCardCarouselVertical';
import { api } from '~/trpc/server';
import CartFloating from './components/CartFloating';
import HeaderMenu from './components/HeaderMenu';

export default async function MenuSection({
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
}) {
  const foderItems = await api.Product.find({
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
  const data = foderItems?.products || [];

  return (
    <Box pos={'relative'}>
      <HeaderMenu products={data} />
      <Flex direction={'column'} align={'flex-start'}>
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

        <Flex w={'100%'} align={'center'} justify={'center'}>
          <CustomPagination totalPages={foderItems?.pagination?.totalPages || 1} />
        </Flex>
      </Flex>
      <CartFloating />
    </Box>
  );
}
