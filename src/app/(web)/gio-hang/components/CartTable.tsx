import {
  Badge,
  Box,
  Button,
  Flex,
  Group,
  NumberInput,
  Paper,
  Popover,
  Stack,
  Table,
  Text,
  Tooltip
} from '@mantine/core';
import { IconAlertSquareRounded, IconCheck, IconTrash } from '@tabler/icons-react';
import Image from 'next/image';
import { useCartItems } from '~/components/Hooks/use-cart';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { useCartStorage } from '~/stores/cart.store';
import { Note } from './Note';
export const CartTable = () => {
  const cart = useCartItems();
  const updateCart = useCartStorage(s => s.updateCart);
  const removeCart = useCartStorage(s => s.removeCart);
  return (
    <Table className='mb-6'>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Thông tin</Table.Th>
          <Table.Th w={100} className='hidden lg:block'>
            Đơn giá
          </Table.Th>
          <Table.Th w={100}>Số lượng</Table.Th>
          <Table.Th w={100}>Giảm giá</Table.Th>
          <Table.Th w={100}>Thành tiền</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {cart.map((item, index: number) => (
          <Table.Tr
            key={item.product.id}
            className={`animate-fadeUp`}
            style={{ animationDuration: `${index * 0.05 + 0.5}s` }}
          >
            <Table.Td className='text-sm'>
              <Group wrap='nowrap' align='center'>
                <Paper
                  withBorder
                  w={80}
                  h={80}
                  className='hidden items-center justify-center border-mainColor/70 sm:flex'
                  pos={'relative'}
                >
                  <Paper withBorder w={65} h={65} className='overflow-hidden' pos={'relative'}>
                    <Image
                      loading='lazy'
                      src={item.product.thumbnail}
                      fill
                      className='object-cover'
                      alt={item.product.name}
                    />
                  </Paper>
                </Paper>
                <Stack gap='6' align='start' flex={1}>
                  <Tooltip label={item.product.name}>
                    <Text size='md' fw={700} lineClamp={1}>
                      {item.product.name || 'Đang cập nhật'}
                    </Text>
                  </Tooltip>
                  <Group>
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

                    <Text size='md' fw={700} className='text-mainColor lg:hidden'>
                      {item?.product?.price
                        ? `${formatPriceLocaleVi(item?.product?.price - item?.product?.discount)} `
                        : `180.000đ`}
                    </Text>
                    {item?.product?.discount > 0 && (
                      <Badge color='red' size='sm'>
                        Giảm{' '}
                        {item?.product?.discount
                          ? ((item?.product?.discount / item?.product?.price) * 100).toFixed(0) + '%'
                          : '20%'}
                      </Badge>
                    )}
                  </Group>
                  <Flex justify={'space-between'} w={'100%'} align={'center'}>
                    <Box>
                      {cart.some(cartItem => cartItem.product.id === item.product.id && cartItem?.note) ? (
                        <Badge
                          c={'dimmed'}
                          variant='transparent'
                          px={0}
                          mx={0}
                          leftSection={<IconCheck size={12} />}
                          size='sm'
                        >
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
                          Nên ghi chú
                        </Badge>
                      )}
                    </Box>
                    <Popover width={500} offset={0} trapFocus position='bottom' withArrow shadow='md'>
                      <Popover.Target>
                        <Button size='xs' variant='transparent' className='text-mainColor hover:text-subColor'>
                          Ghi chú
                        </Button>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <Note productId={item.product.id} />
                      </Popover.Dropdown>
                    </Popover>
                  </Flex>
                </Stack>
              </Group>
            </Table.Td>
            <Table.Td className='hidden text-sm lg:table-cell'>
              <Text className='text-red-500' size='md' fw={700}>
                {formatPriceLocaleVi(item.product.price || 0)}
              </Text>
            </Table.Td>
            <Table.Td className='text-sm'>
              <NumberInput
                thousandSeparator=','
                clampBehavior='strict'
                value={item.quantity}
                onChange={quantity => {
                  if (Number(quantity) === 0) {
                    removeCart(item.product.id);
                  }
                  updateCart({ productId: item.product.id, quantity: Number(quantity) });
                }}
                min={0}
                max={20}
                className='w-[80px]'
              />
            </Table.Td>
            <Table.Td className='text-sm'>
              <Text className='text-red-500' size='md' fw={700}>
                {formatPriceLocaleVi(item.product.discount * item.quantity)}
              </Text>
            </Table.Td>
            <Table.Td className='text-sm'>
              <Text className='text-red-500' size='md' fw={700}>
                {formatPriceLocaleVi((item.product.price - item.product.discount) * item.quantity)}
              </Text>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
