'use client';
import { Box, Button, Grid, NumberInput, Select, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Control, Controller, FieldErrors, UseFormGetValues, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { NotifyError } from '~/lib/FuncHandler/toast';
import { api } from '~/trpc/react';
import { OrderClientType } from '~/types';
import { ProductAll } from '~/types/client-type-trpc';

const OrderItemForm = ({
  index,
  removeOrderItem,
  control,
  watch,
  setValue,
  getValues,
  errors
}: {
  index: number;
  removeOrderItem: (index: number) => void;
  control: Control<OrderClientType, any, OrderClientType>;
  watch: UseFormWatch<OrderClientType>;
  setValue: UseFormSetValue<OrderClientType>;
  getValues: UseFormGetValues<OrderClientType>;
  errors: FieldErrors<OrderClientType>;
}) => {
  const [productOrderItem, setProductOrderItem] = useState<NonNullable<ProductAll>[0]>();
  const { data: products } = api.Product.getAll.useQuery({});

  const chooseProduct = watch(`orderItems.${index}.productId`);
  const chooseQuantity = watch(`orderItems.${index}.quantity`);
  const orderItems = watch(`orderItems`);
  useEffect(() => {
    const p = products?.find(product => product.id === chooseProduct);
    if (p?.id) {
      setProductOrderItem(p);
      setValue(`orderItems.${index}.price`, +(p?.price || 0));
    }
  }, [chooseProduct]);

  useEffect(() => {
    setValue(
      'originalTotal',
      orderItems.reduce((sum: number, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
    );
    setValue(
      'finalTotal',
      orderItems.reduce((sum: number, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
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
            render={({ field }) => (
              <Select
                label='Chọn món'
                searchable
                radius='md'
                {...field}
                placeholder='Select products'
                data={products?.map(product => ({
                  value: product.id,
                  label: product.name,
                  disabled:
                    !product.availableQuantity || watch(`orderItems`).some(item => item.productId === product.id)
                }))}
                error={errors.orderItems?.[index]?.productId?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name={`orderItems.${index}.quantity`}
            defaultValue={1}
            render={({ field }) => (
              <NumberInput
                radius={'md'}
                {...field}
                thousandSeparator=','
                label={`Số lượng (còn: ${Number(productOrderItem?.availableQuantity) || 100})`}
                min={0}
                max={Number(productOrderItem?.availableQuantity) || 100}
                placeholder='Select quantity'
                error={errors?.orderItems?.[index]?.quantity?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            name={`orderItems.${index}.price`}
            control={control}
            render={({ field }) => (
              <NumberInput
                radius={'md'}
                thousandSeparator=','
                label={`Giá (chỉ đọc)`}
                readOnly
                error={errors.orderItems?.[index]?.price?.message}
                {...field}
              />
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
