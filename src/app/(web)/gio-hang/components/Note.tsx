'use client';
import { Button, Group, Stack, Textarea } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useCartItem } from '~/components/Hooks/use-cart';
import { useCartStore } from '~/stores/cart.store';
export const Note = ({ productId }: { productId: string }) => {
  const [note, setNote] = useState<string>('');
  const updateCart = useCartStore(s => s.updateCart);
  const item = useCartItem(productId);

  useEffect(() => {
    if (item && item?.note) {
      setNote(item?.note);
    }
  }, [item]);

  return (
    <Group>
      <Textarea
        label='Ghi chú'
        value={note}
        placeholder='vd: Làm nóng món ăn,...'
        size='xs'
        onChange={e => setNote(e.target.value)}
        flex={1}
      />
      <Stack gap={'xs'}>
        <Button
          disabled={!note}
          w={'max-content'}
          size='xs'
          onClick={() => updateCart({ productId, quantity: 0, note })}
        >
          Áp dụng
        </Button>
        <Button
          disabled={!note}
          fullWidth
          variant='danger'
          size='xs'
          onClick={() => {
            updateCart({ productId, note: undefined, quantity: 0 });
            setNote('');
          }}
        >
          Xóa
        </Button>
      </Stack>
    </Group>
  );
};
