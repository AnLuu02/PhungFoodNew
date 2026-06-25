'use client';
import { useMemo } from 'react';
import { useCartStorage } from '~/stores/cart.store';

export const useCartItems = () => {
  const items = useCartStorage(s => s.items);

  return useMemo(() => Object.values(items), [items]);
};
export const useCartItem = (productId: string) => {
  const items = useCartStorage(s => s.items);

  return useMemo(() => items[productId], [productId]);
};
export const useCartCount = () => useCartStorage(state => Object.keys(state.items).length);
export const useCartAmount = () =>
  useCartStorage(state => {
    return Object.values(state.items).reduce(
      (sum, item) => sum + (item.product.price - item.product.discount) * item.quantity,
      0
    );
  });
