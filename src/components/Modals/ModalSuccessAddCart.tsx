'use client';

import { Box, Button, Group, Modal, Stack, Text, Textarea } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconCheck, IconX } from '@tabler/icons-react';
import Image from 'next/image';
import { useState } from 'react';
import { ButtonCheckout } from '~/app/(web)/thanh-toan/components/ButtonCheckout';
import { formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { getImageProduct } from '~/lib/func-handler/getImageProduct';
import { LocalImageType } from '~/lib/zod/EnumType';
import { ModalProps } from '~/types/modal';

export default function ModalSuccessAddToCart({ type, opened, onClose, data }: ModalProps<any>) {
  const [cart, setCart] = useLocalStorage<any>({ key: 'cart', defaultValue: [] });
  const [note, setNote] = useState('');
  return (
    <Modal
      opened={opened && type === 'success'}
      onClose={onClose}
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
            <Box className='relative h-16 w-16'>
              <Image
                loading='lazy'
                src={getImageProduct(data?.images || [], LocalImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg'}
                alt={data?.name || 'Hành tây'}
                height={60}
                width={60}
                style={{ objectFit: 'cover' }}
                className='rounded object-cover'
              />
            </Box>
            <Box>
              <Text fw={700}>{data?.name || 'Hành tây'}</Text>
              <Text className='text-mainColor' fw={600}>
                {formatPriceLocaleVi(data?.price || 0)}
              </Text>
            </Box>
          </Group>

          <Text size='sm' c='dimmed'>
            Giỏ hàng của bạn hiện có {cart?.length || 0} sản phẩm
          </Text>
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
              radius='sm'
              size='xs'
            >
              Tiếp tục mua hàng
            </Button>
            <ButtonCheckout
              stylesButtonCheckout={{ fullWidth: true, title: 'Thanh toán ngay', radius: 'sm' }}
              data={[...cart, { ...data, note }]}
              finalTotal={data?.price || 0}
              originalTotal={data?.price || 0}
              discountAmount={0}
              onClick={onClose}
            />
          </Group>
        </Stack>
      </Box>
    </Modal>
  );
}
