'use client';

import { Button, ButtonProps } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconShoppingCartPlus } from '@tabler/icons-react';
import { flyToCart, getVisibleToEl } from '~/lib/ButtonHandler/FlyToCart';
import { NotifySuccess } from '~/lib/FuncHandler/toast';
import { CartItem, CartItemTempo } from '~/shared/types/store.types';
import { useCartStore } from '~/stores/cart.store';

export function ButtonAddToCart({
  item,
  style,
  handleAfterAdd,
  notifySuccess
}: {
  item: CartItem;
  style?: ButtonProps;
  handleAfterAdd?: () => void;
  notifySuccess?: {
    title?: string;
    message?: string;
  };
}) {
  const addCart = useCartStore(state => state.addCart);
  const [cartTempo, _, resetCartTempo] = useLocalStorage<CartItemTempo>({ key: 'cart-tempo' });

  const finalItem: CartItem = {
    ...item,
    quantity: item.quantity + (cartTempo?.quantity ?? 0),
    note: cartTempo?.note ?? item.note
  };

  return (
    <Button
      radius={'xl'}
      size={'xs'}
      leftSection={<IconShoppingCartPlus size={14} className='font-bold' />}
      classNames={{
        section: 'mr-[4px]'
      }}
      onClick={() => {
        const to = getVisibleToEl('.cart-btn');
        const from = document.getElementById(`productImage-${finalItem?.product?.id}`);
        if (from && to) flyToCart({ fromEl: from, toEl: to, imageUrl: from?.getAttribute('src') || '' });
        addCart(finalItem);
        handleAfterAdd?.();
        resetCartTempo();
        if (notifySuccess) {
          NotifySuccess(
            notifySuccess.title ?? 'Đã thêm vào giỏ hàng',
            notifySuccess.message ?? 'Sản phẩm đã có trong giỏ hàng. Thanh toán ngay!'
          );
        }
      }}
      {...(style ?? {})}
    />
  );
}
