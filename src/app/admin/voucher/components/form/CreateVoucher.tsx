'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Center,
  Checkbox,
  Divider,
  Grid,
  NumberInput,
  Select,
  Switch,
  Text,
  Textarea,
  TextInput
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { IconCalendar, IconCheck, IconX } from '@tabler/icons-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { createTag } from '~/lib/func-handler/generateTag';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { LocalVoucherStatus, LocalVoucherType } from '~/lib/zod/EnumType';
import { voucherSchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { Voucher } from '~/types/voucher';

export default function CreateVoucher({ setOpened }: { setOpened: Dispatch<SetStateAction<boolean>> }) {
  const [applyForLevel, setApplyForLevel] = useState(false);
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
      status: LocalVoucherStatus.ENABLED,
      discountValue: 0,
      minOrderPrice: 0,
      maxDiscount: 0,
      code: '',
      applyAll: true,
      quantity: 0,
      quantityForUser: 1,
      usedQuantity: 0,
      availableQuantity: 0,
      startDate: new Date(),
      endDate: new Date(),
      pointUser: -1
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
        const result = await mutation.mutateAsync({
          ...formData,
          type: formData.type,
          tag: createTag(formData.name),
          availableQuantity: formData.quantity,
          pointUser: Number(formData.pointUser) || 0
        });
        if (result.code === 'OK') {
          NotifySuccess(result.message);
          setOpened(false);
        } else {
          NotifyError(result.message);
        }
      }
    } catch {
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

        <Grid.Col span={6}>
          <Controller
            control={control}
            name='code'
            render={({ field }) => (
              <TextInput
                {...field}
                required
                onKeyDown={e => {
                  if (e.key === ' ') {
                    e.preventDefault();
                  }
                }}
                label='Mã giảm giá'
                placeholder='Nhập mã giảm giá'
                error={errors.code?.message}
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
                onChange={value => {
                  if (watch('type') === LocalVoucherType.FIXED) {
                    setValue('maxDiscount', +value);
                  }
                  field.onChange(value);
                }}
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
                value={field.value}
                error={errors.maxDiscount?.message}
              />
            )}
          />
        </Grid.Col>

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
        <Grid.Col span={6}>
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
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='quantityForUser'
            render={({ field }) => (
              <NumberInput
                {...field}
                thousandSeparator=','
                label='Số lượng cho người dùng'
                placeholder='Nhập số lượng'
                error={errors.quantityForUser?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Center className='my-3 flex items-center gap-5'>
            <Divider orientation='horizontal' color='dimmed' variant='dotted' w={'30%'} />
            <Text size='sm' c={'dimmed'}>
              Options
            </Text>
            <Divider orientation='horizontal' color='dimmed' variant='dotted' w={'30%'} />
          </Center>
        </Grid.Col>
        <Grid.Col span={4}>
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
        <Grid.Col span={4}>
          <Controller
            control={control}
            name='status'
            render={({ field }) => (
              <Switch
                label='Trạng thái (Ẩn / Hiện)'
                error={errors.status?.message}
                checked={(field.value as LocalVoucherStatus) === LocalVoucherStatus.ENABLED}
                onChange={event => {
                  const checked = event.target.checked;
                  field.onChange(checked ? LocalVoucherStatus.ENABLED : LocalVoucherStatus.DISABLED);
                }}
                thumbIcon={
                  (field.value as LocalVoucherStatus) === LocalVoucherStatus.ENABLED ? (
                    <IconCheck size={12} color='var(--mantine-color-teal-6)' stroke={3} />
                  ) : (
                    <IconX size={12} color='var(--mantine-color-red-6)' stroke={3} />
                  )
                }
              />
            )}
          />
        </Grid.Col>
        {!watch('applyAll') && (
          <>
            <Grid.Col span={12}>
              <Checkbox
                label='Áp dụng cho điểm người dùng'
                checked={applyForLevel}
                onChange={e => setApplyForLevel(e.target.checked)}
              />
            </Grid.Col>
            {applyForLevel && (
              <Grid.Col span={6}>
                <Controller
                  control={control}
                  name='pointUser'
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      thousandSeparator=','
                      label='Giá trị điểm tối thiểu'
                      placeholder='Nhập giá trị'
                      clampBehavior='strict'
                      error={errors.pointUser?.message}
                    />
                  )}
                />
              </Grid.Col>
            )}
          </>
        )}
      </Grid>
      <Button type='submit' className='mt-8 w-full' loading={isSubmitting} fullWidth>
        Tạo mới
      </Button>
    </form>
  );
}
