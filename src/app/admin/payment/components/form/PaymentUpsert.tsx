'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid, Switch, TextInput } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { basePaymentSchema, PaymentInput } from '~/shared/schema/payment.schema';
import { api } from '~/trpc/react';

export default function PaymentUpsert({
  paymentId,
  setOpened
}: {
  paymentId?: string;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const queryResult = api.Payment.getOne.useQuery({ id: paymentId || '' }, { enabled: !!paymentId });
  const { data } = queryResult;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset
  } = useForm<PaymentInput>({
    resolver: zodResolver(basePaymentSchema),
    defaultValues: {
      id: undefined,
      provider: '',
      name: '',
      apiKey: '',
      secretKey: '',
      clientId: '',
      clientSecret: '',
      webhookUrl: '',
      webhookSecret: '',
      isSandbox: true,
      isActive: true,
      metadata: undefined
    }
  });

  useEffect(() => {
    if (!data) return;
    reset({
      id: data?.id,
      provider: data?.provider,
      name: data?.name,
      apiKey: data?.apiKey || '',
      secretKey: data?.secretKey || '',
      clientId: data?.clientId || '',
      clientSecret: data?.clientSecret || '',
      webhookUrl: data?.webhookUrl || '',
      webhookSecret: data?.webhookSecret || '',
      isSandbox: data?.isSandbox,
      isActive: data?.isActive
    });
  }, [data, reset]);

  const utils = api.useUtils();
  const updateMutation = api.Payment.upsert.useMutation({
    onSuccess: () => {
      NotifySuccess('Chúc mừng bạn đã thao tác thành công.');
      setOpened(false);
      utils.Payment.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  console.log(errors);

  const onSubmit: SubmitHandler<PaymentInput> = async formData => {
    await updateMutation.mutateAsync(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid gutter='md'>
        <Controller
          control={control}
          name='id'
          render={({ field }) => (
            <TextInput
              radius='md'
              {...field}
              label='id'
              placeholder='Nhập id'
              error={errors.id?.message}
              className='hidden'
            />
          )}
        />
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='provider'
            render={({ field }) => (
              <TextInput
                {...field}
                radius='md'
                label='Nhà cung cấp'
                placeholder='Nhập Nhà cung cấp'
                error={errors.provider?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='name'
            render={({ field }) => (
              <TextInput
                {...field}
                radius='md'
                label='Tên phương thức'
                placeholder='Nhập Tên phương thức'
                error={errors.name?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='apiKey'
            render={({ field }) => (
              <TextInput
                radius='md'
                {...field}
                label='API Key'
                placeholder='Nhập API Key'
                error={errors.apiKey?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='secretKey'
            render={({ field }) => (
              <TextInput
                radius='md'
                {...field}
                label='Secret Key'
                placeholder='Nhập Secret Key'
                error={errors.secretKey?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='clientId'
            render={({ field }) => (
              <TextInput
                radius='md'
                {...field}
                label='Client ID'
                placeholder='Nhập Client ID'
                error={errors.clientId?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='clientSecret'
            render={({ field }) => (
              <TextInput
                radius='md'
                {...field}
                label=' Client Secret'
                placeholder='Nhập   Client Secret'
                error={errors.clientSecret?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='webhookUrl'
            render={({ field }) => (
              <TextInput
                radius='md'
                {...field}
                label='Webhook Url'
                placeholder='Nhập  Webhook Url'
                error={errors.webhookUrl?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='webhookSecret'
            render={({ field }) => (
              <TextInput
                radius='md'
                {...field}
                label='Webhook Secret'
                placeholder='Nhập  Webhook Secret'
                error={errors.webhookSecret?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
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
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='isSandbox'
            render={({ field }) => (
              <Switch
                label='Trạng thái (Thử nghiệm / Production)'
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
        </Grid.Col>
      </Grid>
      <BButton type='submit' className='mt-4' loading={isSubmitting} fullWidth disabled={!isDirty}>
        Cập nhật
      </BButton>
    </form>
  );
}
