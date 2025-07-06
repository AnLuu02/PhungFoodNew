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
import { useDebouncedValue } from '@mantine/hooks';
import { IconArrowLeft } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import useSWR from 'swr';
import { z } from 'zod';
import BButton from '~/components/Button';
import fetcher from '~/lib/func-handler/fetcher';
import { formatPriceLocaleVi } from '~/lib/func-handler/formatPrice';
import { NotifyError } from '~/lib/func-handler/toast';
import { LocalAddressType } from '~/lib/zod/EnumType';
import { deliverySchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import CartItemPayment from './CartItemPayment';
import DeliveryCard from './DeliveryCard';
import PaymentForm from './PaymentForm';
export default function CheckoutClient({ order, orderId }: any) {
  const [loading, setLoading] = useState(false);
  const updateMutationOrder = api.Order.update.useMutation();
  const { discount, subtotal, tax, total } = useMemo(() => {
    const discount = order?.orderItems?.reduce((sum: any, item: any) => {
      if (item.product.discount > 0) {
        return sum + item.product.discount * item.quantity;
      }
      return sum;
    }, 0);

    const subtotal = order?.orderItems?.reduce((total: any, item: any) => total + item.price * item.quantity, 0);
    const tax = (subtotal - discount) * 0.1;
    const total = subtotal + tax - discount;
    return {
      discount,
      subtotal,
      tax,
      total
    };
  }, [order]);

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof deliverySchema> & { paymentId: string }>({
    resolver: zodResolver(
      deliverySchema.extend({
        paymentId: z.string().min(1, 'Chọn phương thức thanh toán.')
      })
    ),
    mode: 'onChange',
    defaultValues: {
      paymentId: 'vnpay',
      name: '',
      email: '',
      phone: '',
      address: {
        provinceId: '',
        districtId: '',
        wardId: '',
        province: '',
        district: '',
        ward: '',
        fullAddress: '',
        postalCode: '',
        detail: '',
        type: LocalAddressType.DELIVERY
      },
      note: '',
      orderId: ''
    }
  });
  const { data: provinces } = useSWR<any>('https://api.vnappmob.com/api/v2/province/', fetcher);
  const [debouncedProvinceId] = useDebouncedValue(watch('address.provinceId'), 300);
  const [debouncedDistrictId] = useDebouncedValue(watch('address.districtId'), 300);

  const { data: districts } = useSWR<any>(
    debouncedProvinceId ? `https://api.vnappmob.com/api/v2/province/district/${debouncedProvinceId}` : null,
    fetcher
  );

  const { data: wards } = useSWR<any>(
    debouncedDistrictId ? `https://api.vnappmob.com/api/v2/province/ward/${debouncedDistrictId}` : null,
    fetcher
  );

  const onSubmit: SubmitHandler<z.infer<typeof deliverySchema> & { paymentId: string }> = async (
    formData
  ): Promise<void> => {
    setLoading(true);
    if (order) {
      const province = provinces?.results?.find((item: any) => item.province_id === formData?.address?.provinceId);
      const district = districts?.results?.find((item: any) => item.district_id === formData?.address?.districtId);
      const ward = wards?.results?.find((item: any) => item.ward_id === formData?.address?.wardId);
      const fullAddress = `${formData.address?.detail || ''}, ${ward?.ward_name || ''}, ${district?.district_name || ''}, ${province?.province_name || ''}`;

      const resp: any = await updateMutationOrder.mutateAsync({
        where: { id: orderId },
        data: {
          paymentId: formData.paymentId,
          delivery: {
            upsert: {
              where: { orderId: orderId },
              update: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                note: formData.note,
                address: {
                  update: {
                    ...formData.address,
                    detail: formData.address?.detail || '',
                    provinceId: formData.address?.provinceId || '',
                    districtId: formData.address?.districtId || '',
                    wardId: formData.address?.wardId || '',
                    province: province?.province_name || '',
                    district: district?.district_name || '',
                    ward: ward?.ward_name || '',
                    fullAddress
                  }
                }
              },
              create: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                note: formData.note,
                address: {
                  create: {
                    ...formData.address,
                    detail: formData.address?.detail || '',
                    provinceId: formData.address?.provinceId || '',
                    districtId: formData.address?.districtId || '',
                    wardId: formData.address?.wardId || '',
                    province: province?.province_name || '',
                    district: district?.district_name || '',
                    ward: ward?.ward_name || '',
                    fullAddress
                  }
                }
              }
            }
          }
        }
      });

      if (resp.success) {
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
      } else {
        NotifyError('Lỗi!', 'Đã có lỗi xảy ra trong quá trình thanh toán, thử lại sau.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)}>
      <Grid>
        <GridCol span={{ base: 12, sm: 6, md: 8, lg: 8 }}>
          <Grid gutter='md'>
            <GridCol span={{ base: 12, sm: 12, md: 6 }}>
              <DeliveryCard
                control={control}
                watch={watch}
                errors={errors}
                provinces={provinces}
                districts={districts}
                wards={wards}
              />
            </GridCol>
            <GridCol span={{ base: 12, sm: 12, md: 6 }}>
              <PaymentForm control={control} />
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
                    <CartItemPayment key={index} item={{ ...item.product, quantity: item.quantity }} />
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
                    {formatPriceLocaleVi(subtotal)}
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
                  <Text size='xl' fw={700} className='text-red-500'>
                    {formatPriceLocaleVi(total)}
                  </Text>
                </Group>
              </Stack>

              <Flex gap={0} justify='space-between' wrap={'nowrap'}>
                <Button variant='subtle' leftSection={<IconArrowLeft size={16} />} component='a' href='/gio-hang'>
                  Giỏ hàng
                </Button>
                <BButton radius={'sm'} size='md' type='submit' loading={loading} title={' THANH TOÁN'} />
              </Flex>
            </Stack>
          </Card>
        </GridCol>
      </Grid>
    </form>
  );
}
