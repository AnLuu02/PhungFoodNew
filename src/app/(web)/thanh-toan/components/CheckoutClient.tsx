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
import { ImageType } from '@prisma/client';
import { IconArrowLeft } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { caculateAmount } from '~/lib/FuncHandler/calculateLevel';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { getImageProduct } from '~/lib/FuncHandler/getImageProduct';
import { NotifyError } from '~/lib/FuncHandler/toast';
import { baseDeliverySchema, DeliveryCheckout } from '~/shared/schema/delivery.schema';
import { TGetOneOrder } from '~/shared/type-trpc/order.type-trpc';
import { api } from '~/trpc/react';
import { CartItemPayment } from './CartItemPayment';
import { DeliveryCard } from './DeliveryCard';
import { PaymentForm } from './PaymentForm';

const handlePayWithVnpay = async (orderId: string) => {
  const res = await fetch('/api/vnpay/create-payment-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      orderId,
      locale: 'vn'
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Không thể tạo thanh toán');
  }

  window.location.href = data.paymentUrl;
};

export default function CheckoutClient({ order }: { order: NonNullable<TGetOneOrder> }) {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const mutationUpdateOrder = api.Order.upsert.useMutation({
    onSuccess: async () => {
      try {
        handlePayWithVnpay(order.id);
      } catch {
        NotifyError('Đã có lỗi không mong muốn!', 'Đã có lỗi xảy ra trong quá trình thanh toán, thử lại sau.');
      }
    },
    onError: e => {
      setLoading(false);
      NotifyError(e.message);
    }
  });

  const { finalAmount, tax, totalOriginalPrice, totalVoucherAmount, totalProductDiscount } = useMemo(() => {
    return caculateAmount({
      products: (order?.orderItems ?? [])?.map(c => ({
        discount: c.product?.discount ?? 0,
        price: c.product?.price ?? 0,
        quantity: c?.quantity ?? 1
      })),
      vouchers: (order?.voucherUsages ?? []).flatMap(
        (item: NonNullable<NonNullable<TGetOneOrder>['voucherUsages']>[number]) => {
          return item?.discount ? [item?.discount] : [];
        }
      )
    });
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
          phone: order?.delivery?.phone ?? undefined,
          note: order?.delivery?.note ?? undefined
        } as any
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
      } as any);
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
          <Card shadow='sm' withBorder>
            <Stack gap={'md'}>
              <Title order={2} className='font-quicksand text-xl'>
                Đơn hàng ({order?.orderItems?.length || 0} sản phẩm)
              </Title>
              <ScrollAreaAutosize mah={220} px='0' scrollbarSize={5}>
                <Stack gap={'md'} py={'sm'} className='overflow-x-hidden'>
                  {order?.orderItems?.map(
                    (item: NonNullable<NonNullable<TGetOneOrder>['orderItems']>[number], index: number) => (
                      <CartItemPayment
                        key={index}
                        isPayment={true}
                        item={{
                          product: {
                            id: item?.product?.id,
                            name: item?.product?.name,
                            price: item?.product?.price,
                            discount: item?.product?.discount,
                            thumbnail: getImageProduct(item?.product?.imageForEntities ?? [], ImageType.THUMBNAIL)
                          },
                          note: item?.note ?? undefined,
                          quantity: item.quantity
                        }}
                      />
                    )
                  )}
                </Stack>
              </ScrollAreaAutosize>
              <Divider />
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
                    -{formatPriceLocaleVi(totalVoucherAmount || 0)}
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
                <Button variant='subtle' leftSection={<IconArrowLeft size={16} />} component={Link} href='/gio-hang'>
                  Giỏ hàng
                </Button>
                <Button size='md' type='submit' loading={loading} children={'THANH TOÁN'} />
              </Flex>
            </Stack>
          </Card>
        </GridCol>
      </Grid>
    </form>
  );
}
