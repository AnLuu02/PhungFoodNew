import { Badge, Box, Group, Paper, Spoiler, Text, Tooltip } from '@mantine/core';
import Image from 'next/image';
import { formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { getImageProduct } from '~/lib/func-handler/getImageProduct';
import { LocalImageType } from '~/lib/zod/EnumType';

export function CartItemPayment({ item }: any) {
  return (
    <>
      <Group key={item.id} wrap='nowrap'>
        <Paper
          withBorder
          w={60}
          h={60}
          className='flex items-center justify-center rounded-lg border-mainColor/70'
          pos={'relative'}
        >
          <Image
            loading='lazy'
            src={getImageProduct(item?.images || [], LocalImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg'}
            width={50}
            height={50}
            className='rounded-md object-cover'
            alt={item.name}
          />
          <Badge className='absolute -right-2 -top-2 bg-mainColor' radius='xl' size='sm'>
            {item.quantity}
          </Badge>
        </Paper>

        <Box className='flex-1'>
          <Tooltip label={item.name}>
            <Text size='sm' fw={700} lineClamp={1}>
              {item.name}
            </Text>
          </Tooltip>
          <Spoiler
            maxHeight={20}
            showLabel='Xem thêm'
            hideLabel='Ẩn'
            classNames={{ control: 'text-xs font-bold text-mainColor' }}
          >
            <Text size='xs' c='dimmed'>
              Ghi chú: {item.note || 'Không có'}
            </Text>
          </Spoiler>
        </Box>
        <Text className='text-right' fw={700}>
          {formatPriceLocaleVi(item.price * item.quantity)}
        </Text>
      </Group>
    </>
  );
}
