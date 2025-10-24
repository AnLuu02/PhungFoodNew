'use client';
import { Flex, Grid, GridCol } from '@mantine/core';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import BButton from '~/components/Button/Button';
import Empty from '~/components/Empty';
import ProductCardCarouselVertical from '~/components/Web/Card/CardProductCarouselVertical';
import { api } from '~/trpc/react';

export const QuickMenu = ({ categories, searchParams, totalPages, initProducts }: any) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dataRender, setDataRender] = useState<any>([...initProducts]);
  const utils = api.useUtils();
  useEffect(() => {
    setDataRender([...initProducts]);
    setPageNumber(1);
  }, [initProducts]);

  async function loadMore() {
    setLoading(true);
    const newProducts = await utils.Product.find.fetch({
      skip: pageNumber + 1,
      take: 8,
      'danh-muc': searchParams?.['danh-muc']
    });
    setDataRender([...dataRender, ...(newProducts.products || [])]);
    setPageNumber(pageNumber + 1);
    setLoading(false);
  }

  const dataMemorize = useMemo(() => {
    return dataRender;
  }, [dataRender]);

  return (
    <>
      <Flex align={'center'} gap={'xs'} mb={20} className='w-full overflow-x-auto pb-3'>
        <Link href={`/goi-mon-nhanh`}>
          <BButton active={!searchParams?.['danh-muc']} children={'Tất cả'} variant='outline' radius={'xl'} />
        </Link>
        {categories?.map((item: any, index: number) => (
          <>
            <Link href={`/goi-mon-nhanh?danh-muc=${item.tag}`} key={`${item.id}+${index}`}>
              <BButton
                active={item.tag === searchParams?.['danh-muc']}
                key={index}
                children={item.name}
                variant='outline'
                radius={'xl'}
              />
            </Link>
          </>
        ))}
      </Flex>
      <Flex direction={'column'} w={'100%'}>
        <Grid>
          {dataMemorize?.length > 0 ? (
            dataMemorize.map((item: any, index: number) => (
              <GridCol span={{ base: 12, sm: 6, md: 6, lg: 3 }} key={`${item.id}+${index}`}>
                <ProductCardCarouselVertical data={item} key={index} />
              </GridCol>
            ))
          ) : (
            <Empty hasButton={false} size='md' title='Không có sản phẩm phù hợp' content='Vui lòng quay lại sau' />
          )}
        </Grid>

        <Flex align={'center'} justify={'center'} mt={30}>
          <BButton
            radius={'xl'}
            children={'Xem thêm'}
            variant='outline'
            loading={loading}
            onClick={loadMore}
            disabled={pageNumber >= totalPages}
          />
        </Flex>
      </Flex>
    </>
  );
};
