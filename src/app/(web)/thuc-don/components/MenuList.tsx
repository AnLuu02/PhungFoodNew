import { Flex, Grid, GridCol } from '@mantine/core';
import Empty from '~/components/Empty';
import CustomPagination from '~/components/Pagination';
import ProductCardCarouselVertical from '~/components/Web/Card/CardProductCarouselVertical';
import { CardSkeleton } from '~/components/Web/Card/CardSkeleton';
import { ProductFind } from '~/types/client-type-trpc';

export const MenuList = ({ responseData, isLoading }: { responseData: ProductFind; isLoading: boolean }) => {
  const products = responseData?.products || [];
  return (
    <Flex direction={'column'} align={'flex-start'}>
      <Grid w={'100%'} p={0}>
        {isLoading ? (
          [...Array(12)].map((_, index) => (
            <GridCol key={index} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <CardSkeleton />
            </GridCol>
          ))
        ) : products?.length > 0 ? (
          products.map(item => (
            <GridCol key={item.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <ProductCardCarouselVertical key={item.id} data={item} />
            </GridCol>
          ))
        ) : (
          <GridCol span={12}>
            <Empty title={'Không tìm thấy sản phẩm'} content='' hasButton={false} />
          </GridCol>
        )}
      </Grid>

      <Flex w={'100%'} align={'center'} justify={'center'} mt={'md'}>
        <CustomPagination totalPages={responseData?.pagination?.totalPages || 1} />
      </Flex>
    </Flex>
  );
};
