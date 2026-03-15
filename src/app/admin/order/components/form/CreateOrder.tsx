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
import { AddressType, OrderStatus } from '@prisma/client';
import { IconMail, IconPhone } from '@tabler/icons-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import AddressSection from '~/components/AdressSection';
import BButton from '~/components/Button/Button';
import { getStatusInfo } from '~/lib/FuncHandler/status-order';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { orderSchema } from '~/lib/ZodSchema/schema';
import { api } from '~/trpc/react';
import { Order } from '~/types/order';
import OrderItemForm from './OrderItemForm';

export default function CreateOrder({ setOpened }: { setOpened: Dispatch<SetStateAction<boolean>> }) {
  const [users, setUsers] = useState<any>([]);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<Order>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      id: '',
      finalTotal: 0,
      originalTotal: 0,
      discountAmount: 0,
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
        email: '',
        note: ''
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

  const { data: payments = [] } = api.Payment.getAll.useQuery();
  const utils = api.useUtils();
  const mutation = api.Order.create.useMutation({
    onSuccess: result => {
      if (result.code === 'OK') {
        NotifySuccess(result.message);
        utils.Order.invalidate();
        setOpened(false);
      } else {
        NotifyError(result.message);
      }
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  const onSubmit: SubmitHandler<Order> = async formData => {
    try {
      if (!formData) return;
      if (formData.orderItems.length === 0) {
        NotifyError('Không hợp lệ.', 'Bạn phải có ít nhất một sản phẩm trong hóa đơn.');
      } else {
        await mutation.mutateAsync({
          ...formData,
          delivery: {
            ...formData?.delivery,
            address: {
              ...formData?.delivery.address,
              detail: formData?.delivery.address?.detail || '',
              provinceId: formData?.delivery.address?.provinceId || '',
              districtId: formData?.delivery.address?.districtId || '',
              wardId: formData?.delivery.address?.wardId || ''
            }
          } as any
        });
      }
    } catch {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid>
        <GridCol span={6} className='sticky top-0 h-fit'>
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
                      radius={'md'}
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
                  control={control}
                  defaultValue=''
                  render={({ field, fieldState }) => (
                    <TextInput
                      radius={'md'}
                      {...field}
                      label='Số điện thoại'
                      leftSection={<IconPhone size={18} stroke={1.5} />}
                      placeholder='Số điện thoại (tùy chọn)'
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </Group>

              <AddressSection control={control} setValue={setValue} name={`delivery`} />

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
        <GridCol span={6} className='h-fit'>
          <Grid gutter='md'>
            <Grid.Col span={6}>
              <Controller
                name='userId'
                control={control}
                render={({ field }) => (
                  <Select
                    label='Khách hàng'
                    onClick={async () => {
                      const usersData = await utils.User.getAll.fetch();
                      setUsers(usersData);
                    }}
                    searchable
                    radius='md'
                    placeholder='Chọn khách hàng'
                    data={users?.map((user: any) => ({ value: user.id, label: user.name }))}
                    {...field}
                    error={errors.userId?.message}
                  />
                )}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Controller
                name='paymentId'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label='Phương thức thanh toán'
                    searchable
                    radius='md'
                    placeholder='Chọn phương thức thanh toán'
                    data={payments?.map(payment => ({ value: payment.id, label: payment.name }))}
                    error={errors.paymentId?.message}
                  />
                )}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Controller
                control={control}
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
                    error={errors.finalTotal?.message}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    name={name}
                  />
                )}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Controller
                name='status'
                control={control}
                render={({ field }) => (
                  <Select
                    label='Trạng thái (chỉ đọc)'
                    radius={'md'}
                    placeholder='Chọn trạng thái'
                    data={Object.values(OrderStatus).map(status => ({
                      value: status,
                      label: getStatusInfo(status as OrderStatus).label
                    }))}
                    {...field}
                    error={errors.status?.message}
                  />
                )}
              />
            </Grid.Col>

            <Title order={3} mt='lg' className='font-quicksand'>
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
      <BButton type='submit' className='mt-4' loading={isSubmitting} fullWidth disabled={!isDirty}>
        Tạo mới
      </BButton>
    </form>
  );
}
