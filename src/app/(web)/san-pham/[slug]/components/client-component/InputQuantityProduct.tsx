'use client';

import { NumberInput, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { memo, useEffect, useState } from 'react';
import { toNumber } from '~/lib/FuncHandler/Format';
import { CartItemTempo } from '~/shared/types/store.types';

const InputQuantityProduct = ({ productId, availableQuantity }: { productId: string; availableQuantity?: number }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [cartTemp, setCartTemp, resetCartTempo] = useLocalStorage<CartItemTempo>({
    key: 'cart-tempo',
    defaultValue: {
      productId,
      quantity: 1
    }
  });
  useEffect(() => {
    setCartTemp(prev => {
      if (prev.productId === productId) return prev;
      return { productId, quantity: 1 };
    });
    setIsMounted(true);
  }, []);

  return (
    <>
      <NumberInput
        disabled={!isMounted}
        label={
          <Text size='sm' fw={700}>
            Số lượng:
          </Text>
        }
        value={cartTemp.quantity}
        onChange={value => {
          setCartTemp(prev => ({ ...prev, productId, quantity: toNumber(value) ?? 1 }));
        }}
        thousandSeparator=','
        min={1}
        max={toNumber(availableQuantity) ?? 100}
        clampBehavior='strict'
        className='w-[80px]'
      />
    </>
  );
};
export default memo(InputQuantityProduct);
