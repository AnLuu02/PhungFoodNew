'use client';
import { Group, Stack, Textarea } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import BButton from '~/components/Button/Button';
import { CartItem } from '~/types/client-type-trpc';
export const Note = ({ productId }: { productId: string }) => {
  const [cart, setCart] = useLocalStorage<CartItem[]>({ key: 'cart', defaultValue: [] });
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    const product = cart.find(item => item.id === productId);
    if (product?.note) {
      setNote(product?.note);
    }
  }, [cart]);

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
        <BButton
          disabled={!note}
          w={'max-content'}
          size='xs'
          onClick={() => {
            setCart(prev => prev.map(item => (item.id === productId ? { ...item, note } : item)));
          }}
        >
          Áp dụng
        </BButton>
        <BButton
          disabled={!note}
          w={'100%'}
          bg={'red'}
          size='xs'
          className='text-white'
          onClick={() => {
            const productExist = cart.find(item => item.id === productId);
            if (productExist) {
              const { note, ...rest } = productExist;
              setCart(prev => prev.map(item => (item.id === productId ? { ...rest } : item)));
              setNote('');
            }
          }}
        >
          Xóa
        </BButton>
      </Stack>
    </Group>
  );
};
