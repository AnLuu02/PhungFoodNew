'use client';
import { Card, Flex, Group, NumberInput, Select, Spoiler, Stack, Text, Textarea } from '@mantine/core';
import { IconPencil, IconShoppingCartPlus } from '@tabler/icons-react';
import { ButtonAddToCart } from '~/components/Button/ButtonAddToCart';

import { useDebouncedValue } from '@mantine/hooks';
import { memo, useEffect, useState } from 'react';
import ViewingUser from '~/components/UserViewing';
import { toNumber } from '~/lib/FuncHandler/Format';
import { ProductBase } from '~/shared/type-trpc/product.type-trpc';
import { useCartStore } from '~/stores/cart.store';

const PurchaseAction = ({
  product
}: {
  product: Pick<ProductBase, 'id' | 'discount' | 'price' | 'name' | 'description' | 'availableQuantity'> & {
    thumbnail: string;
  };
}) => {
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState<string | number>(1);
  const [debouncedValueNote] = useDebouncedValue(note, 300);
  const [debouncedValueQuantity] = useDebouncedValue(quantity, 300);

  const item = useCartStore(c => c.items[product.id]);

  useEffect(() => {
    if (item?.note && !note) {
      setNote(item?.note);
    }
    if (item?.quantity && quantity === 1) {
      setQuantity(item?.quantity);
    }
  }, [item?.note, item?.quantity]);

  return (
    <>
      <ViewingUser productId={product?.id || ''} />

      <Card
        withBorder
        className='border-0 border-l-2 border-mainColor bg-gray-100 dark:bg-dark-card'
        p={'xs'}
        my={'xs'}
      >
        <Spoiler
          maxHeight={60}
          showLabel='Xem thêm'
          hideLabel='Ẩn'
          classNames={{
            control: 'text-lg font-bold text-mainColor'
          }}
        >
          <Text size='sm'>{product?.description || 'Đang cập nhật'}</Text>
        </Spoiler>
      </Card>

      <Stack gap='xs'>
        <Text size='sm' fw={700}>
          Ghi chú: <i className='text-sm text-gray-500'>{item ? '(sản phẩm đã có trong giỏ hàng)' : ''}</i>
        </Text>
        <>
          <Textarea
            placeholder='Thêm ghi chú sản phẩm'
            value={note}
            onChange={e => setNote(e.target.value.toString())}
            leftSection={<IconPencil size={16} />}
          />
        </>
      </Stack>
      <Flex align='flex-end' gap={'md'} wrap={{ base: 'wrap', md: 'nowrap' }}>
        <Group gap='xs'>
          <>
            <NumberInput
              label={
                <Text size='sm' fw={700}>
                  Số lượng:
                </Text>
              }
              value={quantity}
              onChange={setQuantity}
              thousandSeparator=','
              min={1}
              max={toNumber(product?.availableQuantity) ?? 100}
              clampBehavior='strict'
              className='w-[80px]'
            />
          </>
        </Group>
        <Group gap='xs'>
          <Select
            disabled
            label={
              <Text size='sm' fw={700}>
                Kích cỡ:
              </Text>
            }
            searchable
            placeholder='Chọn'
            data={['1 người ăn', '2 người ăn', '3 người ăn', '5 người ']}
          />
        </Group>
        <ButtonAddToCart
          item={{
            product: {
              id: product?.id,
              price: product?.price ?? 0,
              discount: product?.discount ?? 0,
              name: product?.name,
              thumbnail: product.thumbnail
            },
            note: debouncedValueNote,
            quantity: toNumber(debouncedValueQuantity) ?? 0
          }}
          notifySuccess={{
            title: 'Cập nhật giỏ hàng thành công',
            message: 'Sản phẩm đã được thêm vào giỏ hàng. Có thể truy cập giỏ hàng để hoàn tất thanh toán.'
          }}
          style={{
            children: 'Mua hàng',
            size: 'md',
            fullWidth: true,
            leftSection: <IconShoppingCartPlus size={20} className='mr-2 font-bold' />
          }}
        />
      </Flex>
    </>
  );
};

export default memo(PurchaseAction);
