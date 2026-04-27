'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, GridCol, Select, Textarea, TextInput } from '@mantine/core';
import { TypeContact } from '@prisma/client';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { baseContactSchema, ContactInput } from '~/shared/schema/contact.schema';
import { api } from '~/trpc/react';
const ContactTypeOptions = {
  [TypeContact.COLLABORATION]: { viName: 'Hợp tác' },
  [TypeContact.FEEDBACK]: { viName: 'Phản hồi' },
  [TypeContact.SUPPORT]: { viName: 'Hỗ trợ' },
  [TypeContact.OTHER]: { viName: 'Khác' }
};

export const FormContact = () => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, isDirty }
  } = useForm<ContactInput>({
    resolver: zodResolver(baseContactSchema),
    mode: 'onChange',
    defaultValues: {
      id: undefined,
      fullName: '',
      phone: '',
      type: TypeContact.COLLABORATION,
      email: '',
      subject: undefined,
      message: '',
      responded: false
    }
  });
  const createMutation = api.Contact.upsert.useMutation({
    onSuccess: () => {
      reset();
      NotifySuccess('Gửi thành công!', 'Biểu mẫu đã được gửi đến nhà hàng.');
    },
    onError: error => {
      NotifyError(error.message);
    }
  });
  const onSubmit: SubmitHandler<ContactInput> = async formData => {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid>
        <GridCol span={12}>
          <Controller
            control={control}
            name='fullName'
            render={({ field, fieldState }) => (
              <TextInput {...field} placeholder='Tên' withAsterisk error={fieldState.error?.message} />
            )}
          />
        </GridCol>
        <GridCol span={{ base: 12, sm: 8 }}>
          <Controller
            control={control}
            name='phone'
            render={({ field, fieldState }) => (
              <TextInput {...field} placeholder='Số điện thoại' withAsterisk error={fieldState.error?.message} />
            )}
          />
        </GridCol>
        <GridCol span={{ base: 12, sm: 4 }}>
          <Controller
            control={control}
            name='type'
            defaultValue={TypeContact.COLLABORATION}
            render={({ field, fieldState }) => (
              <Select
                {...field}
                data={Object.entries(ContactTypeOptions).map(([key, value]) => ({ value: key, label: value.viName }))}
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
              <TextInput {...field} placeholder='E-mail' withAsterisk error={fieldState.error?.message} />
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
                error={fieldState.error?.message}
              />
            )}
          />
        </GridCol>
        <GridCol span={12}>
          <Button type='submit' radius={'xl'} children={' Gửi thông tin'} loading={isSubmitting} disabled={!isDirty} />
        </GridCol>
      </Grid>
    </form>
  );
};
