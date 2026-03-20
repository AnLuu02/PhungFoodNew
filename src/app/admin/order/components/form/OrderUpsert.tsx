'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
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
import { AddressType, OrderStatus } from '@prisma/client';
import { IconInfoCircle, IconMail, IconPhone } from '@tabler/icons-react';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Controller, FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import AddressSection from '~/components/AdressSection';
import BButton from '~/components/Button/Button';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import { getStatusInfo } from '~/lib/FuncHandler/status-order';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { baseOrderSchema, OrderInput } from '~/shared/schema/order.schema';
import { api } from '~/trpc/react';
import OrderItemForm from './OrderItemForm';

export default function OrderUpsert({
  orderId,
  setOpened
}: {
  orderId?: string;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const { data, isLoading } = api.Order.getOne.useQuery(
    { s: orderId || '' },
    {
      enabled: !!orderId
    }
  );
  const formFields = useForm<OrderInput>({
    resolver: zodResolver(baseOrderSchema),
    defaultValues: {
      id: undefined,
      finalTotal: 0,
      discountAmount: 0,
      originalTotal: 0,
      status: OrderStatus.UNPAID,
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
          type: AddressType.DELIVERY,
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
    control: formFields.control,
    name: 'orderItems'
  });

  useEffect(() => {
    if (data?.id) {
      formFields.reset({
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
  }, [data, formFields.reset]);

  const { data: payments = [] } = api.Payment.getAll.useQuery();
  const { data: users = [] } = api.User.getAll.useQuery();
  const utils = api.useUtils();
  const updateMutation = api.Order.upsert.useMutation({
    onSuccess: () => {
      NotifySuccess('Chúc mừng bạn đã thao tác thành công.');
      setOpened(false);
      utils.Order.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  const onSubmit: SubmitHandler<OrderInput> = async formData => {
    try {
      await updateMutation.mutateAsync(formData);
    } catch {
      NotifyError('Đã xây ra ngoại lệ. Vui lòng kiểm tra lai.');
    }
  };

  useEffect(() => {
    console.log('formFields.formState.errors', formFields.formState.errors);
  }, [formFields.formState.errors]);

  if (isLoading) return <LoadingSpiner />;

  return (
    <FormProvider {...formFields}>
      <form onSubmit={formFields.handleSubmit(onSubmit)}>
        <Grid>
          <GridCol span={6}>
            <Card shadow='sm' padding='lg' radius='md' withBorder>
              <Group justify='space-between' align='center'>
                <Title order={2} className='mb-4 font-quicksand text-xl'>
                  Thông tin vận chuyển
                </Title>
                <BButton
                  variant='outline'
                  disabled={Boolean(formFields.watch('userId'))}
                  onClick={() => {
                    formFields.reset({
                      finalTotal: 0,
                      discountAmount: 0,
                      originalTotal: 0,
                      status: OrderStatus.UNPAID,
                      userId: users?.[0]?.id,
                      paymentId: payments?.[0]?.id,
                      orderItems: [],
                      delivery: {
                        email: 'anluu099@gmail.com',
                        phone: '0918064618',
                        name: 'Luu Truong An',
                        note: 'Làm nóng món ăn giúp mình nhé quán. Cảm ơn nhiều.♥♥',
                        address: {
                          type: AddressType.DELIVERY,
                          provinceId: '1',
                          districtId: '1',
                          wardId: '1',
                          province: 'Thành phố Hà Nội',
                          district: 'Quận Ba Đình',
                          ward: 'Phường Phúc Xá',
                          detail: '215-7',
                          fullAddress: '215-7, Phường Phúc Xá, Quận Ba Đình, Thành phố Hà Nội'
                        }
                      }
                    });
                  }}
                >
                  {' '}
                  Data test
                </BButton>
              </Group>
              <Stack gap='md'>
                <Group grow>
                  <Controller
                    name='delivery.email'
                    control={formFields.control}
                    render={({ field, fieldState }) => (
                      <TextInput
                        label='Email'
                        placeholder='Email'
                        radius={'md'}
                        type='email'
                        leftSection={<IconMail size={18} stroke={1.5} />}
                        {...field}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    name='delivery.name'
                    control={formFields.control}
                    render={({ field, fieldState }) => (
                      <TextInput
                        radius={'md'}
                        label='Họ và tên'
                        placeholder='Họ và tên'
                        {...field}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                </Group>

                <Group grow>
                  <Controller
                    name='delivery.phone'
                    control={formFields.control}
                    defaultValue=''
                    render={({ field, fieldState }) => (
                      <TextInput
                        {...field}
                        radius={'md'}
                        label='Số điện thoại'
                        leftSection={<IconPhone size={18} stroke={1.5} />}
                        placeholder='Số điện thoại (tùy chọn)'
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                </Group>

                <AddressSection control={formFields.control} setValue={formFields.setValue} name={`delivery`} />

                <Controller
                  name='delivery.note'
                  control={formFields.control}
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
                  control={formFields.control}
                  render={({ field }) => (
                    <Select
                      label='Khách hàng'
                      searchable
                      radius='md'
                      placeholder=' Chọn khách hàng'
                      data={users?.map(user => ({ value: user.id, label: user.name }))}
                      {...field}
                      error={formFields.formState.errors.userId?.message}
                    />
                  )}
                />
              </GridCol>
              <GridCol span={6}>
                <Controller
                  name='paymentId'
                  control={formFields.control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label='Phương thức thanh toán'
                      searchable
                      radius='md'
                      placeholder=' Chọn phương thức thanh toán'
                      data={payments?.map(payment => ({ value: payment.id, label: payment.name }))}
                      error={formFields.formState.errors.paymentId?.message}
                    />
                  )}
                />
              </GridCol>
              <GridCol span={6}>
                <Controller
                  control={formFields.control}
                  name='finalTotal'
                  render={({ field: { onChange, onBlur, value, name } }) => (
                    <NumberInput
                      radius={'md'}
                      thousandSeparator=','
                      hideControls
                      clampBehavior='strict'
                      readOnly
                      label='Tổng tiền (chỉ đọc)'
                      placeholder='Sẽ được tính ngay sau khi gọi món.'
                      error={formFields.formState.errors.finalTotal?.message}
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
                  control={formFields.control}
                  render={({ field }) => (
                    <Select
                      label='Trạng thái (chỉ đọc)'
                      radius='md'
                      placeholder=' Chọn trạng thái'
                      data={Object.values(OrderStatus).map(status => ({
                        value: status,
                        label: getStatusInfo(status as OrderStatus).label
                      }))}
                      {...field}
                      error={formFields.formState.errors.status?.message}
                    />
                  )}
                />
              </GridCol>
              <Title order={3} mt='lg' className='font-quicksand'>
                Món ăn
              </Title>
              <GridCol span={12}>
                {formFields.formState.errors.orderItems?.message && (
                  <Alert
                    w={'100%'}
                    radius={'md'}
                    variant='light'
                    color='yellow'
                    title='Cảnh báo'
                    icon={<IconInfoCircle />}
                  >
                    {formFields.formState.errors.orderItems?.message}
                  </Alert>
                )}
              </GridCol>
              {orderItemFields.map((field, index) => (
                <OrderItemForm key={field.id} {...field} index={index} removeOrderItem={removeOrderItem} />
              ))}
              <BButton
                type='button'
                onClick={() =>
                  appendOrderItem({
                    id: undefined,
                    productId: '',
                    quantity: 1,
                    price: 0
                  })
                }
                variant='outline'
                w={'100%'}
                m={10}
              >
                Thêm món
              </BButton>
            </Grid>
          </GridCol>
        </Grid>
        <BButton
          type='submit'
          className='mt-4'
          loading={formFields.formState.isSubmitting}
          fullWidth
          disabled={!formFields.formState.isDirty}
        >
          Cập nhật
        </BButton>
      </form>
    </FormProvider>
  );
}
