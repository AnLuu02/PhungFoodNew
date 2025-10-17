'use client';

import { useLocalStorage } from '@mantine/hooks';
import BButton, { IBButton } from '~/components/Button/Button';
import { flyToCart, getVisibleToEl } from '~/lib/button-handle/FlyToCart';

export function ButtonAddToCart({
  product,
  style,
  handleAfterAdd,
  notify
}: {
  product: any;
  style: IBButton;
  handleAfterAdd: () => void;
  notify: (title?: string, message?: string) => void;
}) {
  const [cart, setCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });

  return (
    <BButton
      {...style}
      onClick={() => {
        const to = getVisibleToEl('.cart-btn');
        const from = document.getElementById(`productImage-${product?.id}`);
        if (from && to) flyToCart({ fromEl: from, toEl: to, imageUrl: from?.getAttribute('src') || '' });

        const existingItem = cart.find((item: any) => item.id === product?.id);
        if (existingItem) {
          setCart(
            cart.map((item: any) =>
              item.id === product?.id ? { ...item, quantity: product.quantity + existingItem.quantity } : item
            )
          );
        } else {
          setCart([...cart, { ...product, quantity: product.quantity }]);
        }
        notify('Đã thêm vào giỏ hàng', 'Sản phẩm đã được Thêm.');
        handleAfterAdd();
      }}
    />
  );
}
