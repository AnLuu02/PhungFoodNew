import { Grid, GridCol } from '@mantine/core';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import Empty from '~/components/Empty';
import ProductCardCarouselVertical from '~/components/Web/Card/ProductCardCarouselVertical';
import { api } from '~/trpc/server';

export const metadata: Metadata = {
  title: 'Sản phẩm yêu thích - Phụng Food',
  description:
    'Xem các sản phẩm yêu thích của bạn tại Phụng Food. Lưu và quản lý món ăn bạn yêu thích để đặt hàng dễ dàng hơn.'
};
export default async function FavouritePage() {
  const user = await getServerSession(authOptions);
  const favourite_food = user?.user?.email ? await api.FavouriteFood.getFilter({ s: user?.user?.email || '' }) : [];

  if (favourite_food?.length <= 0)
    return <Empty content='Không có sản phẩm yêu thích hiện tại' title='Không có sản phẩm yêu thích hiện tại' />;
  return (
    <Grid w={'100%'} mt={'md'} columns={12}>
      {favourite_food?.map((item: any, index: number) => {
        return (
          <GridCol span={{ base: 12, sm: 6, md: 3, lg: 2 }} key={index}>
            <ProductCardCarouselVertical product={item.product} />
          </GridCol>
        );
      })}
    </Grid>
  );
}
