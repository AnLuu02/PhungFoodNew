'use client';
import { Box, Button, Card, Divider, Flex, Group, ScrollAreaAutosize, Stack, Text, Title } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { VoucherType } from '@prisma/client';
import { IconPercentage30 } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import Empty from '~/components/Empty';
import { caculateAmount } from '~/lib/FuncHandler/calculateLevel';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { VoucherApplyStorage } from '~/shared/types/store.types';
import { ApplyVoucher } from '../app/(web)/thanh-toan/components/ApplyVoucher';
import { ButtonCheckout } from '../app/(web)/thanh-toan/components/ButtonCheckout';
import { CartItemPayment } from '../app/(web)/thanh-toan/components/CartItemPayment';
import { useCartItems } from './Hooks/use-cart';
import { ModalRecentOrder } from './Modals/ModalRecentOrder';
import { RecapCartSkeleton } from './RecapCartSkeleton';

export const RecapCart = ({ quickOrder, limit }: { quickOrder?: boolean; limit?: number }) => {
  const [showRecentOrdersModal, setShowRecentOrdersModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { data: session } = useSession();
  const cart = useCartItems();

  const [appliedVouchers] = useLocalStorage<VoucherApplyStorage[]>({
    key: 'applied-vouchers',
    defaultValue: []
  });

  const { finalAmount, tax, totalDiscountAmount, totalOriginalPrice, totalVoucherAmount, totalProductDiscount } =
    useMemo(() => {
      return caculateAmount({
        products: cart.map(c => ({
          discount: c.product?.discount ?? 0,
          price: c.product?.price ?? 0,
          quantity: c?.quantity ?? 1
        })),
        vouchers: appliedVouchers.map(voucher => ({
          discountValue: voucher?.discountValue ?? 0,
          maxDiscount: voucher?.maxDiscount ?? 0,
          minOrderPrice: voucher?.minOrderPrice ?? 0,
          type: voucher?.type ?? VoucherType.FIXED
        }))
      });
    }, [JSON.stringify(cart), JSON.stringify(appliedVouchers)]);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return <RecapCartSkeleton />;
  return (
    <>
      <Card shadow='sm' withBorder>
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
              <Button
                leftSection={<IconPercentage30 size={16} />}
                variant='outline'
                className='mb-2 md:mb-0'
                w={{ base: '100%', md: 'max-content' }}
                children='Đơn gần đây'
                onClick={() => setShowRecentOrdersModal(true)}
              />
            )}
          </Flex>
          {cart.length === 0 ? (
            <Empty size='sm' title='Giỏ hàng trống' hasButton={false} content='' />
          ) : (
            <>
              <ScrollAreaAutosize
                mah={75 * (limit || 3)}
                px='0'
                scrollbarSize={5}
                className='bg-gray-100 dark:bg-dark-card'
                mx={'-16px'}
              >
                <Stack gap={'md'} py={'sm'} px={16}>
                  {cart.map((item, index: number) => (
                    <Box className={`animate-fadeUp`} style={{ animationDuration: `${index * 0.05 + 0.5}s` }}>
                      <CartItemPayment key={index} item={item} />
                    </Box>
                  ))}
                </Stack>
              </ScrollAreaAutosize>

              <ApplyVoucher totalOrderPrice={totalOriginalPrice} />
            </>
          )}
          <Stack gap='xs'>
            <Group justify='space-between'>
              <Text size='md' fw={700}>
                Tạm tính
              </Text>
              <Text size='md' fw={700}>
                {formatPriceLocaleVi(totalOriginalPrice)}
              </Text>
            </Group>
            <Group justify='space-between'>
              <Text size='md' fw={700}>
                Giảm giá sản phẩm:
              </Text>
              <Text size='md' fw={700}>
                -{formatPriceLocaleVi(totalProductDiscount)}
              </Text>
            </Group>

            <Group justify='space-between'>
              <Text size='md' fw={700}>
                Khuyến mãi:
              </Text>
              <Text size='md' fw={700}>
                -{formatPriceLocaleVi(totalVoucherAmount)}
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
                {formatPriceLocaleVi(finalAmount)}
              </Text>
            </Group>
          </Stack>

          <Flex gap={0} justify='space-between' wrap={'nowrap'}>
            <ButtonCheckout
              finalAmount={finalAmount}
              originalAmount={totalOriginalPrice}
              discountAmount={totalDiscountAmount}
              data={cart.map(item => ({
                productId: item?.product.id || '',
                note: item?.note ?? '',
                price: item?.product.price ?? 0,
                quantity: item?.quantity ?? 0
              }))}
              taxAmount={tax}
              stylesButtonCheckout={{ children: 'Xác nhận', fullWidth: true, size: 'md' }}
            />
          </Flex>
        </Stack>
      </Card>

      {quickOrder && (
        <ModalRecentOrder opened={showRecentOrdersModal} onClose={() => setShowRecentOrdersModal(false)} />
      )}
    </>
  );
};
