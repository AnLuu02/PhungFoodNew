import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, VoucherItem } from '~/shared/types/store.types';

export type CartStorage = {
  vouchers: Record<string, VoucherItem>;
  addVoucher: (item: VoucherItem) => void;
  addVouchers: (items: VoucherItem[]) => void;
  removeVoucher: (id: string) => void;
  clearVoucher: () => void;

  items: Record<string, CartItem>;
  addCart: (item: CartItem) => void;
  updateCart: (payload: { productId: string; quantity: number; note?: string }) => void;
  removeCart: (id: string) => void;
  clearCart: () => void;
  reBuild: (items: CartItem[]) => void;
};

export const useCartStore = create<CartStorage>()(
  persist(
    set => ({
      items: {},
      vouchers: {},

      reBuild: items =>
        set(() => ({
          items: items.reduce(
            (acc, item) => {
              acc[item.product.id] = item;
              return acc;
            },
            {} as Record<string, CartItem>
          )
        })),

      addCart: item =>
        set(state => {
          const { id } = item.product;
          const existed = state.items[id];
          return {
            items: {
              ...state.items,
              [id]: existed
                ? {
                    ...existed,
                    quantity: existed.quantity + item.quantity,
                    note: item.note ?? existed.note
                  }
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
                note: note ?? existed.note
              }
            }
          };
        }),

      removeCart: id =>
        set(state => {
          const { [id]: _, ...remainingItems } = state.items;
          return { items: remainingItems };
        }),

      clearCart: () => set({ items: {}, vouchers: {} }),

      addVoucher: item =>
        set(state => ({
          vouchers: { ...state.vouchers, [item.id]: item }
        })),

      addVouchers: items =>
        set(state => ({
          vouchers: {
            ...state.vouchers,
            ...items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {})
          }
        })),

      removeVoucher: id =>
        set(state => {
          const { [id]: _, ...remainingVouchers } = state.vouchers;
          return { vouchers: remainingVouchers };
        }),

      clearVoucher: () => set({ vouchers: {} })
    }),
    { name: 'cart-store' }
  )
);
