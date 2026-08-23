import { Badge, Box, Button, Flex, Group, NumberInput, Paper, Popover, Skeleton, Stack, Text } from '@mantine/core';
import { IconAlertSquareRounded, IconCheck, IconTrash } from '@tabler/icons-react';
import Image from 'next/image';
import { useCartItems } from '~/components/Hooks/use-cart';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { useCartStore } from '~/stores/cart.store';
import { Note } from './Note';

export const ShoppingCartMobile = () => {
  const cart = useCartItems();
  const updateCart = useCartStore(s => s.updateCart);
  const removeCart = useCartStore(s => s.removeCart);

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
                  updateCart({ productId: item?.product?.id, note: item.note, quantity: Number(quantity) });
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

export const ShoppingCartMobileSkeleton = () => {
  return (
    <Stack gap={0}>
      {[
        { name: '82%', price: 90 },
        { name: '65%', price: 85 },
        { name: '90%', price: 95 }
      ].map((item, index) => (
        <Paper key={index} shadow='xs' p='xs' mb='xs' withBorder>
          <Stack gap={4}>
            <Group wrap='nowrap' align='flex-start'>
              <Paper w={80} h={80} className='flex shrink-0 items-center justify-center'>
                <Skeleton w={65} h={65} radius='sm' />
              </Paper>

              <Stack gap={6} align='start' className='min-w-0 flex-1'>
                <Skeleton h={18} w={item.name} radius='sm' />

                <Group gap={6}>
                  <Skeleton h={16} w={70} radius='sm' />
                  <Skeleton h={18} w={item.price} radius='sm' />
                </Group>

                <Group gap={8}>
                  <Skeleton h={30} w={80} radius='sm' />
                  <Skeleton h={18} w={18} radius='sm' />
                </Group>
              </Stack>
            </Group>

            <Flex justify='space-between' align='center' gap={8}>
              <Skeleton h={20} w={95} radius='sm' />

              <Skeleton h={18} w={120} radius='sm' className='ml-auto' />

              <Skeleton h={28} w={55} radius='sm' />
            </Flex>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};
