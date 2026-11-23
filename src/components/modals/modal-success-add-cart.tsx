'use client';

import { Box, Button, Group, Modal, Paper, Stack, Text, Textarea } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconCheck, IconX } from '@tabler/icons-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { ButtonCheckout } from '~/app/(web)/thanh-toan/components/ButtonCheckout';
import { caculateAmount } from '~/lib/helpers/user/calculate-level';
import { formatPriceLocaleVi } from '~/lib/utils/format';
import { useCartStore } from '~/stores/cart.store';
import { ModalProps } from '~/shared/types/modal.types';
import { useCartItem, useCartItems } from '~/components/hooks/use-cart';
export default function ModalSuccessAddToCart({ type, opened, onClose, data }: ModalProps<any>) {
  const cart = useCartItems();
  const updateCart = useCartStore(s => s.updateCart);
  const item = useCartItem(data?.id);

  const [note, setNote] = useState('');
  const [noteDebounced] = useDebouncedValue(note, 800);

  const { finalAmount, tax, totalDiscountAmount, totalOriginalPrice } = useMemo(() => {
    return caculateAmount({
      products: [
        {
          discount: item?.product.discount ?? 0,
          price: item?.product.price ?? 0,
          quantity: item?.quantity ?? 1
        }
      ],
      vouchers: []
    });
  }, [item?.product?.id, item?.product?.price, item?.quantity]);

  const dataCheckout = cart.map(item => {
    const quantity = item?.quantity ?? 0;
    const unitPrice = item?.product.price ?? 0;
    const discount = item?.product.discount ?? 0;

    const totalPrice = unitPrice * quantity - discount * quantity;
    return {
      productId: item?.product.id || '',
      note: item?.note ?? '',
      unitPrice,
      discount,
      totalPrice,
      quantity,
      productName: item.product.name,
      productImage: item.product.thumbnail
    };
  });

  useEffect(() => {
    if (opened) {
      item && item?.note ? setNote(item?.note) : setNote('');
    }
  }, [opened, item]);

  useEffect(() => {
    if (!item) return;
    if (noteDebounced) {
      updateCart({
        productId: item?.product?.id,
        quantity: item.quantity,
        note
      });
    }
  }, [noteDebounced, item]);
  return (
    <Modal
      opened={opened && type === 'success'}
      onClose={() => {
        if ((note && noteDebounced) || (!note && !noteDebounced)) {
          onClose();
          setNote('');
        }
      }}
      padding={0}
      size='md'
      withCloseButton={false}
      centered
    >
      <Box className='relative'>
        <Box className='flex items-center gap-2 bg-mainColor p-2 text-white'>
          <IconCheck size={24} />
          <Text size='md' fw={700}>
            Mua hàng thành công
          </Text>

          <IconX
            onClick={onClose}
            size={20}
            className='absolute right-4 top-3 cursor-pointer text-white hover:opacity-50'
          />
        </Box>

        <Stack p='md' gap='md'>
          <Group>
            <Paper
              withBorder
              w={60}
              h={60}
              className='flex items-center justify-center overflow-hidden border-mainColor/70'
              pos={'relative'}
            >
              <Image
                loading='lazy'
                src={data?.thumbnailUrl || '/images/jpg/empty-300x240.jpg'}
                alt={data?.name || 'Hành tây'}
                fill
                style={{ objectFit: 'cover' }}
                className='object-cover'
              />
            </Paper>

            <Box>
              <Text fw={700}>{data?.name || 'Hành tây'}</Text>
              <Text className='text-mainColor' fw={700}>
                {formatPriceLocaleVi(data?.price || 0)}
              </Text>
            </Box>
          </Group>

          <Box>
            <Text size='sm' c='dimmed'>
              Giỏ hàng của bạn hiện có <b>{cart?.length || 0}</b> sản phẩm
            </Text>
            <Text size='sm' c='dimmed'>
              <b>{data?.name}</b> có <b>{item?.quantity || 0} </b> sản phẩm
            </Text>
          </Box>
          <Group w={'100%'}>
            <Textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder='Ghi chú'
              autosize
              minRows={2}
              w={'100%'}
            />
          </Group>

          <Group grow>
            <Button
              variant='outline'
              onClick={() => {
                if (note !== '') {
                  if (item) {
                    updateCart({
                      productId: item.product.id,
                      quantity: item.quantity,
                      note
                    });
                  }
                }
                onClose();
              }}
              size='xs'
            >
              Tiếp tục mua hàng
            </Button>
            <ButtonCheckout
              stylesButtonCheckout={{
                fullWidth: true,
                children: 'Đặt ngay',
                size: 'xs',
                disabled: !note ? false : note === noteDebounced ? false : true
              }}
              data={dataCheckout}
              finalAmount={finalAmount}
              originalAmount={totalOriginalPrice}
              taxAmount={tax}
              discountAmount={totalDiscountAmount}
              onClick={() => onClose()}
            />
          </Group>
        </Stack>
      </Box>
    </Modal>
  );
}
