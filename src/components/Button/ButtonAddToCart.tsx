'use client';

import { Button, ButtonProps } from '@mantine/core';
import { IconShoppingCartPlus } from '@tabler/icons-react';
import { flyToCart, getVisibleToEl } from '~/lib/ButtonHandler/FlyToCart';
import { CartItem } from '~/shared/types/store.types';
import { useCartStorage } from '~/stores/cart.store';

export function ButtonAddToCart({
  item,
  style,
  handleAfterAdd,
  notify
}: {
  item: CartItem;
  style: ButtonProps;
  handleAfterAdd: () => void;
  notify: (title?: string, message?: string) => void;
}) {
  const addCart = useCartStorage(state => state.addCart);
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
        const from = document.getElementById(`productImage-${item?.product?.id}`);
        if (from && to) flyToCart({ fromEl: from, toEl: to, imageUrl: from?.getAttribute('src') || '' });
        addCart(item);
        notify('Đã thêm vào giỏ hàng', 'Sản phẩm đã có trong giỏ hàng. Thanh toán ngay!');
        handleAfterAdd();
      }}
      {...style}
    />
  );
}
