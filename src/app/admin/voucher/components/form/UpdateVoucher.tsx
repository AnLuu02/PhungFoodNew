'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Checkbox, Grid, NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { VoucherType } from '@prisma/client';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Voucher } from '~/app/Entity/VoucherEntity';
import { createTag } from '~/app/lib/utils/generateTag';
import { NotifyError, NotifySuccess } from '~/app/lib/utils/toast';
import { voucherSchema } from '~/app/lib/utils/zodShcemaForm';
import { api } from '~/trpc/react';

export default function UpdateVoucher({ voucherId, setOpened }: { voucherId: string; setOpened: any }) {
  const queryResult = voucherId ? api.Voucher.getOne.useQuery({ query: voucherId || '' }) : { data: null };
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
      type: VoucherType.FIXED,
      discountValue: 0,
      minOrderPrice: 0,
      maxDiscount: 0,
      applyAll: false,
      quantity: 0,
      usedQuantity: 0,
      availableQuantity: 0,
      startDate: new Date(),
      endDate: new Date(),
      vipLevel: 0,
      products: []
    }
  });

  const nameValue = watch('name', '');
  useEffect(() => {
    const generatedTag = createTag(nameValue);
    setValue('tag', generatedTag);
  }, [nameValue, setValue]);

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
        vipLevel: data.vipLevel || 0
      });
    }
  }, [data, reset]);

  const utils = api.useUtils();
  const updateMutation = api.Voucher.update.useMutation();

  const onSubmit: SubmitHandler<Voucher> = async formData => {
    if (voucherId) {
      const updatedFormData = { ...formData, products: formData?.products?.map(product => product.id) };
      let result = await updateMutation.mutateAsync(updatedFormData);
      if (result.success) {
        NotifySuccess(result.message);
        setOpened(false);
        utils.Voucher.invalidate();
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
              <TextInput label='Tên voucher' placeholder='Nhập tên voucher' error={errors.name?.message} {...field} />
            )}
          />
        </Grid.Col>

        {/* Tag */}
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='tag'
            render={({ field }) => (
              <TextInput label='Tag' placeholder='Sẽ tạo tự động' error={errors.tag?.message} readOnly {...field} />
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
                placeholder='Chọn phương thức'
                data={[
                  { value: VoucherType.FIXED, label: 'Tiền mặt' },
                  { value: VoucherType.PERCENTAGE, label: '% đơn hàng' }
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
                label='Giá trị giảm giá'
                placeholder='Nhập số tiền hoặc %'
                error={errors.discountValue?.message}
                {...field}
              />
            )}
          />
        </Grid.Col>

        {/* Giá trị đơn hàng tối thiểu */}
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='minOrderPrice'
            render={({ field }) => (
              <NumberInput
                label='Giá trị đơn hàng tối thiểu'
                placeholder='Nhập giá trị'
                error={errors.minOrderPrice?.message}
                {...field}
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
                label='Giảm giá tối đa'
                placeholder='Nhập giá trị'
                error={errors.maxDiscount?.message}
                {...field}
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

        {/* Số lượng voucher */}
        <Grid.Col span={4}>
          <Controller
            control={control}
            name='quantity'
            render={({ field }) => (
              <NumberInput
                label='Số lượng voucher'
                placeholder='Nhập số lượng'
                error={errors.quantity?.message}
                {...field}
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
                label='Số lượng đã bán'
                placeholder='Nhập số lượng'
                error={errors.usedQuantity?.message}
                {...field}
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
                label='Số lượng còn lại'
                placeholder='Nhập số lượng'
                error={errors.availableQuantity?.message}
                {...field}
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
              <DatePickerInput
                label='Ngày bắt đầu'
                placeholder='Chọn ngày'
                error={errors.startDate?.message}
                {...field}
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
              <DatePickerInput
                label='Ngày kết thúc'
                placeholder='Chọn ngày'
                error={errors.endDate?.message}
                {...field}
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
              <NumberInput
                label='Cấp độ VIP yêu cầu'
                placeholder='Nhập cấp độ'
                error={errors.vipLevel?.message}
                {...field}
              />
            )}
          />
        </Grid.Col>
      </Grid>
      <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth>
        Cập nhật
      </Button>
    </form>
  );
}
