'use client';
import { Box, Button, Grid, NumberInput, Select, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { formatPriceLocaleVi } from '~/app/lib/utils/func-handler/formatPrice';
import { NotifyError } from '~/app/lib/utils/func-handler/toast';
import { api } from '~/trpc/react';

const OrderItemForm = ({ index, removeOrderItem, control, watch, setValue, getValues, errors }: any) => {
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
      'total',
      orderItems.reduce((total: number, item: any) => total + (item.price || 0) * (item.quantity || 0), 0).toString()
    );
  }, [chooseProduct, chooseQuantity, orderItems]);

  return (
    <Box mb='md' p='md' style={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <Grid gutter='md'>
        <Grid.Col span={12}>
          <Controller
            control={control}
            name={`orderItems.${index}.productId`}
            render={({ field }) => (
              <Select
                label='Chọn món'
                searchable
                {...field}
                placeholder='Select products'
                data={products?.map((product: any) => ({ value: product.id, label: product.name }))}
                error={errors.OrderItems?.[index]?.productsId?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name={`orderItems.${index}.quantity`}
            defaultValue='1'
            rules={{
              validate: value =>
                Number(value) <= Number(productOrderItem?.availableQuantity) ||
                `Trong kho chỉ còn ${productOrderItem?.availableQuantity} sản phẩm.`
            }}
            render={({ field }) => (
              <NumberInput
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
            rules={{ required: 'User is required' }}
            render={({ field }) => (
              <NumberInput
                thousandSeparator=','
                label={`Giá (chỉ đọc)`}
                readOnly
                error={errors.OrderItems?.[index]?.name?.message}
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
