'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, NumberInput, Select, Title } from '@mantine/core';
import { OrderStatus } from '@prisma/client';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Order } from '~/app/Entity/OrderEntity';
import { NotifyError, NotifySuccess } from '~/app/lib/utils/func-handler/toast';
import { orderSchema } from '~/app/lib/utils/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import OrderItemForm from './OrderItemForm';

export default function CreateOrder({ setOpened }: { setOpened: any }) {
  const {
    control,
    register,
    handleSubmit,
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

  const { data: payments } = api.Payment.getAll.useQuery();
  const { data: users } = api.User.getAll.useQuery();
  const utils = api.useUtils();
  const mutation = api.Order.create.useMutation();

  const onSubmit: SubmitHandler<Order> = async formData => {
    try {
      if (formData) {
        if (formData.orderItems.length === 0) {
          NotifyError('Bạn phải có ít nhất một sản phẩm trong hóa đơn.');
        } else {
          let result = await mutation.mutateAsync(formData);
          if (result.success) {
            NotifySuccess(result.message);
            setOpened(false);
            utils.Order.invalidate();
          } else {
            NotifyError(result.message);
          }
        }
      }
    } catch (error) {
      NotifyError('Error created Order');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid gutter='md'>
        <Grid.Col span={6}>
          <Controller
            name='userId'
            control={control}
            rules={{ required: 'User is required' }}
            render={({ field }) => (
              <Select
                label='Khách hàng'
                placeholder='Select your User'
                data={users?.map(user => ({ value: user.id, label: user.name }))}
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
            rules={{ required: 'Payment is required' }}
            render={({ field }) => (
              <Select
                label='Phương thức thanh toán'
                placeholder='Select your Payment'
                data={payments?.map(payment => ({ value: payment.id, label: payment.name }))}
                {...field}
                error={errors.paymentId?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='total'
            render={({ field: { onChange, onBlur, value, name } }) => (
              <NumberInput
                thousandSeparator=','
                hideControls
                readOnly
                label='Tổng tiền (chỉ đọc)'
                placeholder='Sẽ được tính ngay sau khi gọi món.'
                error={errors.total?.message}
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
            rules={{ required: 'Status is required' }}
            render={({ field }) => (
              <Select
                label='Trạng thái (chỉ đọc)'
                placeholder='Select your Status'
                data={Object.values(OrderStatus)}
                {...field}
                error={errors.status?.message}
                readOnly
              />
            )}
          />
        </Grid.Col>

        <Title order={3} mt='lg'>
          Món ăn
        </Title>
        {orderItemFields.map((field, index) => (
          <OrderItemForm
            register={register}
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
      <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth>
        Tạo mới
      </Button>
    </form>
  );
}
