'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, NumberInput, Select, Title } from '@mantine/core';
import { OrderStatus } from '@prisma/client';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import LoadingComponent from '~/app/_components/Loading';
import { Order } from '~/app/Entity/OrderEntity';
import { NotifyError, NotifySuccess } from '~/app/lib/utils/func-handler/toast';
import { orderSchema } from '~/app/lib/utils/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import OrderItemForm from './OrderItemForm';

export default function UpdateOrder({ orderId, setOpened }: { orderId: string; setOpened: any }) {
  const { data, isLoading } = orderId ? api.Order.getOne.useQuery({ query: orderId || '' }) : {};
  const {
    control,
    register,
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
      total: 0,
      status: OrderStatus.PENDING,
      userId: '',
      paymentId: '',
      orderItems: []
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

  useEffect(() => {
    if (data?.id) {
      reset({
        id: data?.id,
        total: data?.total,
        status: data?.status,
        userId: data?.userId || '',
        paymentId: data?.paymentId || '',
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
  const updateMutation = api.Order.update.useMutation();

  const onSubmit: SubmitHandler<Order> = async formData => {
    if (orderId) {
      let result = await updateMutation.mutateAsync({ where: { id: formData.id }, data: formData });
      if (result.success) {
        NotifySuccess(result.message);
        setOpened(false);
        utils.Order.invalidate();
      } else {
        NotifyError(result.message);
      }
    }
  };

  return isLoading ? (
    <LoadingComponent />
  ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid gutter='md'>
        <Grid.Col span={6}>
          <Controller
            name='userId'
            control={control}
            rules={{ required: 'User is required' }}
            render={({ field, fieldState }) => (
              <Select
                label='Khách hàng'
                placeholder='Select your User'
                data={users?.map((user: any) => ({ value: user.id, label: user.name }))}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.userId?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            name='paymentId'
            control={control}
            rules={{ required: 'Payment is required' }}
            render={({ field, fieldState }) => (
              <Select
                label='Phương thức thanh toán'
                placeholder='Select your Payment'
                data={payments?.map((payment: any) => ({ value: payment.id, label: payment.name }))}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.paymentId?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            name='total'
            control={control}
            rules={{ required: 'User is required' }}
            render={({ field }) => (
              <NumberInput
                thousandSeparator=','
                label='Tổng tiền'
                readOnly
                placeholder='x'
                error={errors.total?.message}
                {...field}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            name='status'
            control={control}
            rules={{ required: 'Status is required' }}
            render={({ field, fieldState }) => (
              <Select
                label='Trạng thái'
                placeholder='Select your Status'
                data={Object.values(OrderStatus)}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.status?.message}
                c={'red'}
                content='red'
              />
            )}
          />
        </Grid.Col>

        <Title order={3} mt='lg'>
          Món
        </Title>

        {orderItemFields.map((field, index) => (
          <OrderItemForm
            register={register}
            key={field.id}
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
              id: 'default',
              productId: '',
              quantity: 1,
              price: 0,
              orderId: orderId
            })
          }
          variant='outline'
          mt='md'
        >
          Thêm món
        </Button>
      </Grid>
      <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth>
        Cập nhật
      </Button>
    </form>
  );
}
