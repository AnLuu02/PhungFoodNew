'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Checkbox, Grid, MultiSelect, NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { UserLevel } from '@prisma/client';
import { IconCalendar } from '@tabler/icons-react';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { createTag } from '~/lib/func-handler/generateTag';
import { getLevelUser } from '~/lib/func-handler/level-user';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { LocalVoucherType } from '~/lib/zod/EnumType';
import { voucherSchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { Voucher } from '~/types/voucher';

export default function UpdateVoucher({ voucherId, setOpened }: { voucherId: string; setOpened: any }) {
  const queryResult = voucherId ? api.Voucher.getOne.useQuery({ s: voucherId || '' }) : { data: null };
  const { data: products, isLoading } = api.Product.getAll.useQuery({
    hasCategoryChild: false,
    userRole: 'ADMIN'
  });
  const { data } = queryResult;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm<Voucher>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      id: '',
      tag: '',
      name: '',
      description: '',
      type: LocalVoucherType.FIXED,
      discountValue: 0,
      minOrderPrice: 0,
      maxDiscount: 0,
      applyAll: true,
      quantity: 0,
      usedQuantity: 0,
      availableQuantity: 0,
      startDate: new Date(),
      endDate: new Date(),
      vipLevel: '0',
      products: []
    }
  });

  useEffect(() => {
    if (data?.id) {
      reset({
        id: data.id,
        tag: data.tag,
        name: data.name,
        description: data.description || '',
        type: data.type,
        discountValue: data.discountValue,
        minOrderPrice: data.minOrderPrice,
        maxDiscount: data.maxDiscount,
        applyAll: data.applyAll,
        quantity: data.quantity,
        usedQuantity: data.usedQuantity,
        availableQuantity: data.availableQuantity,
        startDate: data?.startDate,
        endDate: data.endDate,
        vipLevel: data?.vipLevel?.toString() || '0',
        products: data?.products?.map(product => product.id) || []
      });
    }
  }, [data, reset]);

  const utils = api.useUtils();
  const updateMutation = api.Voucher.update.useMutation({
    onSuccess: () => {
      utils.Voucher.invalidate();
    }
  });

  const onSubmit: SubmitHandler<Voucher> = async formData => {
    if (voucherId) {
      const currentProductIds = data?.products.map(p => p.id) || [];
      const newProductIds = formData.products;
      const productsToConnect = newProductIds.filter(id => !currentProductIds.includes(id)).map(id => ({ id }));
      const productsToDisconnect = currentProductIds.filter(id => !newProductIds.includes(id)).map(id => ({ id }));
      if (!formData.applyAll && !formData.products?.length) {
        NotifyError('Hãy chọn sản phẩm áp dụng khuyến mãi.');
        return;
      }
      let result = await updateMutation.mutateAsync({
        where: { id: voucherId },
        data: {
          ...formData,
          tag: createTag(formData.name),
          vipLevel: Number(formData.vipLevel) || 0,
          products: {
            connect: productsToConnect,
            disconnect: productsToDisconnect
          }
        }
      });
      if (result.success) {
        NotifySuccess(result.message);
        setOpened(false);
      } else {
        NotifyError(result.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid gutter='md'>
        {/* Tên voucher */}
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='name'
            render={({ field }) => (
              <TextInput
                {...field}
                required
                label='Tên voucher'
                placeholder='Nhập tên voucher'
                error={errors.name?.message}
              />
            )}
          />
        </Grid.Col>

        {/* Mô tả */}
        <Grid.Col span={12}>
          <Controller
            control={control}
            name='description'
            render={({ field }) => (
              <Textarea label='Mô tả' placeholder='Nhập mô tả' error={errors.description?.message} {...field} />
            )}
          />
        </Grid.Col>

        {/* Hình thức khuyến mãi */}
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='type'
            render={({ field }) => (
              <Select
                label='Hình thức khuyến mãi'
                searchable
                placeholder='Chọn phương thức'
                data={[
                  { value: LocalVoucherType.FIXED, label: 'Tiền mặt' },
                  { value: LocalVoucherType.PERCENTAGE, label: '% đơn hàng' }
                ]}
                error={errors.type?.message}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Grid.Col>

        {/* Giá trị giảm giá */}
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='discountValue'
            render={({ field }) => (
              <NumberInput
                {...field}
                leftSection={watch('type') === LocalVoucherType.PERCENTAGE ? '%' : '$'}
                thousandSeparator=','
                label='Giá trị giảm giá'
                clampBehavior='strict'
                placeholder='Nhập số tiền hoặc %'
                max={watch('type') === LocalVoucherType.FIXED ? 100000000 : 100}
                error={errors.discountValue?.message}
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <Controller
            control={control}
            name='minOrderPrice'
            render={({ field }) => (
              <NumberInput
                {...field}
                thousandSeparator=','
                label='Giá trị đơn hàng tối thiểu'
                placeholder='Nhập giá trị'
                clampBehavior='strict'
                error={errors.minOrderPrice?.message}
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <Controller
            control={control}
            name='maxDiscount'
            render={({ field }) => (
              <NumberInput
                {...field}
                thousandSeparator=','
                label='Giảm giá tối đa'
                placeholder='Nhập giá trị'
                value={watch('type') === LocalVoucherType.FIXED ? watch('discountValue') : field.value}
                error={errors.maxDiscount?.message}
              />
            )}
          />
        </Grid.Col>

        {/* Số lượng voucher */}
        <Grid.Col span={4}>
          <Controller
            control={control}
            name='quantity'
            render={({ field }) => (
              <NumberInput
                {...field}
                thousandSeparator=','
                label='Số lượng voucher'
                placeholder='Nhập số lượng'
                error={errors.quantity?.message}
              />
            )}
          />
        </Grid.Col>

        {/* Đã bán */}
        <Grid.Col span={4}>
          <Controller
            control={control}
            name='usedQuantity'
            render={({ field }) => (
              <NumberInput
                {...field}
                thousandSeparator=','
                label='Số lượng đã bán'
                placeholder='Nhập số lượng'
                error={errors.usedQuantity?.message}
                readOnly
                disabled
              />
            )}
          />
        </Grid.Col>

        {/* Còn lại */}
        <Grid.Col span={4}>
          <Controller
            control={control}
            name='availableQuantity'
            render={({ field }) => (
              <NumberInput
                {...field}
                thousandSeparator=','
                label='Số lượng còn lại'
                placeholder='Nhập số lượng'
                readOnly
                error={errors.availableQuantity?.message}
              />
            )}
          />
        </Grid.Col>

        {/* Ngày bắt đầu */}
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='startDate'
            render={({ field }) => (
              <DateTimePicker
                {...field}
                valueFormat='DD-MM-YYYY'
                leftSection={<IconCalendar size={18} stroke={1.5} />}
                dropdownType='modal'
                label='Ngày bắt đầu'
                placeholder='Chọn ngày bắt đầu'
                error={errors.startDate?.message}
              />
            )}
          />
        </Grid.Col>

        {/* Ngày kết thúc */}
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='endDate'
            render={({ field }) => (
              <DateTimePicker
                {...field}
                valueFormat='DD-MM-YYYY'
                leftSection={<IconCalendar size={18} stroke={1.5} />}
                dropdownType='modal'
                label='Ngày kết thúc'
                placeholder='Chọn ngày kết thúc'
                error={errors.endDate?.message}
              />
            )}
          />
        </Grid.Col>

        {/* Cấp độ VIP */}
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='vipLevel'
            render={({ field }) => (
              <Select
                {...field}
                label='Cấp độ VIP yêu cầu'
                searchable
                data={Object.values(UserLevel).map((level, index) => ({
                  value: index.toString(),
                  label: getLevelUser(level)
                }))}
                value={field.value?.toString()}
                placeholder='Nhập cấp độ'
                error={errors.vipLevel?.message}
              />
            )}
          />
        </Grid.Col>
        {/* Áp dụng cho tất cả */}
        <Grid.Col span={12}>
          <Controller
            control={control}
            name='applyAll'
            render={({ field }) => (
              <Checkbox
                label='Áp dụng cho tất cả'
                error={errors.applyAll?.message}
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Grid.Col>

        {/* Product áp dụng*/}
        {!watch('applyAll') && (
          <Grid.Col span={12}>
            <Controller
              name='products'
              control={control}
              render={({ field }) => (
                <MultiSelect
                  {...field}
                  label='Sản phẩm áp dụng'
                  placeholder='Chọn sản phẩm áp dụng'
                  searchable
                  data={products?.map(product => ({
                    value: product.id,
                    label: product.name
                  }))}
                  error={errors.products?.message}
                />
              )}
            />
          </Grid.Col>
        )}
      </Grid>
      <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth>
        Cập nhật
      </Button>
    </form>
  );
}
