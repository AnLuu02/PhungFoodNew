'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, Group, Radio, Select, TextInput } from '@mantine/core';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { createTag } from '~/lib/func-handler/generateTag';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { LocalPaymentType } from '~/lib/zod/EnumType';
import { paymentSchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { Payment } from '~/types/payment';

export default function UpdatePayment({ paymentId, setOpened }: { paymentId: string; setOpened: any }) {
  const queryResult = paymentId ? api.Payment.getOne.useQuery({ s: paymentId || '' }) : { data: null };
  const { data } = queryResult;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm<Payment>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      id: '',
      name: '',
      tag: '',
      type: LocalPaymentType.CREDIT_CARD,
      provider: '',
      isDefault: false
    }
  });

  useEffect(() => {
    if (data?.id) {
      reset({
        id: data?.id,
        name: data?.name,
        tag: data?.tag,
        type: data?.type,
        provider: data?.provider,
        isDefault: data?.isDefault
      });
    }
  }, [data, reset]);

  const utils = api.useUtils();
  const updateMutation = api.Payment.update.useMutation({
    onSuccess: () => {
      utils.Payment.invalidate();
    }
  });

  const onSubmit: SubmitHandler<Payment> = async formData => {
    try {
      if (paymentId) {
        const updatedFormData = { ...formData, tag: createTag(formData.name) };
        let result = await updateMutation.mutateAsync({ paymentId, ...updatedFormData });
        if (result.success) {
          NotifySuccess(result.message);
          setOpened(false);
        } else {
          NotifyError(result.message);
        }
      }
    } catch (error) {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
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
                label='Tên phương thức'
                placeholder='Nhập tên phương thức'
                error={errors.name?.message}
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <Controller
            control={control}
            name='type'
            render={({ field }) => (
              <Select
                label='Phương thức thanh toán'
                searchable
                placeholder='Chọn phương thức '
                data={[
                  { value: LocalPaymentType.CREDIT_CARD, label: 'Thẻ tín dụng' },
                  { value: LocalPaymentType.E_WALLET, label: 'Ví điện tử' }
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
            name='provider'
            render={({ field }) => (
              <Select
                label='Nhà cung cấp thanh toán'
                placeholder='Chọn phương thức thanh toán'
                searchable
                data={[
                  { value: 'momo', label: 'Momo' },
                  { value: 'zalopay', label: 'ZaloPay' },
                  { value: 'vnpay', label: 'VNPay' },
                  { value: 'paypal', label: 'PayPal' },
                  { value: 'visa', label: 'Visa' },
                  { value: 'mastercard', label: 'MasterCard' }
                ]}
                error={errors.provider?.message}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Controller
            control={control}
            name='isDefault'
            render={({ field }) => (
              <Radio.Group
                label='Phương thức thanh toán mặc định'
                error={errors.isDefault?.message}
                value={field.value ? 'true' : 'false'}
                onChange={value => field.onChange(value === 'true')}
              >
                <Group mt='xs'>
                  <Radio value='true' label='Có' />
                  <Radio value='false' label='Không' />
                </Group>
              </Radio.Group>
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
