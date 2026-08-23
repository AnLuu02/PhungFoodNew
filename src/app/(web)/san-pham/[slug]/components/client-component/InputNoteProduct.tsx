'use client';

import { Textarea } from '@mantine/core';
import { useDebouncedValue, useLocalStorage } from '@mantine/hooks';
import { IconPencil } from '@tabler/icons-react';
import { memo, useEffect, useState } from 'react';
import { CartItemTempo } from '~/shared/types/store.types';

const InputNoteProduct = ({ productId }: { productId: string }) => {
  const [note, setNote] = useState('');
  const [debouncedValue] = useDebouncedValue(note, 300);
  const [_, setCartTemp] = useLocalStorage<CartItemTempo>({
    key: 'cart-tempo',
    defaultValue: {
      productId,
      quantity: 1
    }
  });

  useEffect(() => {
    if (debouncedValue) {
      setCartTemp(prev => ({ ...prev, productId, note: debouncedValue }));
    } else {
      setCartTemp(prev => ({ ...prev, productId, note: '' }));
    }
  }, [debouncedValue]);

  return (
    <>
      <Textarea
        placeholder='Thêm ghi chú sản phẩm'
        value={note}
        onChange={e => setNote(e.target.value.toString())}
        leftSection={<IconPencil size={16} />}
      />
    </>
  );
};
export default memo(InputNoteProduct);
