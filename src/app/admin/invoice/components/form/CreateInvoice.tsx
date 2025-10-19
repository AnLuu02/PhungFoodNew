'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, GridCol, Select, TextInput } from '@mantine/core';
import type { Dispatch, SetStateAction } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { invoiceSchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { Invoice } from '~/types/invoice';

export default function CreateInvoice({
  invoiceOrderIds,
  setOpened
}: {
  invoiceOrderIds: any;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: orders } = api.Order.getAll.useQuery();
  const { data: salers } = api.User.getSaler.useQuery();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<Invoice>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      id: '',
      orderId: '',
      salerId: '',
      invoiceNumber: '',
      status: 'PAID',
      currency: 'VND',
      taxCode: ''
    }
  });

  const utils = api.useUtils();
  const mutation = api.Invoice.create.useMutation();

  const onSubmit: SubmitHandler<Invoice> = async formData => {
    try {
      const result = await mutation.mutateAsync(formData);
      if (result.code !== 'OK') {
        NotifyError(result.message);
        utils.Invoice.invalidate();
        return;
      }
      setOpened(false);
      NotifySuccess(result.message);
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
                radius='md'
                data={orders?.map(order => ({
                  value: order.id,
                  label: `DH-${order.id}`,
                  disabled: invoiceOrderIds.includes(order.id)
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
            name='salerId'
            render={({ field }) => (
              <Select
                label='Saler'
                placeholder='Chọn Saler'
                searchable
                radius='md'
                data={salers?.map(sale => ({
                  value: sale.id,
                  label: sale.name + `  (${sale?.role?.name})`
                }))}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.salerId?.message}
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
                label='Số hóa đơn'
                withAsterisk
                placeholder='Số hóa đơn'
                {...field}
                error={errors.invoiceNumber?.message}
              />
            )}
          />
        </GridCol>
        <GridCol span={6}>
          <Controller
            control={control}
            name='status'
            render={({ field }) => (
              <Select
                label='Trạng thái'
                placeholder='Chọn Trạng thái'
                searchable
                radius='md'
                data={[
                  {
                    value: 'PAID',
                    label: 'Hoàn thành'
                  },
                  {
                    value: 'PENDING',
                    label: 'Chưa hoàn thành'
                  },
                  {
                    value: 'CANCELLED',
                    label: 'Đã hủy'
                  }
                ]}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.status?.message}
              />
            )}
          />
        </GridCol>
        <GridCol span={6}>
          <Controller
            control={control}
            name='currency'
            defaultValue='VND'
            render={({ field }) => (
              <Select
                label='Tiền tệ'
                placeholder='Chọn Tiền tệ'
                searchable
                radius='md'
                data={[
                  {
                    value: 'VND',
                    label: 'VND'
                  },
                  {
                    value: 'USD',
                    label: 'USD'
                  },
                  {
                    value: 'EURO',
                    label: 'EURO'
                  }
                ]}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.currency?.message}
              />
            )}
          />
        </GridCol>

        <GridCol span={6}>
          <Controller
            control={control}
            name='taxCode'
            render={({ field }) => (
              <TextInput label='Mã số thuế' placeholder='Mã số thuế' {...field} error={errors.taxCode?.message} />
            )}
          />
        </GridCol>
      </Grid>
      <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth disabled={!isDirty}>
        Cập nhật
      </Button>
    </form>
  );
}
