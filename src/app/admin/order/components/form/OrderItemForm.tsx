'use client';
import { Box, Button, Grid, NumberInput, Select, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { NotifyError } from '~/lib/FuncHandler/toast';
import { api } from '~/trpc/react';

const OrderItemForm = ({ index }: { index: number }) => {
  const { watch, setValue, getValues, control } = useFormContext();
  const { remove: removeOrderItem } = useFieldArray({
    control,
    name: 'orderItems'
  });
  const [productOrderItem, setProductOrderItem] = useState<any>({});
  const { data: products } = api.Product.getAll.useQuery({
    hasCategory: true,
    hasCategoryChild: true,
    hasReview: true
  });

  const chooseProduct = watch(`orderItems.${index}.productId`);
  const chooseQuantity = watch(`orderItems.${index}.quantity`);
  const orderItems = watch(`orderItems`);
  useEffect(() => {
    const p = products?.find((product: any) => product.id === chooseProduct);
    if (p?.id) {
      setProductOrderItem(p);
      setValue(`orderItems.${index}.price`, p?.price);
    }
  }, [chooseProduct]);

  useEffect(() => {
    setValue(
      'originalTotal',
      orderItems.reduce((sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 0), 0)
    );
    setValue(
      'finalTotal',
      orderItems.reduce((sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 0), 0)
    );
  }, [chooseProduct, chooseQuantity, orderItems]);

  return (
    <Box
      mb='md'
      p='md'
      style={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}
      className='bg-gray-100 dark:bg-dark-card'
    >
      <Grid gutter='md'>
        <Grid.Col span={12}>
          <Controller
            control={control}
            name={`orderItems.${index}.productId`}
            render={({ field, fieldState: { error } }) => (
              <Select
                label='Chọn món'
                searchable
                {...field}
                placeholder='Select products'
                data={products?.map((product: any) => ({
                  value: product.id,
                  label: product.name,
                  disabled:
                    !product.availableQuantity || watch(`orderItems`).some((item: any) => item.productId === product.id)
                }))}
                error={error?.message}
              />
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
        <Grid.Col span={6}>
          <Controller
            name={`orderItems.${index}.price`}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <NumberInput thousandSeparator=',' label={`Giá (chỉ đọc)`} readOnly error={error?.message} {...field} />
            )}
          />
        </Grid.Col>
        <Grid.Col span={12} style={{ textAlign: 'right' }}>
          <Text style={{ fontWeight: 'bold' }} size='md'>
            Tổng tiền:
          </Text>
          <Text style={{ fontWeight: 'bold' }} size='lg' c='red'>
            {getValues(`orderItems.${index}.price`)
              ? formatPriceLocaleVi(
                  Number(getValues(`orderItems.${index}.quantity`)) * Number(getValues(`orderItems.${index}.price`))
                )
              : 0}
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
        variant='outline'
        color='red'
        mt='md'
      >
        Xóa món
      </Button>
    </Box>
  );
};

export default OrderItemForm;
