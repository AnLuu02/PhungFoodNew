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
import { useLocalStorage } from '@mantine/hooks';
import { IconAlertSquareRounded, IconCheck, IconTrash } from '@tabler/icons-react';
import Image from 'next/image';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { getImageProduct } from '~/lib/FuncHandler/getImageProduct';
import { LocalImageType } from '~/lib/ZodSchema/enum';
import { CartItem } from '~/types/client-type-trpc';
import { Note } from './Note';
export const CartTable = ({ updateQuantity }: { updateQuantity: (id: string, quantity: number) => void }) => {
  const [cart, setCart] = useLocalStorage<CartItem[]>({ key: 'cart', defaultValue: [] });

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
        {cart.map((item, index) => (
          <Table.Tr key={item.id} className={`animate-fadeUp`} style={{ animationDuration: `${index * 0.05 + 0.5}s` }}>
            <Table.Td className='text-sm'>
              <Group wrap='nowrap' align='center'>
                <Paper
                  withBorder
                  w={80}
                  h={80}
                  className='hidden items-center justify-center overflow-hidden rounded-lg border-mainColor/70 sm:flex'
                  pos={'relative'}
                >
                  <Image
                    loading='lazy'
                    src={
                      getImageProduct(item?.images || [], LocalImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg'
                    }
                    width={60}
                    height={60}
                    className='rounded-md object-cover'
                    alt={item.name}
                  />
                </Paper>
                <Stack gap='6' align='start' flex={1}>
                  <Tooltip label={item.name}>
                    <Text size='md' fw={700} lineClamp={1}>
                      {item.name || 'Đang cập nhật'}
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
                      onClick={() => setCart(cart.filter(cartItem => cartItem.id !== item.id))}
                    >
                      <IconTrash size={20} />
                    </Button>

                    <Text size='md' fw={700} className='text-mainColor lg:hidden'>
                      {item?.price
                        ? `${formatPriceLocaleVi(+(item?.price || 0) - +(item?.discount || 0))} `
                        : `180.000đ`}
                    </Text>
                    {+(item?.discount || 0) > 0 && (
                      <Badge color='red' size='sm'>
                        Giảm{' '}
                        {item?.discount
                          ? ((+(item?.discount || 0) / +(item?.price || 0)) * 100).toFixed(0) + '%'
                          : '20%'}
                      </Badge>
                    )}
                  </Group>
                  <Flex justify={'space-between'} w={'100%'} align={'center'}>
                    <Box>
                      {cart.find(cartItem => cartItem.id === item.id && cartItem?.note) ? (
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
                        <Note productId={item.id} />
                      </Popover.Dropdown>
                    </Popover>
                  </Flex>
                </Stack>
              </Group>
            </Table.Td>
            <Table.Td className='hidden text-sm lg:table-cell'>
              <Text className='text-red-500' size='md' fw={700}>
                {formatPriceLocaleVi(+(item.price || 0) || 0)}
              </Text>
            </Table.Td>
            <Table.Td className='text-sm'>
              <NumberInput
                radius={'md'}
                thousandSeparator=','
                clampBehavior='strict'
                value={+(item.quantity || 0)}
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
            </Table.Td>
            <Table.Td className='text-sm'>
              <Text className='text-red-500' size='md' fw={700}>
                {formatPriceLocaleVi(+(item.discount || 0) * +(item.quantity || 0))}
              </Text>
            </Table.Td>
            <Table.Td className='text-sm'>
              <Text className='text-red-500' size='md' fw={700}>
                {formatPriceLocaleVi((+(item.price || 0) - +(item.discount || 0)) * +(item.quantity || 0))}
              </Text>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
