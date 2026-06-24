import { useFavoriteStore } from '~/stores/favorite.store';

export const useFavorite = (productId: string) => {
  return useFavoriteStore(state => state.favoriteIds.has(productId));
};
