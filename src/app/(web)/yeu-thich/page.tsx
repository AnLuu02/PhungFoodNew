'use client';

import { Grid, GridCol } from '@mantine/core';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import LoadingComponent from '~/app/_components/Loading/Loading';
import { api } from '~/trpc/react';

const Empty = dynamic(() => import('~/app/_components/Empty'), { ssr: false });
const ProductCardCarouselVertical = dynamic(
  () => import('~/app/_components/Web/Home/_Components/ProductCardCarouselVertical'),
  { ssr: false }
);
export default function FavouritePage() {
  const { data: user } = useSession();
  const { data, isLoading } = user?.user?.email
    ? api.FavouriteFood.getFilter.useQuery({ s: user?.user?.email || '' })
    : { data: [], isLoading: false };
  const favourite_food = data ?? [];

  return (
    <Grid w={'100%'} mt={'md'} columns={12}>
      {isLoading ? (
        <LoadingComponent />
      ) : favourite_food?.length > 0 ? (
        favourite_food?.map((item: any, index: number) => {
          return (
            <GridCol span={{ base: 12, sm: 6, md: 3, lg: 2 }} key={index}>
              <ProductCardCarouselVertical product={item.product} />
            </GridCol>
          );
        })
      ) : (
        <Empty content='Không có sản phẩm yêu thích hiện tại' title='Không có sản phẩm yêu thích hiện tại' />
      )}
    </Grid>
  );
}
