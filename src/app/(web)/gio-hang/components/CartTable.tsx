import { Badge, Box, Button, Group, NumberInput, Stack, Table, Text } from '@mantine/core';
import Image from 'next/image';
import { formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { getImageProduct } from '~/lib/func-handler/getImageProduct';
import { LocalImageType } from '~/lib/zod/EnumType';
const CartTable = ({ cart, setCart, updateQuantity }: any) => {
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
                <Stack gap='xs' align='start'>
                  <Text size='md' fw={700}>
                    {item.name}
                  </Text>
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

export default CartTable;
