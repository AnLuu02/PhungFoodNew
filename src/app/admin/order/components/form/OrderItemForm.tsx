'use client';
import { Box, Button, Grid, NumberInput, Select, Text, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { caculateAmount } from '~/lib/FuncHandler/calculateLevel';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { NotifyError } from '~/lib/FuncHandler/toast';
import { OrderItemInput } from '~/shared/schema/order.schema';
import { getProductsOnly } from '~/shared/type-trpc/product.type-trpc';
import { api } from '~/trpc/react';

const OrderItemForm = ({ index }: { index: number }) => {
  const { watch, setValue, control } = useFormContext();
  const { remove: removeOrderItem } = useFieldArray({
    control,
    name: 'orderItems'
  });
  const [productOrderItem, setProductOrderItem] = useState<any>({});
  const { data: products } = api.Product.getProductsOnly.useQuery({});

  const orderItems = watch(`orderItems`) as OrderItemInput[];
  const orderItem = watch(`orderItems.${index}`) as OrderItemInput;

  useEffect(() => {
    if (orderItem?.productId) {
      const p = products?.find((product: getProductsOnly[number]) => product.id === orderItem?.productId);
      if (p?.id) {
        const totalPrice =
          (p?.price ?? 0) * (orderItem?.quantity ?? 1) - (p?.discount ?? 0) * (orderItem?.quantity ?? 1);
        setProductOrderItem(p);
        setValue(`orderItems.${index}.unitPrice`, p?.price);
        setValue(`orderItems.${index}.discount`, p?.discount);
        setValue(`orderItems.${index}.productName`, p?.name);
        setValue(`orderItems.${index}.productImage`, p?.thumbnailUrl);
        setValue(`orderItems.${index}.totalPrice`, totalPrice);
      }
    }

    const { finalAmount, tax, totalOriginalPrice } = caculateAmount({
      products: (orderItems ?? []).map(c => ({
        discount: c?.discount ?? 0,
        price: c?.unitPrice ?? 0,
        quantity: c?.quantity ?? 1
      })),
      vouchers: []
    });

    setValue('originalAmount', totalOriginalPrice);
    setValue('taxAmount', tax);
    setValue('finalAmount', finalAmount);
  }, [orderItem?.quantity, orderItem?.productId, orderItems]);

  return (
    <Box
      mb='md'
      p='md'
      style={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}
      className='bg-gray-100 dark:bg-dark-card'
    >
      {/* hidden input */}
      <Controller
        name={`orderItems.${index}.totalPrice`}
        control={control}
        render={({ field }) => <NumberInput {...field} display='none' />}
      />
      <Controller
        name={`orderItems.${index}.discount`}
        control={control}
        render={({ field }) => <NumberInput {...field} display='none' />}
      />
      <Controller
        name={`orderItems.${index}.productName`}
        control={control}
        render={({ field }) => <TextInput {...field} display='none' />}
      />
      <Controller
        name={`orderItems.${index}.productImage`}
        control={control}
        render={({ field }) => <TextInput {...field} display='none' />}
      />

      <Grid gutter='md'>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name={`orderItems.${index}.productId`}
            render={({ field, fieldState: { error } }) => (
              <Select
                label='Chọn món'
                searchable
                {...field}
                placeholder='Select products'
                data={products?.map((product: getProductsOnly[number]) => ({
                  value: product.id,
                  label: product.name,
                  disabled: !product.availableQuantity || orderItems.some(item => item.productId === product.id)
                }))}
                error={error?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            name={`orderItems.${index}.unitPrice`}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <NumberInput thousandSeparator=',' label={`Giá (chỉ đọc)`} readOnly error={error?.message} {...field} />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name={`orderItems.${index}.quantity`}
            defaultValue={1}
            render={({ field, fieldState: { error } }) => (
              <NumberInput
                {...field}
                thousandSeparator=','
                label={`Số lượng (còn: ${Number(productOrderItem?.availableQuantity) || 100})`}
                min={0}
                max={Number(productOrderItem?.availableQuantity) || 100}
                placeholder='Select quantity'
                error={error?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6} style={{ textAlign: 'right' }}></Grid.Col>
        <Grid.Col span={4} style={{ textAlign: 'right' }}>
          <Text style={{ fontWeight: 'bold' }} size='md'>
            Giá góc:
          </Text>
          <Text style={{ fontWeight: 'bold' }} size='lg' c='red'>
            {orderItem?.unitPrice ? formatPriceLocaleVi(orderItem?.unitPrice * orderItem.quantity) : 0}{' '}
            {`(x${orderItem?.quantity ?? 0})`}
          </Text>
        </Grid.Col>
        <Grid.Col span={4} style={{ textAlign: 'right' }}>
          <Text style={{ fontWeight: 'bold' }} size='md'>
            Giảm giá:
          </Text>
          <Text style={{ fontWeight: 'bold' }} size='lg' c='red'>
            {orderItem?.discount ? formatPriceLocaleVi(orderItem?.discount * orderItem.quantity) : 0}{' '}
            {`(x${orderItem?.quantity ?? 0})`}
          </Text>
        </Grid.Col>
        <Grid.Col span={4} style={{ textAlign: 'right' }}>
          <Text style={{ fontWeight: 'bold' }} size='md'>
            Tổng tiền:
          </Text>
          <Text style={{ fontWeight: 'bold' }} size='lg' c='red'>
            {orderItem?.totalPrice ? formatPriceLocaleVi(orderItem?.totalPrice) : 0}
          </Text>
        </Grid.Col>
      </Grid>

      <Button
        type='button'
        onClick={() => {
          if (orderItems.length > 1) {
            removeOrderItem(index);
          } else {
            NotifyError('Không hợp lệ.', 'Đơn hàng phải có ít nhất 1 sản phẩm.');
          }
        }}
        variant='danger'
        mt='md'
      >
        Xóa món
      </Button>
    </Box>
  );
};

export default OrderItemForm;
