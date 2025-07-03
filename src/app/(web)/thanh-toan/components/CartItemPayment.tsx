import { Badge, Box, Group, Text } from '@mantine/core';
import Image from 'next/image';
import { formatPriceLocaleVi } from '~/lib/func-handler/formatPrice';
import { getImageProduct } from '~/lib/func-handler/getImageProduct';
import { LocalImageType } from '~/lib/zod/EnumType';

export default function CartItemPayment({ item }: any) {
  return (
    <>
      <Group key={item.id} wrap='nowrap'>
        <Box pos='relative'>
          <Image
            loading='lazy'
            src={getImageProduct(item?.images || [], LocalImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg'}
            width={60}
            style={{ objectFit: 'cover' }}
            height={60}
            className='rounded-md'
            alt={item.name}
          />
          <Badge className='absolute -right-2 -top-2 bg-blue-500' radius='xl' size='sm'>
            {item.quantity}
          </Badge>
        </Box>
        <div className='flex-1'>
          <Text size='sm' fw={700}>
            {item.name}
          </Text>
          <Text size='xs' c='dimmed'>
            Ghi chú: {item.note || 'Không có'}
          </Text>
        </div>
        <Text className='text-right' fw={700}>
          {formatPriceLocaleVi(item.price * item.quantity)}
        </Text>
      </Group>
    </>
  );
}
