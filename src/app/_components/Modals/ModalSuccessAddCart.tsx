'use client';

import { Button, Group, Image, Modal, Stack, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { ImageType } from '@prisma/client';
import { IconCheck, IconX } from '@tabler/icons-react';
import { ButtonCheckout } from '~/app/(web)/thanh-toan/_components/ButtonCheckout';
import { formatPriceLocaleVi } from '~/app/lib/utils/format/formatPrice';
import { getImageProduct } from '~/app/lib/utils/func-handler/getImageProduct';

interface SuccessModalProps {
  type: any;
  opened: boolean;
  onClose: () => void;
  product: any;
}

export default function ModalSuccessAddToCart({ type, opened, onClose, product }: SuccessModalProps) {
  const [cart, setCart] = useLocalStorage<any>({ key: 'cart', defaultValue: [] });
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
      <div className='relative'>
        {/* Success Header */}
        <div className='flex items-center gap-2 bg-emerald-600 p-2 text-white'>
          <IconCheck size={24} />
          <Text size='md' fw={700}>
            Mua hàng thành công
          </Text>

          <IconX
            onClick={onClose}
            size={20}
            className='absolute right-4 top-3 cursor-pointer text-white hover:opacity-50'
          />
        </div>

        {/* Content */}
        <Stack p='md' gap='md'>
          <Group>
            <div className='relative h-16 w-16'>
              <Image
                src={getImageProduct(product?.images || [], ImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg'}
                alt={product?.name || 'Hành tây'}
                fit='contain'
                h={60}
                className='rounded object-cover'
              />
            </div>
            <div>
              <Text>{product?.name || 'Hành tây'}</Text>
              <Text c='green' fw={600}>
                {formatPriceLocaleVi(product?.price || 0)}
              </Text>
            </div>
          </Group>

          <Text size='sm' c='dimmed'>
            Giỏ hàng của bạn hiện có {cart?.length || 0} sản phẩm
          </Text>

          {/* Actions */}
          <Group grow>
            <Button variant='filled' color='dark' onClick={onClose} radius='sm' size='xs'>
              Tiếp tục mua hàng
            </Button>
            <ButtonCheckout
              stylesButtonCheckout={{ fullWidth: true, title: 'Thanh toán ngay', radius: 'sm' }}
              data={cart}
              total={product?.price || 0}
              onClick={onClose}
            />
          </Group>
        </Stack>
      </div>
    </Modal>
  );
}
