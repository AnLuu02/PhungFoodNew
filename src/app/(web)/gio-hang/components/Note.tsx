'use client';
import { Group, Stack, Textarea } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import BButton from '~/components/Button/Button';
export const Note = ({ productId }: any) => {
  const [cart, setCart] = useLocalStorage<any>({ key: 'cart', defaultValue: [] });
  const [note, setNote] = useState<any>('');

  useEffect(() => {
    const product = cart.find((item: any) => item.id === productId);
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
            setCart((prev: any) => prev.map((item: any) => (item.id === productId ? { ...item, note } : item)));
          }}
        >
          Áp dụng
        </BButton>
        <BButton
          disabled={!note}
          w={'100%'}
          bg={'red'}
          size='xs'
          onClick={() => {
            const productExist = cart.find((item: any) => item.id === productId);
            if (productExist) {
              const { note, ...rest } = productExist;
              setCart((prev: any) => prev.map((item: any) => (item.id === productId ? { ...rest } : item)));
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
