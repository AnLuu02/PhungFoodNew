'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { GetFilterFavouriteFood } from '~/shared/type-trpc/favouriteFood.type-trpc';
import { useFavoriteStore } from '~/stores/favorite.store';
import { api } from '~/trpc/react';

export function FavoriteProvider({ favourites }: { favourites?: GetFilterFavouriteFood }) {
  const { data: session } = useSession();

  const userId = session?.user?.id;

  const hydrate = useFavoriteStore(state => state.hydrate);

  const { data } = api.FavouriteFood.getFilterIds.useQuery(
    {
      keys: userId ? [userId] : []
    },
    {
      enabled: !!userId,
      initialData: favourites ? favourites : undefined
    }
  );

  const utils = api.useUtils();

  useEffect(() => {
    if (!userId) return;
    if (!data) return;

    hydrate(data.map(item => item.productId));

    void utils.FavouriteFood.getFilter.prefetch({
      keys: userId ? [userId] : []
    });
  }, [data, userId]);

  return null;
}
