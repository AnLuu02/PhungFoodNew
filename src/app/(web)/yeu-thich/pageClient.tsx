'use client';
import { Grid, GridCol } from '@mantine/core';
import { useSession } from 'next-auth/react';
import Empty from '~/components/Empty';
import ProductCardCarouselVertical from '~/components/Web/Card/CardProductCarouselVertical';
import { CardSkeleton } from '~/components/Web/Card/CardSkeleton';
import { GetFilterFavouriteFood } from '~/shared/type-trpc/favouriteFood.type-trpc';
import { api } from '~/trpc/react';

export default function FavouritePageClient({ favourites }: { favourites: GetFilterFavouriteFood }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data, isLoading } = api.FavouriteFood.getFilter.useQuery(
    {
      keys: userId ? [userId] : []
    },
    {
      enabled: !!userId,
      initialData: favourites
    }
  );

  const dataRender = data ?? [];

  if (!isLoading && dataRender.length === 0) {
    return (
      <Empty
        title='Không có sản phẩm yêu thích hiện tại'
        content='Không có sản phẩm yêu thích hiện tại'
        btnText='Xem thực đơn'
      />
    );
  }

  return (
    <>
      <Grid w='100%' mt='md' columns={12}>
        {isLoading
          ? [1, 2, 3, 4, 5, 6].map((_, index) => (
              <GridCol
                span={{ base: 12, sm: 6, md: 3, lg: 2 }}
                key={index}
                className='animate-fadeUp'
                style={{ animationDuration: `${index * 0.05 + 0.5}s` }}
              >
                <CardSkeleton />
              </GridCol>
            ))
          : dataRender.map((item, index) => (
              <GridCol
                span={{ base: 12, sm: 6, md: 3, lg: 2 }}
                key={item?.product?.id}
                className='animate-fadeUp'
                style={{ animationDuration: `${index * 0.05 + 0.5}s` }}
              >
                <ProductCardCarouselVertical data={item?.product} />
              </GridCol>
            ))}
      </Grid>
    </>
  );
}
