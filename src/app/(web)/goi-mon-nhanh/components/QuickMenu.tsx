'use client';
import { Button, Flex, Grid, GridCol, Paper } from '@mantine/core';
import { useInViewport } from '@mantine/hooks';
import { IconAlertCircle } from '@tabler/icons-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import Empty from '~/components/Empty';
import ProductCardCarouselVertical from '~/components/Web/Card/CardProductCarouselVertical';
import ProductCardSkeleton from '~/components/Web/Card/CardProductSkeleton';
import { api } from '~/trpc/react';
export const QuickMenu = ({ categories, LIMIT_DATA }: any) => {
  const utils = api.useUtils();
  const searchParams = useSearchParams();
  const { ref, inViewport } = useInViewport();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    api.Product.findInfiniteProduct.useInfiniteQuery(
      {
        limit: LIMIT_DATA,
        filters: {
          'danh-muc': searchParams.get('danh-muc') ?? null
        }
      },
      {
        getNextPageParam: lastPage => lastPage.nextCursor,
        staleTime: 1000 * 60 * 5
      }
    );
  useEffect(() => {
    if (inViewport && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inViewport]);
  const handlePrefetch = useCallback((danhMuc: string) => {
    void utils.Product.findInfiniteProduct.prefetchInfinite({
      limit: 8,
      filters: {
        'danh-muc': danhMuc
      }
    });
  }, []);

  if (error)
    return (
      <Paper className='flex items-center gap-2 border border-red-200 bg-red-50 p-4 text-red-700'>
        <IconAlertCircle size={18} />
        {error.message}
      </Paper>
    );
  const products = data?.pages.flatMap(p => p.items) || [];
  return (
    <>
      <Flex align={'center'} gap={'xs'} mb={20} className='w-full overflow-x-auto pb-3'>
        <Link href={`/goi-mon-nhanh`}>
          <Button active={!searchParams.get('danh-muc')} children={'Tất cả'} variant='outline' radius={'xl'} />
        </Link>
        {categories?.map((item: any, index: number) => (
          <>
            <Link href={`/goi-mon-nhanh?danh-muc=${item.tag}`} key={`${item.id}+${index}`}>
              <Button
                onMouseEnter={() => handlePrefetch(item.tag)}
                active={item.tag === searchParams.get('danh-muc')}
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
          {isLoading ? (
            [1, 2, 3, 4, 5, 6, 7, 8].map((item: any, index: number) => (
              <GridCol
                span={{ base: 12, sm: 6, md: 6, lg: 3 }}
                key={`${item.id}+${index}`}
                className='animate-fadeUp'
                style={{ animationDuration: `${index * 0.05 + 0.5}s` }}
              >
                <ProductCardSkeleton />
              </GridCol>
            ))
          ) : products?.length > 0 ? (
            products.map((item: any, index: number) => (
              <GridCol
                span={{ base: 12, sm: 6, md: 6, lg: 3 }}
                key={`${item.id}+${index}`}
                className='animate-fadeUp'
                style={{
                  animationDuration: `${(index % LIMIT_DATA) * 0.05 + 0.5}s`
                }}
              >
                <ProductCardCarouselVertical data={item} key={index} />
              </GridCol>
            ))
          ) : (
            <Empty hasButton={false} size='md' title='Không có sản phẩm phù hợp' content='Vui lòng quay lại sau' />
          )}
        </Grid>
      </Flex>
      {hasNextPage && (
        <Grid ref={ref} mt={'md'}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item: any, index: number) => (
            <GridCol
              span={{ base: 12, sm: 6, md: 6, lg: 3 }}
              key={`${item.id}+${index}`}
              className='animate-fadeUp'
              style={{ animationDuration: `${index * 0.05 + 0.5}s` }}
            >
              <ProductCardSkeleton />
            </GridCol>
          ))}
        </Grid>
      )}
    </>
  );
};
