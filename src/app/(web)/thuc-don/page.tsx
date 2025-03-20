'use client';
import { Box, Flex, Grid, GridCol, Indicator, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconBell, IconGardenCart } from '@tabler/icons-react';
import Link from 'next/link';
import Empty from '~/app/_components/Empty';
import CustomPagination from '~/app/_components/Pagination';
import CardSkeleton from '~/app/_components/Web/_components/CardSkeleton';
import ProductCardCarouselVertical from '~/app/_components/Web/Home/_Components/ProductCardCarouselVertical';
import { formatPriceLocaleVi } from '~/app/lib/utils/func-handler/formatPrice';
import { api } from '~/trpc/react';
import HeaderMenu from './_components/HeaderMenu';

const MenuSection = ({
  searchParams
}: {
  searchParams?: {
    tag?: string;
    query?: string;
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
    query: searchParams?.tag || searchParams?.query,
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
  const [cart, setCart, resetCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });

  const data = foderItems?.products || [];

  return (
    <Box pos={'relative'}>
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
      {cart?.length > 0 && (
        <Link href='/gio-hang'>
          <Indicator
            inline
            size={40}
            color='green.9'
            bg={'green.9'}
            label={<IconBell size={30} color='white' className='animate-shake' />}
            className='fixed bottom-0 right-[80px] z-50 cursor-pointer rounded-t-xl hover:opacity-80'
          >
            <Box mr={20}>
              <Flex align={'center'} justify={'center'} gap={10} pt={4} pb={4} pl={20} pr={20}>
                <IconGardenCart size={50} color='white' />
                <Text className='text-xl font-bold' color='white'>
                  {formatPriceLocaleVi(
                    cart.reduce(
                      (total: number, item: any) =>
                        total + (Number(item?.price || 0) - Number(item?.discount || 0)) * Number(item?.quantity || 0),
                      0
                    )
                  )}
                </Text>
              </Flex>
            </Box>
          </Indicator>
        </Link>
      )}
    </Box>
  );
};

export default MenuSection;
