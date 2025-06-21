'use client';

import { Badge, Box, Button, Group, Image, NumberInput, Stack, Table, Text } from '@mantine/core';
import { memo } from 'react';
import { formatPriceLocaleVi } from '~/app/lib/utils/func-handler/formatPrice';
import { getImageProduct } from '~/app/lib/utils/func-handler/getImageProduct';
import { LocalImageType } from '~/app/lib/utils/zod/EnumType';
const CartTable = memo(({ cart, setCart, updateQuantity }: any) => {
  return (
    <Table className='mb-6'>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Thông tin</Table.Th>
          <Table.Th>Đơn giá</Table.Th>
          <Table.Th>Số lượng</Table.Th>
          <Table.Th>Giảm giá</Table.Th>
          <Table.Th>Thành tiền</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {cart.map((item: any) => (
          <Table.Tr key={item.id}>
            <Table.Td>
              <Group wrap='nowrap'>
                <Box w={80} h={80} className='hidden md:block'>
                  <Image
                    loading='lazy'
                    src={
                      getImageProduct(item?.images || [], LocalImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg'
                    }
                    w={80}
                    h={80}
                    radius='md'
                    alt={item.name}
                  />
                </Box>
                <Stack gap='xs' align='start'>
                  <Text size='md' fw={700}>
                    {item.name}
                  </Text>
                  <Group>
                    <Button
                      h={'max-content'}
                      c={'red'}
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
                </Stack>
              </Group>
            </Table.Td>
            <Table.Td>
              <Text className='text-red-500' size='md' fw={700}>
                {item.price.toLocaleString()}₫
              </Text>
            </Table.Td>
            <Table.Td>
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
                style={{ width: '80px' }}
              />
            </Table.Td>
            <Table.Td>
              <Text className='text-red-500' size='md' fw={700}>
                {formatPriceLocaleVi(item.discount * item.quantity)}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text className='text-red-500' size='md' fw={700}>
                {formatPriceLocaleVi((item.price - item.discount) * item.quantity)}
              </Text>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
});

export default CartTable;
