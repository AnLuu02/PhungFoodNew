'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid, GridCol, Select, Textarea, TextInput } from '@mantine/core';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { TypeContact } from '~/lib/zod/EnumType';
import { contactSchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { Contact } from '~/types/contact';

export const FormContact = ({ user }: any) => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, isDirty }
  } = useForm<Contact>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
    defaultValues: {
      id: '',
      fullName: '',
      phone: '',
      type: TypeContact.COLLABORATION,
      email: '',
      subject: '',
      message: '',
      responded: false
    }
  });
  const createMutation = api.Contact.create.useMutation({
    onSuccess: result => {
      reset();
      NotifySuccess('Gửi thành công!', 'Biểu mẫu đã được gửi đến nhà hàng.');
    },
    onError: error => {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.', error.message);
    }
  });
  const onSubmit: SubmitHandler<Contact> = async formData => {
    try {
      if (formData?.email === process.env.NEXT_PUBLIC_EMAIL_RESTAURANT) {
        setError('email', { message: 'Email không hợp lệ. Đây là email nhà hàng.' });
        return;
      }
      await createMutation.mutateAsync(formData);
    } catch {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  };

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.name,
        email: user.email
      });
    }
  }, [user]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid>
        <GridCol span={12}>
          <Controller
            control={control}
            name='fullName'
            render={({ field, fieldState }) => (
              <TextInput {...field} radius='md' placeholder='Tên' withAsterisk error={fieldState.error?.message} />
            )}
          />
        </GridCol>
        <GridCol span={8}>
          <Controller
            control={control}
            name='phone'
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                radius='md'
                placeholder='Số điện thoại'
                withAsterisk
                error={fieldState.error?.message}
              />
            )}
          />
        </GridCol>
        <GridCol span={4}>
          <Controller
            control={control}
            name='type'
            defaultValue={TypeContact.COLLABORATION}
            render={({ field, fieldState }) => (
              <Select
                {...field}
                radius={'md'}
                data={Object.entries(TypeContact).map(([key, value]) => ({ value: key, label: value }))}
                placeholder='Loại'
                withAsterisk
                error={fieldState.error?.message}
              />
            )}
          />
        </GridCol>
        <GridCol span={12}>
          <Controller
            control={control}
            name='email'
            render={({ field, fieldState }) => (
              <TextInput {...field} radius='md' placeholder='E-mail' withAsterisk error={fieldState.error?.message} />
            )}
          />
        </GridCol>
        <GridCol span={12}>
          <Controller
            control={control}
            name='message'
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                resize='vertical'
                placeholder='Tin nhắn'
                withAsterisk
                radius={'md'}
                error={fieldState.error?.message}
              />
            )}
          />
        </GridCol>
        <GridCol span={12}>
          <BButton
            size='sm'
            type='submit'
            radius={'xl'}
            children={' Gửi thông tin'}
            loading={isSubmitting}
            disabled={!isDirty}
          />
        </GridCol>
      </Grid>
    </form>
  );
};
