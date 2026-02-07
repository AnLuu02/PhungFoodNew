import { Badge, Box, Button, Group, Paper, Spoiler, Text, Tooltip } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconTrash } from '@tabler/icons-react';
import Image from 'next/image';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { getImageProduct } from '~/lib/FuncHandler/getImageProduct';
import { LocalImageType } from '~/lib/ZodSchema/enum';
import { CartItem } from '~/types/client-type-trpc';

export function CartItemPayment({ item }: any) {
  const [cart, setCart] = useLocalStorage<CartItem[]>({ key: 'cart', defaultValue: [] });
  return (
    <>
      <Group key={item.id} wrap='nowrap' align='flex-start'>
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
            {formatPriceLocaleVi(item.price * item.quantity)}
          </Text>
          <Button
            h={'max-content'}
            className='text-red-500 hover:text-subColor'
            variant='transparent'
            w={'max-content'}
            size='xs'
            p={0}
            m={0}
            onClick={() => setCart(cart.filter((cartItem: any) => cartItem.id !== item.id))}
          >
            <IconTrash size={20} />
          </Button>
        </Group>
      </Group>
    </>
  );
}
