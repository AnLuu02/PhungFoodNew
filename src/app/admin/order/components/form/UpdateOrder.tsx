'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Card,
  Grid,
  GridCol,
  Group,
  NumberInput,
  Select,
  Stack,
  Textarea,
  TextInput,
  Title
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { OrderStatus } from '@prisma/client';
import { IconMail, IconPhone } from '@tabler/icons-react';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import useSWR from 'swr';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import fetcher from '~/lib/func-handler/fetcher';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { LocalAddressType, LocalOrderStatus } from '~/lib/zod/EnumType';
import { orderSchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { Order } from '~/types/order';
import OrderItemForm from './OrderItemForm';

export default function UpdateOrder({
  orderId,
  setOpened
}: {
  orderId: string;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const { data, isLoading } = orderId ? api.Order.getOne.useQuery({ s: orderId || '' }) : {};
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm<Order>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      id: '',
      finalTotal: 0,
      discountAmount: 0,
      originalTotal: 0,
      status: LocalOrderStatus.UNPAID,
      userId: '',
      paymentId: '',
      orderItems: [],
      delivery: {
        address: {
          provinceId: '',
          districtId: '',
          wardId: '',
          detail: '',
          postalCode: '',
          fullAddress: '',
          type: LocalAddressType.DELIVERY,
          province: '',
          district: '',
          ward: ''
        },
        name: '',
        phone: '',
        email: ''
      }
    }
  });

  const {
    fields: orderItemFields,
    append: appendOrderItem,
    remove: removeOrderItem
  } = useFieldArray({
    control,
    name: 'orderItems'
  });

  const { data: provinces } = useSWR<any>('https://api.vnappmob.com/api/v2/province/', fetcher);
  const [debouncedProvinceId] = useDebouncedValue(watch('delivery.address.provinceId'), 300);
  const [debouncedDistrictId] = useDebouncedValue(watch('delivery.address.districtId'), 300);

  const { data: districts } = useSWR<any>(
    debouncedProvinceId ? `https://api.vnappmob.com/api/v2/province/district/${debouncedProvinceId}` : null,
    fetcher
  );

  const { data: wards } = useSWR<any>(
    debouncedDistrictId ? `https://api.vnappmob.com/api/v2/province/ward/${debouncedDistrictId}` : null,
    fetcher
  );

  useEffect(() => {
    if (data?.id) {
      reset({
        id: data?.id,
        finalTotal: data?.finalTotal || 0,
        discountAmount: data?.discountAmount || 0,
        originalTotal: data?.originalTotal || 0,
        status: data?.status,
        userId: data?.userId || '',
        paymentId: data?.paymentId || '',
        delivery: data?.delivery as any,
        orderItems: (data as any).orderItems?.map((item: any) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      });
    }
  }, [data, reset]);

  const { data: payments } = api.Payment.getAll.useQuery();
  const { data: users } = api.User.getAll.useQuery();
  const utils = api.useUtils();
  const updateMutation = api.Order.update.useMutation({
    onSuccess: () => {
      utils.Order.invalidate();
    }
  });

  const onSubmit: SubmitHandler<Order> = async formData => {
    try {
      if (!orderId) return;
      const result = await updateMutation.mutateAsync({
        where: { id: formData.id },
        data: {
          ...formData,
          finalTotal: Number(formData.finalTotal) || 0,
          discountAmount: Number(formData.discountAmount) || 0,
          originalTotal: Number(formData.originalTotal) || 0,
          orderItems: {
            deleteMany: {
              id: {
                notIn: formData?.orderItems?.map(item => item?.id)?.filter(Boolean)
              }
            },
            upsert: formData.orderItems.map(item => ({
              where: { id: item.id || '' },
              update: {
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
              },
              create: {
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
              }
            }))
          },
          delivery: {
            update: {
              name: formData.delivery.name,
              email: formData.delivery.email,
              phone: formData.delivery.phone,
              note: formData.delivery.note,
              address: {
                update: {
                  ...formData.delivery.address
                }
              }
            }
          }
        },
        orderId: orderId
      });

      if (result.success) {
        NotifySuccess(result.message);
        setOpened(false);
      } else {
        NotifyError(result.message);
      }
    } catch {
      NotifyError('Đã xây ra ngoại lệ. Vui lòng kiểm tra lai.');
    }
  };

  if (isLoading) return <LoadingSpiner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid>
        <GridCol span={6}>
          <Card shadow='sm' padding='lg' radius='md' withBorder>
            <Title order={2} className='mb-4 font-quicksand text-xl'>
              Thông tin vận chuyển
            </Title>
            <Stack gap='md'>
              <Group grow>
                <Controller
                  name='delivery.email'
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextInput
                      label='Email'
                      placeholder='Email'
                      type='email'
                      leftSection={<IconMail size={18} stroke={1.5} />}
                      {...field}
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  name='delivery.name'
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextInput label='Họ và tên' placeholder='Họ và tên' {...field} error={fieldState.error?.message} />
                  )}
                />
              </Group>

              <Group grow>
                <Controller
                  name='delivery.phone'
                  control={control}
                  defaultValue=''
                  render={({ field, fieldState }) => (
                    <TextInput
                      {...field}
                      label='Số điện thoại'
                      leftSection={<IconPhone size={18} stroke={1.5} />}
                      placeholder='Số điện thoại (tùy chọn)'
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </Group>

              <Grid>
                <GridCol span={4}>
                  <Controller
                    control={control}
                    name={`delivery.address.provinceId`}
                    render={({ field, fieldState }) => (
                      <Select
                        {...field}
                        searchable
                        placeholder='Chọn tỉnh thành'
                        data={provinces?.results?.map((item: any) => ({
                          value: item.province_id,
                          label: item.province_name
                        }))}
                        nothingFoundMessage='Nothing found...'
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                </GridCol>
                <GridCol span={4}>
                  <Controller
                    control={control}
                    name={`delivery.address.districtId`}
                    disabled={!watch('delivery.address.provinceId')}
                    render={({ field }) => (
                      <Select
                        {...field}
                        searchable
                        placeholder='Chọn quận huyện'
                        data={districts?.results?.map((item: any) => ({
                          value: item.district_id,
                          label: item.district_name
                        }))}
                        nothingFoundMessage='Nothing found...'
                        error={errors?.delivery?.address?.districtId?.message}
                      />
                    )}
                  />
                </GridCol>
                <GridCol span={4}>
                  <Controller
                    control={control}
                    name={`delivery.address.wardId`}
                    disabled={!watch('delivery.address.districtId')}
                    render={({ field }) => (
                      <Select
                        {...field}
                        searchable
                        placeholder='Chọn phường xã'
                        data={wards?.results?.map((item: any) => ({
                          value: item.ward_id,
                          label: item.ward_name
                        }))}
                        nothingFoundMessage='Nothing found...'
                        error={errors?.delivery?.address?.wardId?.message}
                      />
                    )}
                  />
                </GridCol>
                <GridCol span={12}>
                  <Controller
                    control={control}
                    name={`delivery.address.detail`}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        label='Địa chỉ'
                        placeholder='Địa chỉ cụ thể (đường, phố, quận, huyện,...)'
                        resize='block'
                        error={errors?.delivery?.address?.detail?.message}
                      />
                    )}
                  />
                </GridCol>
              </Grid>

              <Controller
                name='delivery.note'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <Textarea resize='block' label='Ghi chú' placeholder='Ghi chú (tùy chọn)' {...field} />
                )}
              />
            </Stack>
          </Card>
        </GridCol>
        <GridCol span={6}>
          <Grid gutter='md'>
            <GridCol span={6}>
              <Controller
                name='userId'
                control={control}
                render={({ field }) => (
                  <Select
                    label='Khách hàng'
                    searchable
                    placeholder=' Chọn khách hàng'
                    data={users?.map(user => ({ value: user.id, label: user.name }))}
                    {...field}
                    error={errors.userId?.message}
                  />
                )}
              />
            </GridCol>
            <GridCol span={6}>
              <Controller
                name='paymentId'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label='Phương thức thanh toán'
                    searchable
                    placeholder=' Chọn phương thức thanh toán'
                    data={payments?.map(payment => ({ value: payment.id, label: payment.name }))}
                    error={errors.paymentId?.message}
                  />
                )}
              />
            </GridCol>
            <GridCol span={6}>
              <Controller
                control={control}
                name='finalTotal'
                render={({ field: { onChange, onBlur, value, name } }) => (
                  <NumberInput
                    thousandSeparator=','
                    hideControls
                    clampBehavior='strict'
                    readOnly
                    label='Tổng tiền (chỉ đọc)'
                    placeholder='Sẽ được tính ngay sau khi gọi món.'
                    error={errors.finalTotal?.message}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    name={name}
                  />
                )}
              />
            </GridCol>
            <GridCol span={6}>
              <Controller
                name='status'
                control={control}
                render={({ field }) => (
                  <Select
                    label='Trạng thái (chỉ đọc)'
                    placeholder=' Chọn trạng thái'
                    data={Object.values(OrderStatus)}
                    {...field}
                    error={errors.status?.message}
                    readOnly
                  />
                )}
              />
            </GridCol>

            <Title order={3} mt='lg'>
              Món ăn
            </Title>
            {orderItemFields.map((field, index) => (
              <OrderItemForm
                key={field.id}
                {...field}
                index={index}
                removeOrderItem={removeOrderItem}
                control={control}
                watch={watch}
                setValue={setValue}
                getValues={getValues}
                errors={errors}
              />
            ))}
            <Button
              type='button'
              onClick={() =>
                appendOrderItem({
                  id: '',
                  productId: '',
                  quantity: 1,
                  price: 0,
                  orderId: ''
                })
              }
              variant='outline'
              w={'100%'}
              m={10}
            >
              Thêm món
            </Button>
          </Grid>
        </GridCol>
      </Grid>
      <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth>
        Cập nhật
      </Button>
    </form>
  );
}
