'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, GridCol, NumberInput, Select, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { generateInvoiceNumber } from '~/lib/FuncHandler/generateInvoiceNumber';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { baseInvoiceSchema, InvoiceInput } from '~/shared/schema/invoice.schema';
import { api } from '~/trpc/react';

export default function InvoiceUpsert({
  invoiceId,
  setOpened
}: {
  invoiceId?: string;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: orders = [] } = api.Order.getAll.useQuery(undefined, { enabled: invoiceId !== '' });
  const { data: salers = [] } = api.User.getSaler.useQuery(undefined, { enabled: invoiceId !== '' });
  const { data: invoiceData } = api.Invoice.getOne.useQuery({ id: invoiceId || '' }, { enabled: invoiceId !== '' });
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<InvoiceInput>({
    resolver: zodResolver(baseInvoiceSchema),
    defaultValues: {
      id: undefined,
      orderId: undefined,
      sellerId: undefined,
      customerId: null,
      invoiceNumber: undefined,
      buyerName: undefined,
      buyerEmail: null,
      buyerPhone: null,
      buyerAddress: null,
      buyerTaxCode: null,
      subTotal: 0,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 0,
      currency: 'VND',
      paymentMethod: 'VNPAY',
      note: null,
      issuedAt: new Date(),
      paidAt: null,
      dueDate: null
    }
  });
  const orderId = watch('orderId');
  const utils = api.useUtils();
  const mutation = api.Invoice.upsert.useMutation({
    onSuccess: () => {
      utils.Invoice.invalidate();
      setOpened(false);
      NotifySuccess('Chúc mừng bạn đã thao tác thành công.');
    },
    onError: e => {
      NotifyError(e?.message || 'Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  });

  useEffect(() => {
    const invoiceNumberGen = generateInvoiceNumber();
    if (!invoiceData) {
      setValue('invoiceNumber', invoiceNumberGen);
      return;
    }
    reset({
      ...invoiceData,
      orderId: invoiceData?.orderId || undefined,
      invoiceNumber: invoiceData?.invoiceNumber || invoiceNumberGen
    });
  }, [invoiceData, reset]);

  useEffect(() => {
    const currentOrder = orders?.find(({ id }) => id === orderId);
    if (currentOrder) {
      const currentFormData = getValues();
      reset({
        ...currentFormData,
        customerId: currentFormData?.customerId || currentOrder?.user?.id,
        buyerName: currentFormData?.buyerName || currentOrder?.user?.name,
        buyerEmail: currentFormData?.buyerEmail || currentOrder?.user?.email,
        buyerPhone: currentFormData?.buyerPhone || currentOrder?.user?.phone,
        buyerAddress:
          currentFormData?.buyerAddress ||
          currentOrder?.user?.address?.fullAddress ||
          currentOrder?.delivery?.address?.fullAddress,
        subTotal: currentFormData?.subTotal || currentOrder?.originalTotal || 0,
        taxAmount: 0,
        discountAmount: currentFormData?.discountAmount || currentOrder?.discountAmount || 0,
        totalAmount: currentFormData?.totalAmount || currentOrder?.finalTotal || 0
      });
    }
  }, [orderId]);

  const onSubmit: SubmitHandler<InvoiceInput> = async formData => {
    try {
      await mutation.mutateAsync(formData);
    } catch {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid gutter='md'>
        <GridCol span={6}>
          <Controller
            control={control}
            name='orderId'
            render={({ field }) => (
              <Select
                label='Đơn hàng'
                placeholder='Chọn Đơn hàng'
                searchable
                data={orders?.map(order => ({
                  value: order.id,
                  label: `DH-${order.id}`
                }))}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.orderId?.message}
              />
            )}
          />
        </GridCol>
        <GridCol span={6}>
          <Controller
            control={control}
            name='sellerId'
            render={({ field }) => (
              <Select
                label='Saler'
                placeholder='Chọn Saler'
                searchable
                data={salers?.map(sale => ({
                  value: sale.id,
                  label: sale.name + `  (${sale?.role?.name})`
                }))}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.sellerId?.message}
              />
            )}
          />
        </GridCol>
        <GridCol span={6}>
          <Controller
            control={control}
            name='invoiceNumber'
            render={({ field }) => (
              <TextInput
                {...field}
                label='Số hóa đơn'
                placeholder='INV-YYYYMMDD-XXX'
                error={errors.invoiceNumber?.message}
              />
            )}
          />
        </GridCol>

        <GridCol span={6}>
          <Controller
            control={control}
            name='buyerName'
            render={({ field }) => (
              <TextInput
                {...field}
                label='Tên khách hàng / Công ty'
                placeholder='Nhập tên người mua hàng'
                error={errors.buyerName?.message}
              />
            )}
          />
        </GridCol>

        <GridCol span={4}>
          <Controller
            control={control}
            name='buyerEmail'
            render={({ field }) => (
              <TextInput
                {...field}
                value={field.value ?? ''}
                label='Email'
                placeholder='example@gmail.com'
                error={errors.buyerEmail?.message}
              />
            )}
          />
        </GridCol>

        <GridCol span={4}>
          <Controller
            control={control}
            name='buyerPhone'
            render={({ field }) => (
              <TextInput
                {...field}
                value={field.value ?? ''}
                label='Số điện thoại'
                placeholder='09xxx...'
                error={errors.buyerPhone?.message}
              />
            )}
          />
        </GridCol>

        <GridCol span={4}>
          <Controller
            control={control}
            name='buyerTaxCode'
            render={({ field }) => (
              <TextInput
                {...field}
                value={field.value ?? ''}
                label='Mã số thuế'
                placeholder='MST cá nhân/doanh nghiệp'
                error={errors.buyerTaxCode?.message}
              />
            )}
          />
        </GridCol>

        <GridCol span={3}>
          <Controller
            control={control}
            name='subTotal'
            render={({ field }) => (
              <NumberInput
                label='Tạm tính'
                thousandSeparator=','
                suffix=' ₫'
                value={field.value}
                onChange={val => field.onChange(Number(val))}
                error={errors.subTotal?.message}
              />
            )}
          />
        </GridCol>

        <GridCol span={3}>
          <Controller
            control={control}
            name='discountAmount'
            render={({ field }) => (
              <NumberInput
                label='Giảm giá'
                thousandSeparator=','
                suffix=' ₫'
                value={field.value}
                onChange={val => field.onChange(Number(val))}
                error={errors.discountAmount?.message}
              />
            )}
          />
        </GridCol>

        <GridCol span={3}>
          <Controller
            control={control}
            name='taxAmount'
            render={({ field }) => (
              <NumberInput
                label='Thuế (VAT)'
                thousandSeparator=','
                suffix=' ₫'
                value={field.value}
                onChange={val => field.onChange(Number(val))}
                error={errors.taxAmount?.message}
              />
            )}
          />
        </GridCol>

        <GridCol span={3}>
          <Controller
            control={control}
            name='totalAmount'
            render={({ field }) => (
              <NumberInput
                label='Tổng cộng'
                fw={700}
                variant='filled'
                thousandSeparator=','
                suffix=' ₫'
                value={field.value}
                onChange={val => field.onChange(Number(val))}
                error={errors.totalAmount?.message}
              />
            )}
          />
        </GridCol>

        <GridCol span={6}>
          <Controller
            control={control}
            name='paymentMethod'
            render={({ field }) => (
              <Select
                {...field}
                label='Phương thức thanh toán'
                data={[
                  { value: 'VNPAY', label: 'VNPAY (Online)' },
                  { value: 'CASH', label: 'Tiền mặt (COD)' },
                  { value: 'BANK_TRANSFER', label: 'Chuyển khoản' }
                ]}
                error={errors.paymentMethod?.message}
              />
            )}
          />
        </GridCol>

        <GridCol span={6}>
          <Controller
            control={control}
            name='dueDate'
            render={({ field }) => (
              <DateTimePicker
                {...field}
                label='Hạn thanh toán'
                placeholder='Chọn ngày'
                error={errors.dueDate?.message}
              />
            )}
          />
        </GridCol>
      </Grid>
      <Button type='submit' className='mt-4' loading={isSubmitting} fullWidth disabled={!isDirty}>
        Tạo mới / Cập nhật
      </Button>
    </form>
  );
}
