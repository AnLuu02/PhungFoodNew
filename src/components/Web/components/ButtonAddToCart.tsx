'use client';

import { useLocalStorage } from '@mantine/hooks';
import BButton, { IBButton } from '~/components/Button';

export default function ButtonAddToCart({
  product,
  quantity,
  style,
  handleAfterAdd,
  notify
}: {
  product: any;
  quantity: number;
  style: IBButton;
  handleAfterAdd: () => void;
  notify: (title?: string, message?: string) => void;
}) {
  const [cart, setCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });

  return (
    <BButton
      {...style}
      onClick={() => {
        const existingItem = cart.find((item: any) => item.id === product?.id);
        if (existingItem) {
          setCart(
            cart.map((item: any) =>
              item.id === product?.id ? { ...item, quantity: quantity + existingItem.quantity } : item
            )
          );
        } else {
          setCart([...cart, { ...product, quantity: quantity }]);
        }
        notify('Đã thêm vào giỏ hàng', 'Sản phẩm đã được Thêm.');
        handleAfterAdd();
      }}
    />
  );
}
