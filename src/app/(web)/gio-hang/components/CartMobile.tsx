import { Badge, Box, Button, Flex, Group, NumberInput, Paper, Popover, Stack, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconAlertSquareRounded, IconCheck, IconTrash } from '@tabler/icons-react';
import Image from 'next/image';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { getImageProduct } from '~/lib/FuncHandler/getImageProduct';
import { LocalImageType } from '~/lib/ZodSchema/enum';
import { CartItem } from '~/types/client-type-trpc';
import { Note } from './Note';

export const ShoppingCartMobile = () => {
  const [cart, setCart] = useLocalStorage<CartItem[]>({ key: 'cart', defaultValue: [] });
  const updateQuantity = (id: string, quantity: number) => {
    setCart(items => items.map(item => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item)));
  };
  return cart.map(item => (
    <Paper shadow='xs' radius='md' p={'xs'} mb={'xs'} withBorder key={item.id}>
      <Stack gap={'4'}>
        <Group>
          <Paper
            withBorder
            w={80}
            h={80}
            className='flex items-center justify-center overflow-hidden rounded-lg border-mainColor/70'
            pos={'relative'}
          >
            <Image
              loading='lazy'
              src={getImageProduct(item?.images || [], LocalImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg'}
              width={60}
              height={60}
              className='rounded-md object-cover'
              alt={item.name}
            />
          </Paper>
          <Stack gap='2' align='start'>
            <Text size='md' fw={700}>
              {item.name}
            </Text>
            <Group m={0} p={0}>
              {+(item?.discount || 0) > 0 && (
                <Text size='sm' c={'dimmed'} fw={700} td='line-through'>
                  {item?.discount ? `${formatPriceLocaleVi(+(item?.price || 0))}` : `180.000đ`}
                </Text>
              )}
              <Text size='md' fw={700} className='text-mainColor'>
                {item?.price ? `${formatPriceLocaleVi(+(item?.price || 0) - +(item?.discount || 0))} ` : `180.000đ`}
              </Text>
            </Group>
            <Group m={0} p={0}>
              <NumberInput
                radius={'md'}
                thousandSeparator=','
                clampBehavior='strict'
                size='xs'
                value={item.quantity}
                onChange={quantity => {
                  if (Number(quantity) === 0) {
                    setCart(cart.filter(cartItem => cartItem.id !== item.id));
                  }
                  updateQuantity(item.id, Number(quantity));
                }}
                min={0}
                max={Number(item?.availableQuantity) || 100}
                className='w-[80px]'
              />
              <Button
                h={'max-content'}
                className='text-red-500'
                variant='transparent'
                w={'max-content'}
                size='xs'
                p={0}
                m={0}
                onClick={() => setCart(cart.filter(cartItem => cartItem.id !== item.id))}
              >
                <IconTrash size={16} />
              </Button>
            </Group>
          </Stack>
        </Group>
        <Flex justify={'space-between'} w={'100%'} align={'center'}>
          <Text className='text-red-500' size='md' fw={700}>
            {formatPriceLocaleVi((+(item.price || 0) - +(item.discount || 0)) * item.quantity)}
          </Text>
          <Box>
            {cart.find(cartItem => cartItem.id === item.id && cartItem?.note) ? (
              <Badge c={'dimmed'} variant='transparent' px={0} mx={0} leftSection={<IconCheck size={12} />} size='sm'>
                Đã thêm ghi chú
              </Badge>
            ) : (
              <Badge
                c={'dimmed'}
                variant='transparent'
                px={0}
                mx={0}
                leftSection={<IconAlertSquareRounded size={12} />}
                size='sm'
              >
                Khuyến khích nên ghi chú
              </Badge>
            )}
          </Box>
          <Popover width={350} offset={0} trapFocus position='bottom' withArrow shadow='md'>
            <Popover.Target>
              <Button size='xs' variant='transparent'>
                Ghi chú
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Note productId={item.id} />
            </Popover.Dropdown>
          </Popover>
        </Flex>
      </Stack>
    </Paper>
  ));
};
