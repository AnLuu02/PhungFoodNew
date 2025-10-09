import { Badge, Box, Button, Flex, Group, NumberInput, Popover, Stack, Table, Text, Tooltip } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconCheck } from '@tabler/icons-react';
import Image from 'next/image';
import { formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { getImageProduct } from '~/lib/func-handler/getImageProduct';
import { LocalImageType } from '~/lib/zod/EnumType';
import { Note } from './Note';
export const CartTable = ({ updateQuantity }: any) => {
  const [cart, setCart] = useLocalStorage<any>({ key: 'cart', defaultValue: [] });

  return (
    <Table className='mb-6'>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Thông tin</Table.Th>
          <Table.Th w={100}>Đơn giá</Table.Th>
          <Table.Th w={100}>Số lượng</Table.Th>
          <Table.Th w={100}>Giảm giá</Table.Th>
          <Table.Th w={100}>Thành tiền</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {cart.map((item: any) => (
          <Table.Tr key={item.id}>
            <Table.Td className='text-sm'>
              <Group wrap='nowrap'>
                <Box w={80} h={80} className='hidden overflow-hidden rounded-md sm:block' pos={'relative'}>
                  <Image
                    loading='lazy'
                    src={
                      getImageProduct(item?.images || [], LocalImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg'
                    }
                    fill
                    className='object-cover'
                    alt={item.name}
                  />
                </Box>
                <Stack gap='xs' align='start' flex={1}>
                  <Tooltip label={item.name}>
                    <Text size='md' fw={700} lineClamp={1}>
                      {item.name + ' asa sasas asasasa sasasedqw qweeqweqweq ưeqweqwe'}
                    </Text>
                  </Tooltip>
                  <Group>
                    <Button
                      h={'max-content'}
                      className='text-red-500'
                      variant='transparent'
                      w={'max-content'}
                      size='xs'
                      p={0}
                      m={0}
                      onClick={() => setCart(cart.filter((cartItem: any) => cartItem.id !== item.id))}
                    >
                      Xóa
                    </Button>
                    {item?.discount > 0 && (
                      <Badge color='red'>
                        {item?.discount ? `-${formatPriceLocaleVi(item?.discount)} ` : `180.000đ`}
                      </Badge>
                    )}
                  </Group>
                  <Flex justify={'space-between'} w={'100%'} align={'center'}>
                    <Box>
                      {cart.find((cartItem: any) => cartItem.id === item.id && cartItem?.note) && (
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
                      )}
                    </Box>
                    <Popover width={500} offset={0} trapFocus position='bottom' withArrow shadow='md'>
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
              </Group>
            </Table.Td>
            <Table.Td className='text-sm'>
              <Text className='text-red-500' size='md' fw={700}>
                {formatPriceLocaleVi(item.price || 0)}
              </Text>
            </Table.Td>
            <Table.Td className='text-sm'>
              <NumberInput
                thousandSeparator=','
                clampBehavior='strict'
                value={item.quantity}
                onChange={quantity => {
                  if (Number(quantity) === 0) {
                    setCart(cart.filter((cartItem: any) => cartItem.id !== item.id));
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
                {formatPriceLocaleVi(item.discount * item.quantity)}
              </Text>
            </Table.Td>
            <Table.Td className='text-sm'>
              <Text className='text-red-500' size='md' fw={700}>
                {formatPriceLocaleVi((item.price - item.discount) * item.quantity)}
              </Text>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
