'use client';
import { Flex, Grid, GridCol } from '@mantine/core';
import Empty from '~/components/Empty';
import CustomPagination from '~/components/Pagination';
import ProductCardCarouselVertical from '~/components/Web/Home/components/ProductCardCarouselVertical';

export const MenuList = ({ products, responseData }: { products: any; responseData: any }) => {
  return (
    <Flex direction={'column'} align={'flex-start'}>
      <Grid w={'100%'} p={0}>
        {products?.length > 0 ? (
          products.map((item: any) => (
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
        <CustomPagination totalPages={responseData?.pagination?.totalPages || 1} />
      </Flex>
    </Flex>
  );
};
