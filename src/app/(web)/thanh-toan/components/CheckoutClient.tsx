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
import { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import BButton from '~/components/Button';
import { useDistricts, useProvinces, useWards } from '~/components/Hooks/use-fetch';
import { formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { NotifyError } from '~/lib/func-handler/toast';
import { LocalAddressType, LocalVoucherType } from '~/lib/zod/EnumType';
import { deliverySchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { CartItemPayment } from './CartItemPayment';
import { DeliveryCard } from './DeliveryCard';
import { PaymentForm } from './PaymentForm';
export default function CheckoutClient({ order }: { order: any }) {
  const [loading, setLoading] = useState(false);
  const mutationUseVoucher = api.Voucher.useVoucher.useMutation();
  const mutationUpdateOrder = api.Order.update.useMutation({
    onError: e => {
      setLoading(false);
      NotifyError(e.message);
    }
  });
  const { discountAmountByVoucher, discount, originalTotal, tax, finalTotal } = useMemo(() => {
    const originalTotal = order?.orderItems?.reduce((sum: any, item: any) => sum + item.price * item.quantity, 0);
    const discountAmountByVoucher = (order?.vouchers ?? []).reduce((sum: any, item: any) => {
      const value =
        item.type === LocalVoucherType.FIXED ? item.discountValue : (item.discountValue * originalTotal) / 100;
      return sum + value;
    }, 0);
    const discount = order?.orderItems?.reduce((sum: any, item: any) => {
      if (item.product.discount > 0) {
        return sum + item.product.discount * item.quantity;
      }
      return sum;
    }, 0);

    const tax = originalTotal * 0.1;
    const finalTotal = originalTotal + tax - discount - discountAmountByVoucher;
    return { discountAmountByVoucher, discount, originalTotal, tax, finalTotal };
  }, [order]);

  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<z.infer<typeof deliverySchema> & { paymentId: string }>({
    resolver: zodResolver(
      deliverySchema.extend({
        paymentId: z.string({ required_error: 'Chọn phương thức thanh toán.' }).min(1, 'Chọn phương thức thanh toán.')
      })
    ),
    mode: 'onChange',
    defaultValues: {
      paymentId: undefined,
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
      note: ''
    }
  });

  const { data: provinces, provinceMap } = useProvinces();

  const [debouncedProvinceId] = useDebouncedValue(watch('address.provinceId'), 300);
  const [debouncedDistrictId] = useDebouncedValue(watch('address.districtId'), 300);

  const { data: districts, districtMap } = useDistricts(debouncedProvinceId);
  const { data: wards, wardMap } = useWards(debouncedDistrictId);

  useEffect(() => {
    if (order?.id) {
      reset({
        name: order?.delivery?.name,
        email: order?.delivery?.email,
        phone: order?.delivery?.phone,
        paymentId: order?.payment?.id,
        address: {
          provinceId: order?.delivery?.address?.provinceId,
          districtId: order?.delivery?.address?.districtId,
          wardId: order?.delivery?.address?.wardId,
          province: order?.delivery?.address?.province,
          district: order?.delivery?.address?.district,
          ward: order?.delivery?.address?.ward,
          fullAddress: order?.delivery?.address?.fullAddress,
          postalCode: order?.delivery?.address?.postalCode || '',
          detail: order?.delivery?.address?.detail,
          type: LocalAddressType.DELIVERY
        },
        note: order?.delivery?.note
      });
    }
  }, [order]);

  const onSubmit: SubmitHandler<z.infer<typeof deliverySchema> & { paymentId: string }> = async (
    formData
  ): Promise<void> => {
    setLoading(true);
    if (order) {
      const province = formData?.address?.provinceId && provinceMap?.[formData?.address?.provinceId];
      const district = formData?.address?.districtId && districtMap?.[formData?.address?.districtId];
      const ward = formData?.address?.wardId && wardMap?.[formData?.address?.wardId];
      const fullAddress = `${formData.address?.detail || ''}, ${ward || ''}, ${district || ''}, ${province || ''}`;

      const resp = await mutationUpdateOrder.mutateAsync({
        where: { id: order.id },
        data: {
          paymentId: formData.paymentId,
          delivery: {
            upsert: {
              where: { orderId: order.id },
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
                    province: province || '',
                    district: district || '',
                    ward: ward || '',
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
                    province: province || '',
                    district: district || '',
                    ward: ward || '',
                    fullAddress
                  }
                }
              }
            }
          }
        },
        orderId: order.id
      });

      if (resp.code === 'OK') {
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
          NotifyError('Lỗi!', 'Đã có lỗi xảy ra trong quá trình thanh toán, thử lại sau.');
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
        <GridCol span={{ base: 12, sm: 6, md: 8, lg: 4 }} className='h-fit'>
          <DeliveryCard control={control} watch={watch} provinces={provinces} districts={districts} wards={wards} />
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
                <Stack gap={'md'} py={'sm'} pr={20} className='overflow-x-hidden'>
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
                <BButton
                  radius={'sm'}
                  size='md'
                  type='submit'
                  loading={loading || isSubmitting}
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
