'use client';

import { Box, Button, Group, Modal, Paper, Stack, Text, Textarea } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { ImageType } from '@prisma/client';
import { IconCheck, IconX } from '@tabler/icons-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { ButtonCheckout } from '~/app/(web)/thanh-toan/components/ButtonCheckout';
import { caculateAmount } from '~/lib/FuncHandler/calculateLevel';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { getImageProduct } from '~/lib/FuncHandler/getImageProduct';
import { useCartStorage } from '~/stores/cart.store';
import { ModalProps } from '~/types/modal';
import { useCartItem, useCartItems } from '../Hooks/use-cart';
export default function ModalSuccessAddToCart({ type, opened, onClose, data }: ModalProps<any>) {
  const cart = useCartItems();
  const updateCart = useCartStorage(s => s.updateCart);
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
        quantity: 0,
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
                src={
                  getImageProduct(data?.imageForEntities || [], ImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg'
                }
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
                      quantity: 0,
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
              data={cart.map(item => ({
                productId: item?.product.id || '',
                note: item?.note ?? '',
                price: item?.product.price ?? 0,
                quantity: item?.quantity ?? 0
              }))}
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
