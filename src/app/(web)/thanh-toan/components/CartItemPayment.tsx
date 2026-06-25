import { Badge, Box, Button, Group, Paper, Spoiler, Text, Tooltip } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import Image from 'next/image';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { CartItem } from '~/shared/types/store.types';
import { useCartStorage } from '~/stores/cart.store';

export function CartItemPayment({ item, isPayment }: { item: CartItem; isPayment?: boolean }) {
  const removeCart = useCartStorage(s => s.removeCart);

  return (
    <>
      <Group key={item.product.id} wrap='nowrap' align='flex-start'>
        <Paper
          withBorder
          w={60}
          h={60}
          className='flex items-center justify-center border-mainColor/70'
          pos={'relative'}
        >
          <Paper w={45} h={45} className='overflow-hidden' pos={'relative'}>
            <Image loading='lazy' src={item.product.thumbnail} fill className='object-cover' alt={item.product.name} />
          </Paper>
          <Badge className='absolute -right-2 -top-2 bg-mainColor' radius='xl' size='sm'>
            {item.quantity}
          </Badge>
        </Paper>

        <Box className='flex-1'>
          <Tooltip label={item.product.name}>
            <Text size='sm' fw={700} lineClamp={1}>
              {item.product.name}
            </Text>
          </Tooltip>
          <Spoiler
            maxHeight={17}
            showLabel='Xem thêm'
            hideLabel='Ẩn'
            classNames={{ control: 'text-xs font-bold text-mainColor' }}
          >
            <Text size='xs' c='dimmed'>
              Ghi chú: {item.note || 'Không có'}
            </Text>
          </Spoiler>
        </Box>
        <Group align='center' gap={'md'} p={0} m={0}>
          <Text className='text-right' fw={700}>
            {formatPriceLocaleVi(item.product.price * item.quantity)}
          </Text>
          {!isPayment && (
            <Button
              h={'max-content'}
              className='text-red-500 hover:text-subColor'
              variant='transparent'
              w={'max-content'}
              size='xs'
              p={0}
              m={0}
              onClick={() => removeCart(item.product.id)}
            >
              <IconTrash size={20} />
            </Button>
          )}
        </Group>
      </Group>
    </>
  );
}
