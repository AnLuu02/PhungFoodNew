import { Grid, GridCol } from '@mantine/core';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import dynamic from 'next/dynamic';
import Empty from '~/app/_components/Empty';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import { api } from '~/trpc/server';

export const metadata: Metadata = {
  title: 'Yêu thích',
  description: 'Yêu thích'
};
const ProductCardCarouselVertical = dynamic(
  () => import('~/app/_components/Web/Home/_Components/ProductCardCarouselVertical'),
  { ssr: false }
);
export default async function FavouritePage() {
  const user = await getServerSession(authOptions);
  const favourite_food = user?.user?.email ? await api.FavouriteFood.getFilter({ s: user?.user?.email || '' }) : [];

  return (
    <Grid w={'100%'} mt={'md'} columns={12}>
      {favourite_food?.length > 0 ? (
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
