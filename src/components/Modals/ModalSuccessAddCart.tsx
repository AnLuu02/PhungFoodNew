'use client';

import { Box, Button, Group, Modal, Paper, Stack, Text, Textarea } from '@mantine/core';
import { useDebouncedValue, useLocalStorage } from '@mantine/hooks';
import { IconCheck, IconX } from '@tabler/icons-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ButtonCheckout } from '~/app/(web)/thanh-toan/components/ButtonCheckout';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { getImageProduct } from '~/lib/FuncHandler/getImageProduct';
import { LocalImageType } from '~/lib/ZodSchema/enum';
import { ModalProps } from '~/types/modal';

export default function ModalSuccessAddToCart({ type, opened, onClose, data }: ModalProps<any>) {
  const [cart, setCart] = useLocalStorage<any>({ key: 'cart', defaultValue: [] });
  const [note, setNote] = useState('');
  const [noteDebounced] = useDebouncedValue(note, 800);
  useEffect(() => {
    if (opened) {
      const existNoteProduct = cart.find((item: any) => item.id === data?.id && item.note !== note);
      if (existNoteProduct) {
        setNote(existNoteProduct?.note);
      }
    }
  }, [opened]);

  useEffect(() => {
    if (noteDebounced) {
      const { cartFilter, existNoteProduct } = cart?.reduce(
        (acc: any, item: any) => {
          if (item.id === data?.id) {
            acc.existNoteProduct = item;
          } else {
            acc.cartFilter.push(item);
          }
          return acc;
        },
        { cartFilter: [], existNoteProduct: null }
      );
      if (!existNoteProduct) return;
      setCart([...cartFilter, { ...existNoteProduct, note: noteDebounced }]);
    }
  }, [noteDebounced]);
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
      radius='md'
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
              className='flex items-center justify-center overflow-hidden rounded-lg border-mainColor/70'
              pos={'relative'}
            >
              <Image
                loading='lazy'
                src={getImageProduct(data?.images || [], LocalImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg'}
                alt={data?.name || 'Hành tây'}
                fill
                style={{ objectFit: 'cover' }}
                className='rounded-md object-cover'
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
              <b>{data?.name}</b> có <b>{cart?.find((item: any) => item.id === data?.id)?.quantity || 0} </b> sản phẩm
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
              variant='filled'
              color='dark'
              onClick={() => {
                if (note !== '') {
                  const existingItem = cart.find((item: any) => item.id === data?.id);
                  if (existingItem) {
                    setCart(cart.map((item: any) => (item.id === data?.id ? { ...item, note } : item)));
                  }
                }
                onClose();
              }}
              radius='md'
              size='xs'
            >
              Tiếp tục mua hàng
            </Button>
            <ButtonCheckout
              stylesButtonCheckout={{
                fullWidth: true,
                children: 'Thanh toán ngay',
                radius: 'md',
                size: 'xs',
                disabled: !note ? false : note === noteDebounced ? false : true
              }}
              data={cart}
              finalTotal={data?.price || 0}
              originalTotal={data?.price || 0}
              discountAmount={0}
              onClick={() => onClose()}
            />
          </Group>
        </Stack>
      </Box>
    </Modal>
  );
}
