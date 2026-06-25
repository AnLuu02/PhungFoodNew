import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '~/shared/types/store.types';

export type CartStorage = {
  items: Record<string, CartItem>;
  addCart: (item: CartItem) => void;
  updateCart: ({ productId, quantity, note }: { productId: string; quantity: number; note?: string }) => void;
  removeCart: (id: string) => void;
  clearCart: () => void;
  reBuild: (items: CartItem[]) => void;
};

export const useCartStorage = create<CartStorage>()(
  persist(
    set => ({
      items: {},

      reBuild: (items: CartItem[]) =>
        set(() => ({
          items: items.reduce(
            (acc, item) => {
              acc[item.product.id] = item;
              return acc;
            },
            {} as Record<string, CartItem>
          )
        })),

      addCart: (item: CartItem) =>
        set(state => {
          const { id } = item.product;
          const existed = state.items[id];
          return {
            items: {
              ...state.items,
              [id]: existed
                ? { ...existed, quantity: existed.quantity + item.quantity, note: item.note ?? existed.note }
                : item
            }
          };
        }),

      updateCart: ({ productId, quantity, note }) =>
        set(state => {
          if (!state.items[productId]) return state;
          const existed = state.items[productId];
          return {
            items: {
              ...state.items,
              [productId]: {
                ...existed,
                quantity: existed.quantity + quantity,
                note
              }
            }
          };
        }),

      removeCart: (id: string) =>
        set(state => {
          const newItems = { ...state.items };
          delete newItems[id];
          return { items: newItems };
        }),

      clearCart: () => set({ items: {} })
    }),
    {
      name: 'cart-store'
    }
  )
);
