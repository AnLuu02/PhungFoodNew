'use client';
import { useMemo } from 'react';
import { useCartStore } from '~/stores/cart.store';

export const useCartItems = () => {
  const items = useCartStore(s => s.items);

  return useMemo(() => Object.values(items), [items]);
};
export const useCartItem = (productId: string) => {
  const items = useCartStore(s => s.items);
  return useMemo(() => items[productId], [productId]);
};
export const useCartCount = () => useCartStore(state => Object.keys(state.items).length);
export const useCartAmount = () =>
  useCartStore(state => {
    return Object.values(state.items).reduce(
      (sum, item) => sum + (item.product.price - item.product.discount) * item.quantity,
      0
    );
  });

export const useVoucherItems = () => {
  const vouchers = useCartStore(s => s.vouchers);
  return useMemo(() => Object.values(vouchers), [vouchers]);
};
export const useVoucherItem = (voucherId: string) => {
  const vouchers = useCartStore(s => s.vouchers);
  return useMemo(() => vouchers[voucherId], [voucherId]);
};
