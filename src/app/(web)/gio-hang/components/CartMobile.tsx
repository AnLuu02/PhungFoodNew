import { Badge, Box, Button, Flex, Group, NumberInput, Paper, Popover, Stack, Text } from '@mantine/core';
import { IconAlertSquareRounded, IconCheck, IconTrash } from '@tabler/icons-react';
import Image from 'next/image';
import { useCartItems } from '~/components/Hooks/use-cart';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { useCartStorage } from '~/stores/cart.store';
import { Note } from './Note';

export const ShoppingCartMobile = () => {
  const cart = useCartItems();
  const updateCart = useCartStorage(s => s.updateCart);
  const removeCart = useCartStorage(s => s.removeCart);

  return cart.map(item => (
    <Paper shadow='xs' p={'xs'} mb={'xs'} withBorder key={item?.product?.id}>
      <Stack gap={'4'}>
        <Group>
          <Paper
            withBorder
            w={80}
            h={80}
            className='flex items-center justify-center border-mainColor/70'
            pos={'relative'}
          >
            <Paper withBorder w={65} h={65} className='overflow-hidden' pos={'relative'}>
              <Image
                loading='lazy'
                src={item?.product?.thumbnail}
                fill
                className='object-cover'
                alt={item?.product?.name}
              />
            </Paper>
          </Paper>
          <Stack gap='2' align='start'>
            <Text size='md' fw={700}>
              {item?.product?.name}
            </Text>
            <Group m={0} p={0}>
              {item?.product?.discount > 0 && (
                <Text size='sm' c={'dimmed'} fw={700} td='line-through'>
                  {item?.product?.discount ? `${formatPriceLocaleVi(item?.product?.price)}` : `180.000đ`}
                </Text>
              )}
              <Text size='md' fw={700} className='text-mainColor'>
                {item?.product?.price
                  ? `${formatPriceLocaleVi(item?.product?.price - item?.product?.discount)} `
                  : `180.000đ`}
              </Text>
            </Group>
            <Group m={0} p={0}>
              <NumberInput
                thousandSeparator=','
                clampBehavior='strict'
                size='xs'
                value={item?.quantity}
                onChange={quantity => {
                  if (Number(quantity) === 0) {
                    removeCart(item?.product?.id);
                  }
                  updateCart({ productId: item?.product?.id, quantity: Number(quantity) });
                }}
                min={0}
                max={20}
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
                onClick={() => removeCart(item?.product?.id)}
              >
                <IconTrash size={16} />
              </Button>
            </Group>
          </Stack>
        </Group>
        <Flex justify={'space-between'} w={'100%'} align={'center'}>
          <Text className='text-red-500' size='md' fw={700}>
            {formatPriceLocaleVi((item?.product?.price - item?.product?.discount) * item?.quantity)}
          </Text>
          <Box>
            {cart.some(cartItem => cartItem?.product?.id === item?.product?.id && cartItem?.note) ? (
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
              <Note productId={item?.product?.id} />
            </Popover.Dropdown>
          </Popover>
        </Flex>
      </Stack>
    </Paper>
  ));
};
