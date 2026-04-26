import { Box, Center, Divider, Flex, Grid, GridCol } from '@mantine/core';
import { IconSoup } from '@tabler/icons-react';
import Empty from '~/components/Empty';
import CustomPagination from '~/components/Pagination';
import ProductCardCarouselVertical from '~/components/Web/Card/CardProductCarouselVertical';
import { CardSkeleton } from '~/components/Web/Card/CardSkeleton';

export const MenuList = ({ responseData, isLoading }: { responseData: any; isLoading: boolean }) => {
  const products = responseData?.products || [];
  return (
    <>
      {products?.length > 0 && (
        <Center my={'md'}>
          <Divider
            variant='dashed'
            size={'sm'}
            w={{ base: '90%', sm: '80%' }}
            classNames={{
              root: 'border-mainColor'
            }}
            labelPosition='center'
            label={
              <>
                <IconSoup size={12} className='italic' />
                <Box ml={5} className='italic'>
                  Hiển thị {products?.length} / {responseData?.pagination?.totalProducts || 0} kết quả được tìm thấy
                </Box>
              </>
            }
          />
        </Center>
      )}

      <Flex direction={'column'} align={'flex-start'}>
        <Grid w={'100%'} p={0}>
          {isLoading ? (
            [...Array(12)].map((_, index) => (
              <GridCol key={index} span={{ base: 6, md: 4, lg: 3 }}>
                <CardSkeleton />
              </GridCol>
            ))
          ) : products?.length > 0 ? (
            products.map((item: any) => (
              <GridCol key={item.id} span={{ base: 6, md: 4, lg: 3 }}>
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
    </>
  );
};
