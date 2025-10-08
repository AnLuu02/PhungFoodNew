'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, Switch, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { createTag } from '~/lib/func-handler/generateTag';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { paymentSchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { Payment } from '~/types/payment';

export default function CreatePayment({ setOpened }: { setOpened: Dispatch<SetStateAction<boolean>> }) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<Payment>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      id: '',
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

  const [debouceName] = useDebouncedValue(watch('name'), 800);

  const utils = api.useUtils();
  const mutation = api.Payment.create.useMutation({
    onSuccess: () => {
      utils.Payment.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  useEffect(() => {
    const tagProvider = createTag(debouceName);
    setValue('provider', tagProvider);
  }, [debouceName]);

  const onSubmit: SubmitHandler<Payment> = async formData => {
    try {
      const result = await mutation.mutateAsync(formData);
      if (result.code === 'OK') {
        NotifySuccess(result.message);
        setOpened(false);
      } else {
        NotifyError(result.message);
      }
    } catch {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid gutter='md'>
        <Controller
          control={control}
          name='id'
          render={({ field }) => (
            <TextInput {...field} label='id' placeholder='Nhập id' error={errors.name?.message} className='hidden' />
          )}
        />
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='name'
            render={({ field }) => (
              <TextInput
                {...field}
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
            name='provider'
            render={({ field }) => (
              <TextInput
                {...field}
                readOnly
                label='Nhà cung cấp (tự tạo theo tên)'
                placeholder='Nhà cung cấp'
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
              <TextInput {...field} label='API Key' placeholder='Nhập API Key' error={errors.name?.message} />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='secretKey'
            render={({ field }) => (
              <TextInput {...field} label='Secret Key' placeholder='Nhập Secret Key' error={errors.name?.message} />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='clientId'
            render={({ field }) => (
              <TextInput {...field} label='Client ID' placeholder='Nhập Client ID' error={errors.name?.message} />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='clientSecret'
            render={({ field }) => (
              <TextInput
                {...field}
                label=' Client Secret'
                placeholder='Nhập   Client Secret'
                error={errors.name?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='webhookUrl'
            render={({ field }) => (
              <TextInput {...field} label='Webhook Url' placeholder='Nhập  Webhook Url' error={errors.name?.message} />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='webhookSecret'
            render={({ field }) => (
              <TextInput
                {...field}
                label='Webhook Secret'
                placeholder='Nhập  Webhook Secret'
                error={errors.name?.message}
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
      <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth disabled={!isDirty}>
        Tạo mới
      </Button>
    </form>
  );
}
