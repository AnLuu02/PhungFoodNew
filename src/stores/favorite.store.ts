import { create } from 'zustand';

interface FavoriteStore {
  favoriteIds: Set<string>;
  hydrate: (ids: string[]) => void;
  add: (productId: string) => void;
  remove: (productId: string) => void;
  toggle: (productId: string) => void;
  clear: () => void;
}

export const useFavoriteStore = create<FavoriteStore>(set => ({
  favoriteIds: new Set<string>(),

  hydrate: (ids: string[]) => set({ favoriteIds: new Set(ids) }),

  add: (productId: string) =>
    set(state => ({
      favoriteIds: new Set(state.favoriteIds).add(productId)
    })),

  remove: (productId: string) =>
    set(state => {
      const next = new Set(state.favoriteIds);
      next.delete(productId);
      return { favoriteIds: next };
    }),

  toggle: (productId: string) =>
    set(state => {
      const next = new Set(state.favoriteIds);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return { favoriteIds: next };
    }),

  clear: () => set({ favoriteIds: new Set() })
}));
