'use client';
import { Box, Card, Divider, Flex, Group, ScrollAreaAutosize, Stack, Text, Title } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconPercentage30 } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import BButton from '~/components/Button/Button';
import Empty from '~/components/Empty';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { LocalVoucherType } from '~/lib/ZodSchema/enum';
import { CartItem, VoucherForUser } from '~/types/client-type-trpc';
import { ModalRecentOrder } from '../../../../components/Modals/ModalRecentOrder';
import { ApplyVoucher } from './ApplyVoucher';
import { ButtonCheckout } from './ButtonCheckout';
import { CartItemPayment } from './CartItemPayment';

export const RecapCart = ({ quickOrder }: { quickOrder?: boolean }) => {
  const [showRecentOrdersModal, setShowRecentOrdersModal] = useState(false);
  const { data: session } = useSession();
  const [cart] = useLocalStorage<CartItem[]>({ key: 'cart', defaultValue: [] });
  const [appliedVouchers] = useLocalStorage<VoucherForUser>({
    key: 'applied-vouchers',
    defaultValue: []
  });

  const { originalTotal, discount, tax, discountAmountByVoucher, finalTotal } = useMemo(() => {
    const originalTotal = cart.reduce((sum, item) => sum + +(item.price || 0) * item.quantity, 0);
    const discount = cart.reduce((sum, item) => (item.discount ? sum + +(item.discount || 0) * item.quantity : sum), 0);
    const tax = originalTotal * 0.1;
    const discountAmountByVoucher = (appliedVouchers ?? []).reduce((sum, item) => {
      if (!item?.discountValue) return sum;
      const value =
        item.type === LocalVoucherType.FIXED
          ? +(item.discountValue || 0)
          : (+(item.discountValue || 0) * originalTotal) / 100;
      return sum + value;
    }, 0);
    const finalTotal = originalTotal + tax - discount - discountAmountByVoucher;
    return { originalTotal, discount, tax, discountAmountByVoucher, finalTotal };
  }, [cart, appliedVouchers]);

  return (
    <>
      <Card shadow='sm' radius='md' withBorder>
        <Stack gap={'md'}>
          <Flex
            align={{ base: 'flex-start', md: 'center' }}
            justify={'space-between'}
            direction={{ base: 'column-reverse', md: 'row' }}
          >
            <Title order={2} className='font-quicksand text-xl'>
              Đơn hàng ({cart?.length || 0} món)
            </Title>
            {quickOrder && session?.user?.id && (
              <BButton
                leftSection={<IconPercentage30 size={16} />}
                variant='outline'
                className='mb-2 md:mb-0'
                w={{ base: '100%', md: 'max-content' }}
                children='Đơn gần đây'
                onClick={() => setShowRecentOrdersModal(true)}
              />
            )}
          </Flex>
          {cart?.length === 0 ? (
            <Empty size='sm' title='Giỏ hàng trống' hasButton={false} content='' />
          ) : (
            <>
              <ScrollAreaAutosize
                mah={220}
                px='0'
                scrollbarSize={5}
                className='bg-gray-100 dark:bg-dark-card'
                mx={'-16px'}
              >
                <Stack gap={'md'} py={'sm'} px={16}>
                  {cart?.map((item, index) => (
                    <Box className={`animate-fadeUp`} style={{ animationDuration: `${index * 0.05 + 0.5}s` }}>
                      <CartItemPayment key={index} item={item} />
                    </Box>
                  ))}
                </Stack>
              </ScrollAreaAutosize>

              <ApplyVoucher totalOrderPrice={originalTotal} />
            </>
          )}
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
              discountAmount={discountAmountByVoucher + discount}
              data={cart}
              stylesButtonCheckout={{ children: 'Thanh toán', fullWidth: true, size: 'md', radius: 'md' }}
            />
          </Flex>
        </Stack>
      </Card>

      <ModalRecentOrder opened={showRecentOrdersModal} onClose={() => setShowRecentOrdersModal(false)} />
    </>
  );
};
