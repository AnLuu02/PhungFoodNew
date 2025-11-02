'use client';
import { Grid, GridCol } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import Empty from '~/components/Empty';
import ProductCardCarouselVertical from '~/components/Web/Card/CardProductCarouselVertical';
import { api } from '~/trpc/react';

export default function FavouritePage() {
  const [localFavouriteFood] = useLocalStorage<{ product: any }[]>({
    key: 'favouriteFood',
    defaultValue: []
  });

  const { data: session } = useSession();
  const userEmail = session?.user?.email ?? '';

  const { data: favouriteFoodFromApi = [] } = api.FavouriteFood.getFilter.useQuery(
    { s: userEmail },
    { enabled: !!userEmail }
  );

  const dataRender = useMemo(() => {
    if (userEmail) return favouriteFoodFromApi.map((item: any) => item.product);
    return localFavouriteFood;
  }, [userEmail, favouriteFoodFromApi, localFavouriteFood]);

  if (!dataRender?.length) {
    return <Empty title='Không có sản phẩm yêu thích hiện tại' content='Không có sản phẩm yêu thích hiện tại' />;
  }

  return (
    <Grid w='100%' mt='md' columns={12}>
      {dataRender.map((item, index) => (
        <GridCol
          span={{ base: 12, sm: 6, md: 3, lg: 2 }}
          key={index}
          className={`animate-fadeUp`}
          style={{ animationDuration: `${index * 0.05 + 0.5}s` }}
        >
          <ProductCardCarouselVertical data={item} />
        </GridCol>
      ))}
    </Grid>
  );
}
