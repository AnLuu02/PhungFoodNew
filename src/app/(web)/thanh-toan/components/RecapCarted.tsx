import { Card, Divider, Flex, Group, ScrollAreaAutosize, Stack, Text, Title } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useMemo } from 'react';
import { formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { LocalVoucherType } from '~/lib/zod/EnumType';
import { ApplyVoucher } from './ApplyVoucher';
import { ButtonCheckout } from './ButtonCheckout';
import { CartItemPayment } from './CartItemPayment';

export const RecapCart = ({ order, loading }: any) => {
  const [cart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const [appliedVouchers] = useLocalStorage<any[]>({
    key: 'applied-vouchers',
    defaultValue: []
  });

  const { originalTotal, discount, tax, discountAmountByVoucher, finalTotal } = useMemo(() => {
    const originalTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = cart.reduce((sum, item) => (item.discount ? sum + item.discount * item.quantity : sum), 0);
    const tax = originalTotal * 0.1;
    const discountAmountByVoucher = (appliedVouchers ?? []).reduce((sum, item) => {
      if (!item?.discountValue) return sum;
      const value =
        item.type === LocalVoucherType.FIXED ? item.discountValue : (item.discountValue * originalTotal) / 100;
      return sum + value;
    }, 0);
    const finalTotal = originalTotal + tax - discount - discountAmountByVoucher;
    return { originalTotal, discount, tax, discountAmountByVoucher, finalTotal };
  }, [cart, appliedVouchers]);

  return (
    <Card shadow='sm' radius='md' withBorder>
      <Stack gap={'md'}>
        <Title order={2} className='font-quicksand text-xl'>
          Đơn hàng ({order?.orderItems?.length || order?.length || 0} sản phẩm)
        </Title>

        <ScrollAreaAutosize mah={220} px='0' scrollbarSize={5}>
          <Stack gap={'md'} py={'sm'} pr={20}>
            {order.map((item: any, index: number) => (
              <CartItemPayment key={index} item={item} />
            ))}
          </Stack>
        </ScrollAreaAutosize>

        <ApplyVoucher totalOrderPrice={originalTotal} />
        <Stack gap='xs'>
          <Group justify='space-between'>
            <Text size='md' fw={700}>
              Tạm tính
            </Text>
            <Text size='md' fw={700}>
              {formatPriceLocaleVi(originalTotal)}
            </Text>
          </Group>
          <Group justify='space-between'>
            <Text size='md' fw={700}>
              Giảm giá sản phẩm:
            </Text>
            <Text size='md' fw={700}>
              -{formatPriceLocaleVi(discount)}
            </Text>
          </Group>

          <Group justify='space-between'>
            <Text size='md' fw={700}>
              Khuyến mãi:
            </Text>
            <Text size='md' fw={700}>
              -{formatPriceLocaleVi(discountAmountByVoucher)}
            </Text>
          </Group>
          <Group justify='space-between' className='mb-2'>
            <Text size='md' fw={700}>
              Thuế (10%):
            </Text>
            <Text size='md' fw={700}>
              {formatPriceLocaleVi(tax)}
            </Text>
          </Group>
          <Divider />

          <Group justify='space-between'>
            <Text size='md' fw={700}>
              Tổng cộng
            </Text>
            <Text size='xl' fw={700} className='text-red-500'>
              {formatPriceLocaleVi(finalTotal)}
            </Text>
          </Group>
        </Stack>

        <Flex gap={0} justify='space-between' wrap={'nowrap'}>
          <ButtonCheckout
            finalTotal={finalTotal}
            originalTotal={originalTotal}
            discountAmount={discountAmountByVoucher}
            data={cart}
            stylesButtonCheckout={{ title: 'Thanh toán', fullWidth: true, size: 'md', radius: 'sm' }}
          />
        </Flex>
      </Stack>
    </Card>
  );
};
