'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Grid,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { IconCalendar, IconCheck, IconX } from '@tabler/icons-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { LocalVoucherType } from '~/lib/zod/EnumType';
import { voucherSchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { Voucher } from '~/types/voucher';

export default function UpdateVoucher({
  data,
  setOpened
}: {
  data: any;
  setOpened: Dispatch<SetStateAction<any | null>>;
}) {
  const [applyForLevel, setApplyForLevel] = useState(false);
  const queryResult = data || [];

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    watch,
    setValue
  } = useForm<Voucher>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      id: '',
      name: '',
      description: '',
      type: LocalVoucherType.FIXED,
      isActive: true,
      discountValue: 0,
      minOrderPrice: 0,
      maxDiscount: 0,
      applyAll: true,
      code: '',
      quantity: 0,
      quantityForUser: 1,
      usedQuantity: 0,
      availableQuantity: 0,
      startDate: new Date(),
      endDate: new Date(),
      pointUser: -1
    }
  });

  useEffect(() => {
    if (queryResult?.id) {
      reset({
        id: queryResult.id,
        name: queryResult.name,
        description: queryResult.description || '',
        type: queryResult.type,
        isActive: queryResult.isActive || true,
        discountValue: queryResult.discountValue,
        minOrderPrice: queryResult.minOrderPrice,
        maxDiscount: queryResult.maxDiscount,
        applyAll: queryResult.applyAll,
        quantity: queryResult.quantity,
        code: queryResult.code,
        quantityForUser: queryResult.quantityForUser,
        usedQuantity: queryResult.usedQuantity,
        availableQuantity: queryResult.availableQuantity,
        startDate: queryResult?.startDate,
        endDate: queryResult.endDate,
        pointUser: queryResult?.pointUser || -1
      });
    }
    if (queryResult?.applyAll === false) {
      setApplyForLevel(true);
    }
  }, [queryResult, reset]);

  const utils = api.useUtils();
  const updateMutation = api.Voucher.update.useMutation({
    onSuccess: () => {
      utils.Voucher.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  const onSubmit: SubmitHandler<Voucher> = async formData => {
    if (queryResult?.id) {
      const result = await updateMutation.mutateAsync({
        where: { id: queryResult?.id },
        data: {
          ...formData
        }
      });
      if (result.code === 'OK') {
        NotifySuccess(result.message);
        setOpened(false);
      } else {
        NotifyError(result.message);
      }
    }
  };
  const generatePromotionCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setValue('code', code);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid>
        <Grid.Col span={8} className='h-fit'>
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
              <Group align='flex-end'>
                <Controller
                  control={control}
                  name='code'
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      required
                      flex={1}
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
                <Button
                  size='sm'
                  radius={'md'}
                  variant='subtle'
                  onClick={generatePromotionCode}
                  styles={{
                    root: {
                      border: '1px solid '
                    }
                  }}
                  classNames={{
                    root: `!rounded-md !border-[#e5e5e5] !font-bold text-black hover:bg-mainColor/10 hover:text-black data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-white`
                  }}
                >
                  Generate
                </Button>
              </Group>
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
          </Grid>
        </Grid.Col>
        <Grid.Col span={4} className='sticky top-0 h-fit'>
          <Paper withBorder className='bg-gray-100 dark:bg-dark-card' p={'lg'}>
            <Box>
              <Center className='my-3 flex items-center gap-5'>
                <Divider orientation='horizontal' color='dimmed' variant='dotted' w={'30%'} />
                <Text size='sm' c={'dimmed'}>
                  Options
                </Text>
                <Divider orientation='horizontal' color='dimmed' variant='dotted' w={'30%'} />
              </Center>
            </Box>
            <Stack>
              <Controller
                control={control}
                name='isActive'
                render={({ field }) => (
                  <Switch
                    label='Trạng thái (Ẩn / Hiện)'
                    error={errors.isActive?.message}
                    checked={field.value}
                    onChange={event => {
                      const checked = event.target.checked;
                      field.onChange(checked);
                    }}
                    thumbIcon={
                      !!field.value ? (
                        <IconCheck size={12} color='var(--mantine-color-teal-6)' stroke={3} />
                      ) : (
                        <IconX size={12} color='var(--mantine-color-red-6)' stroke={3} />
                      )
                    }
                  />
                )}
              />
              <Divider />
              <Controller
                control={control}
                name='applyAll'
                render={({ field }) => (
                  <Switch
                    thumbIcon={
                      !!field.value ? (
                        <IconCheck size={12} color='var(--mantine-color-teal-6)' stroke={3} />
                      ) : (
                        <IconX size={12} color='var(--mantine-color-red-6)' stroke={3} />
                      )
                    }
                    label='Áp dụng cho tất cả'
                    error={errors.applyAll?.message}
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              {!watch('applyAll') && (
                <>
                  <Checkbox
                    label='Áp dụng cho điểm người dùng'
                    checked={applyForLevel}
                    onChange={e => setApplyForLevel(e.target.checked)}
                  />
                  {applyForLevel && (
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
                  )}
                </>
              )}
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

      <Button type='submit' className='mt-8 w-full' loading={isSubmitting} disabled={!isDirty} fullWidth>
        Cập nhật
      </Button>
    </form>
  );
}
