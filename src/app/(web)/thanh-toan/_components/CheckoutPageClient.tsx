'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  Image,
  Paper,
  Radio,
  ScrollAreaAutosize,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { PaymentType } from '@prisma/client';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import BButton from '~/app/_components/Button';
import CheckoutStripe from '~/app/_components/StripePayment';
import { formatPriceLocaleVi } from '~/app/lib/utils/format/formatPrice';
import { NotifyError } from '~/app/lib/utils/func-handler/toast';
import { api } from '~/trpc/react';
import Empty from '../../../_components/Empty';
import CartItemPayment from '../_components/CartItemPayment';
import DeliveryCard from '../_components/DeliveryCard';

export default function CheckoutPageClient({ orderData, paymentData }: any) {
  const order: any = orderData ?? {};
  const payment: any = paymentData ?? [];
  const [paymentMethod, setPaymentMethod] = useState<any>('');

  const discount = order?.orderItems?.reduce((sum: any, item: any) => {
    if (item.discount) {
      return sum + item.discount * item.quantity;
    }
    return sum;
  }, 0);
  const subtotal = order?.orderItems?.reduce((total: any, item: any) => total + item.price * item.quantity, 0);
  const tax = (subtotal - discount) * 0.1;
  const total = subtotal + tax - discount;
  const { control, handleSubmit, setValue } = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string().min(1, 'Email là bắt buộc'),
        name: z.string().min(1, ' Tên là bắt buộc'),
        address: z.string().min(1, 'Địa chỉ là bắt buộc'),
        note: z.string().optional(),
        phone: z.string().min(1, 'Số điện thoại là bắt buộc'),
        province: z.string().min(1, 'Phải chọn phương thức thanh toán.'),
        orderId: z.string(),
        paymentId: z.string().min(1, 'Phải chọn phương thức thanh toán.')
      })
    ),
    mode: 'onChange',
    defaultValues: {
      paymentId: '',
      orderId: order.id,
      email: order?.user?.email,
      name: order?.user?.name,
      address: order?.user?.address,
      note: '',
      phone: order?.user?.phone,
      province: order?.user?.address
    }
  });

  useEffect(() => {
    if (order) {
      setValue('orderId', order.id);
    }
  }, [order]);

  const [loading, setLoading] = useState(false);

  const mutationOrder = api.Order.update.useMutation();
  const mutationDelivery = api.Delivery.create.useMutation();
  const onSubmit: SubmitHandler<{
    email?: string;
    name?: string;
    address?: string;
    note?: string;
    phone?: string;
    province?: string;
    orderId?: string;
    paymentId: string;
  }> = async (formData): Promise<void> => {
    setLoading(true);
    if (order) {
      const delivery = await mutationDelivery.mutateAsync({
        name: formData.name || order?.user?.name,
        email: formData.email,
        phone: formData.phone,
        userId: order?.user?.id,
        orderId: order?.id,
        province: formData.province,
        address: formData.address,
        note: formData.note
      });
      const resp: any = await mutationOrder.mutateAsync({
        where: { id: order?.id },
        data: {
          paymentId: formData.paymentId,
          deliveryId: delivery.record.id
        }
      });

      if (resp.success) {
        if (paymentMethod === PaymentType.E_WALLET) {
          try {
            const response = await fetch('/api/vnpay/create_payment_url', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                amount: order.total,
                orderId: order.id
              })
            });
            const { paymentUrl } = await response.json();

            if (paymentUrl) {
              window.location.href = paymentUrl;
            }
          } catch (error) {
            console.error('Lỗi:', error);
          } finally {
            setLoading(false);
          }
        }
      } else {
        NotifyError('Lỗi!', 'Đã có lỗi xảy ra trong quá trình thanh toán, thử lại sau.');
      }
    }
  };

  if (order.status === 'COMPLETED') {
    return <Empty title={'Đơn hàng đã hoàn thành.'} />;
  }

  if (!order?.id) {
    return (
      <Empty
        noLogo={true}
        title={'Đơn hàng không tồn tại'}
        content='Đơn hàng không tồn tại hoặc đã bị xóa. Vui lòng tạo đơn hàng mới.'
        url='/thuc-don'
      />
    );
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid>
        <GridCol span={{ base: 12, sm: 6, md: 8, lg: 8 }}>
          <Grid gutter='md'>
            <GridCol span={12}>
              <Link href={'/'}>
                <Center>
                  <Image loading='lazy' src='/logo/logo_phungfood_1.png' alt='logo' w={250} h={80} p={0} />
                </Center>
              </Link>
            </GridCol>
            <GridCol span={{ base: 12, sm: 12, md: 6 }}>
              <DeliveryCard control={control} />
            </GridCol>

            <GridCol span={{ base: 12, sm: 12, md: 6 }}>
              <Card shadow='sm' padding='lg' radius='md' withBorder>
                <Title order={3} className='mb-4 font-quicksand'>
                  Phương Thức Thanh Toán
                </Title>
                <ScrollAreaAutosize mah={480} px='0' scrollbarSize={5}>
                  <Controller
                    control={control}
                    name='paymentId'
                    render={({ field, fieldState }) => (
                      <Radio.Group
                        value={field.value}
                        onChange={value => {
                          field.onChange(value);
                          setPaymentMethod(value);
                        }}
                        name='paymentId'
                        className='mb-4'
                        error={fieldState.error?.message}
                      >
                        <Stack>
                          {Object.values(PaymentType)?.map((item: any) => (
                            <Radio
                              error={fieldState.error?.message}
                              key={item}
                              value={item}
                              label={item === PaymentType.CREDIT_CARD ? 'Thanh toán thẻ' : 'Ví điện tử'}
                            />
                          ))}
                        </Stack>
                      </Radio.Group>
                    )}
                  />

                  {paymentMethod === PaymentType.CREDIT_CARD && (
                    <Paper withBorder p='md' radius='md'>
                      <CheckoutStripe />
                    </Paper>
                  )}

                  {paymentMethod === PaymentType.E_WALLET && (
                    <Paper withBorder p='md' radius='md'>
                      <Text size='md' fw={700}>
                        Vui lòng chọn ví điện tử của bạn:
                      </Text>
                      <Controller
                        control={control}
                        name='paymentId'
                        render={({ field, fieldState }) => (
                          <Radio.Group
                            mt='sm'
                            value={field.value}
                            onChange={value => {
                              field.onChange(value);
                            }}
                            name='paymentId'
                            className='mb-4'
                            error={fieldState.error?.message}
                          >
                            <Group mt='sm'>
                              {payment?.map(
                                (item: any, index: number) =>
                                  item.type === PaymentType.E_WALLET && (
                                    <Radio key={index} value={item.id} label={item.name} />
                                  )
                              )}
                            </Group>
                          </Radio.Group>
                        )}
                      />
                    </Paper>
                  )}
                </ScrollAreaAutosize>
              </Card>
            </GridCol>
          </Grid>
        </GridCol>
        <GridCol span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
          <Card shadow='sm' radius='md' withBorder>
            <Stack gap={'md'}>
              <Title order={2} className='font-quicksand text-xl'>
                Đơn hàng ({order?.orderItems?.length || 0} sản phẩm)
              </Title>
              <ScrollAreaAutosize mah={220} px='0' scrollbarSize={5}>
                <Stack gap={'md'} py={'sm'} pr={20}>
                  {order?.orderItems?.map((item: any, index: number) => (
                    <CartItemPayment key={index} item={{ ...item.product, quantity: item.quantity }} index={index} />
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
                    {subtotal.toLocaleString()}₫
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
                    -{formatPriceLocaleVi(0)}
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
                  <Text size='xl' fw={700} c={'red'}>
                    {formatPriceLocaleVi(total)}
                  </Text>
                </Group>
              </Stack>

              <Flex gap={0} justify='space-between' wrap={'nowrap'}>
                <Button variant='subtle' leftSection={<IconArrowLeft size={16} />} component='a' href='/gio-hang'>
                  Giỏ hàng
                </Button>

                <BButton
                  radius={'sm'}
                  size='md'
                  type='submit'
                  loading={loading}
                  disabled={paymentMethod === PaymentType.CREDIT_CARD}
                  title={' THANH TOÁN'}
                />
              </Flex>
            </Stack>
          </Card>
        </GridCol>
      </Grid>
    </form>
  );
}
