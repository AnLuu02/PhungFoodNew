'use client';
import { Flex, Grid, GridCol } from '@mantine/core';
import Link from 'next/link';
import BButton from '~/app/_components/Button';
import Empty from '~/app/_components/Empty';
import ProductCardCarouselVertical from '~/app/_components/Web/Home/_Components/ProductCardCarouselVertical';

const QuickMenu = ({ categories, products, searchParams }: any) => {
  return (
    <>
      <Flex align={'center'} gap={'xs'} mb={20} wrap={{ base: 'wrap', md: 'wrap', lg: 'nowrap' }}>
        {categories?.map((item: any, index: number) => (
          <Link href={`/goi-mon-nhanh?danh-muc=${item.tag}`} key={`${item.id}+${index}`}>
            <BButton
              active={item.tag === searchParams?.['danh-muc']}
              key={index}
              title={item.name}
              variant='outline'
              size='sm'
            />
          </Link>
        ))}
      </Flex>
      <Flex direction={'column'} w={'100%'} pr={{ base: 0, md: 20 }}>
        <Grid>
          {products?.length > 0 ? (
            products.map((item: any, index: number) => (
              <GridCol span={{ base: 12, md: 6, lg: 3 }} key={`${item.id}+${index}`}>
                <ProductCardCarouselVertical product={item} key={index} quickOrder={true} />
              </GridCol>
            ))
          ) : (
            <Empty hasButton={false} size='md' title='Không có sản phẩm phù hợp' content='Vui lòng quay lại sau' />
          )}
        </Grid>

        {products?.length > 0 && (
          <Flex align={'center'} justify={'center'} mt={30}>
            <BButton title={'Xem tất cả'} variant='outline' size='sm' onClick={() => {}} />
          </Flex>
        )}
      </Flex>
    </>
  );
};

export default QuickMenu;
