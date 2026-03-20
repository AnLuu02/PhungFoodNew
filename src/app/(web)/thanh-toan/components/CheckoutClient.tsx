'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  ScrollAreaAutosize,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { VoucherType } from '@prisma/client';
import { IconArrowLeft } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import BButton from '~/components/Button/Button';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { NotifyError } from '~/lib/FuncHandler/toast';
import { baseDeliverySchema, DeliveryInput } from '~/shared/schema/delivery.schema';
import { api } from '~/trpc/react';
import { CartItemPayment } from './CartItemPayment';
import { DeliveryCard } from './DeliveryCard';
import { PaymentForm } from './PaymentForm';
type DeliveryInputWithoutOrderId = Omit<DeliveryInput, 'orderId'>;
type DeliveryCheckout = {
  delivery: DeliveryInputWithoutOrderId;
  paymentId: string;
};

export default function CheckoutClient({ order }: { order: any }) {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const mutationUseVoucher = api.Voucher.useVoucher.useMutation();
  const mutationUpdateOrder = api.Order.upsert.useMutation({
    onSuccess: async () => {
      try {
        const response = await fetch('/api/vnpay/create_payment_url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: order?.finalTotal || 0,
            orderId: order.id
          })
        });
        const { paymentUrl } = await response.json();
        if (paymentUrl) {
          order.vouchers && order.vouchers.length > 0
            ? await mutationUseVoucher.mutateAsync({
                userId: order?.user.id || '',
                voucherIds: order.vouchers.map((v: any) => v.id)
              })
            : null;
          window.location.href = paymentUrl;
        }
      } catch {
        NotifyError('Đã có lỗi không mong muốn!', 'Đã có lỗi xảy ra trong quá trình thanh toán, thử lại sau.');
      }
    },
    onError: e => {
      setLoading(false);
      NotifyError(e.message);
    }
  });
  const { discountAmountByVoucher, discount, originalTotal, tax, finalTotal } = useMemo(() => {
    const discountAmountByVoucher = (order?.vouchers ?? []).reduce((sum: any, item: any) => {
      const value = item.type === VoucherType.FIXED ? item.discountValue : (item.discountValue * originalTotal) / 100;
      return sum + value;
    }, 0);
    const { discount, originalTotal } = order?.orderItems?.reduce(
      (acc: { discount: number; originalTotal: number }, item: any) => {
        acc.discount += (item.discount || item.product?.discount || 0) * (item.quantity || 1);
        acc.originalTotal += (item.price || 0) * (item.quantity || 1);
        return {
          discount: acc.discount,
          originalTotal: acc.originalTotal
        };
      },
      {
        discount: 0,
        originalTotal: 0
      }
    ) || { discount: 0, originalTotal: 0 };

    const pricePaid = originalTotal - discount - discountAmountByVoucher;

    const tax = pricePaid * 0.08;
    const finalTotal = pricePaid + tax;
    return { discountAmountByVoucher, discount, originalTotal, tax, finalTotal };
  }, [order]);

  const { control, setValue, handleSubmit, reset } = useForm<DeliveryCheckout>({
    resolver: zodResolver(
      z.object({
        delivery: baseDeliverySchema.omit({ orderId: true }),
        paymentId: z.string({ required_error: 'Chọn phương thức thanh toán.' }).min(1, 'Chọn phương thức thanh toán.')
      })
    ),
    mode: 'onChange',
    defaultValues: {
      paymentId: undefined,
      delivery: {
        name: '',
        email: '',
        phone: '',
        address: undefined,
        note: ''
      }
    }
  });

  useEffect(() => {
    if (order?.id && order?.delivery) {
      reset({
        paymentId: order?.payment?.id,
        delivery: {
          ...order?.delivery,
          name: order?.delivery?.name || session?.user?.name || '',
          email: order?.delivery?.email || session?.user?.email || '',
          phone: order?.delivery?.phone,
          note: order?.delivery?.note
        }
      });
    }
  }, [order]);

  const onSubmit: SubmitHandler<DeliveryCheckout> = async formData => {
    setLoading(true);
    if (order) {
      await mutationUpdateOrder.mutateAsync({
        ...order,
        paymentId: formData.paymentId,
        delivery: formData.delivery
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)}>
      <Grid>
        <GridCol span={{ base: 12, sm: 6, md: 8, lg: 4 }} className='h-fit'>
          <DeliveryCard control={control} setValue={setValue} name={'delivery'} />
        </GridCol>

        <GridCol span={{ base: 12, sm: 6, md: 8, lg: 4 }} className='sticky top-[80px] h-fit'>
          <PaymentForm control={control} />
        </GridCol>
        <GridCol span={{ base: 12, sm: 6, md: 4, lg: 4 }} className='sticky top-[80px] h-fit'>
          <Card shadow='sm' radius='md' withBorder>
            <Stack gap={'md'}>
              <Title order={2} className='font-quicksand text-xl'>
                Đơn hàng ({order?.orderItems?.length || 0} sản phẩm)
              </Title>
              <ScrollAreaAutosize mah={220} px='0' scrollbarSize={5}>
                <Stack gap={'md'} py={'sm'} className='overflow-x-hidden'>
                  {order?.orderItems?.map((item: any, index: number) => (
                    <CartItemPayment key={index} item={{ ...item.product, note: item.note, quantity: item.quantity }} />
                  ))}
                </Stack>
              </ScrollAreaAutosize>
              <Divider />
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
                    -{formatPriceLocaleVi(discountAmountByVoucher || 0)}
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
                <Button variant='subtle' leftSection={<IconArrowLeft size={16} />} component='a' href='/gio-hang'>
                  Giỏ hàng
                </Button>
                <BButton size='md' type='submit' loading={loading} children={'THANH TOÁN'} />
              </Flex>
            </Stack>
          </Card>
        </GridCol>
      </Grid>
    </form>
  );
}
