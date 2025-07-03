'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Checkbox, Grid, MultiSelect, NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { UserLevel } from '@prisma/client';
import { IconCalendar } from '@tabler/icons-react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Voucher } from '~/Entity/VoucherEntity';
import { createTag } from '~/lib/func-handler/generateTag';
import { getLevelUser } from '~/lib/func-handler/level-user';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { LocalVoucherType } from '~/lib/zod/EnumType';
import { voucherSchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';

export default function CreateVoucher({ setOpened }: { setOpened: any }) {
  const { data, isLoading } = api.Product.getAll.useQuery({
    hasCategoryChild: false,
    userRole: 'ADMIN'
  });

  const products = data || [];
  const maps = new Map();
  products?.forEach(product => {
    maps.set(product.id, {
      name: product.name,
      price: product.price
    });
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
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

  const utils = api.useUtils();
  const mutation = api.Voucher.create.useMutation({
    onSuccess: () => {
      utils.Voucher.invalidate();
    }
  });

  const onSubmit: SubmitHandler<Voucher> = async formData => {
    try {
      if (formData) {
        let result = await mutation.mutateAsync({
          ...formData,
          tag: createTag(formData.name),
          availableQuantity: formData.quantity,
          vipLevel: Number(formData.vipLevel) || 0
        });
        if (result.success) {
          NotifySuccess(result.message);
          setOpened(false);
        } else {
          NotifyError(result.message);
        }
      }
    } catch (error) {
      NotifyError('Error created Voucher');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid gutter='md'>
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

        <Grid.Col span={12}>
          <Controller
            control={control}
            name='description'
            render={({ field }) => (
              <Textarea label='Mô tả' placeholder='Nhập mô tả' error={errors.description?.message} {...field} />
            )}
          />
        </Grid.Col>

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
        {/* <Grid.Col span={4}>
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
        </Grid.Col> */}

        {/* <Grid.Col span={4}>
          <Controller
            control={control}
            name='availableQuantity'
            defaultValue={watch('quantity')}
            render={({ field }) => (
              <NumberInput
                {...field}
                defaultValue={watch('quantity')}
                thousandSeparator=','
                label='Số lượng còn lại'
                placeholder='Nhập số lượng'
                readOnly
                error={errors.availableQuantity?.message}
              />
            )}
          />
        </Grid.Col> */}

        <Grid.Col span={4}>
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
        <Grid.Col span={4}>
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
                  label='Sản phẩm áp dụng'
                  placeholder='Chọn sản phẩm áp dụng'
                  searchable
                  data={products?.map(product => ({
                    value: product.id,
                    label: product.name
                  }))}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.products?.message}
                />
              )}
            />
          </Grid.Col>
        )}
      </Grid>
      <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth>
        Tạo mới
      </Button>
    </form>
  );
}
