'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Card, Center, Grid, GridCol, PasswordInput, Select, Text, TextInput, Title } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { Gender, UserLevel } from '@prisma/client';
import { IconCalendar, IconInfoCircle, IconKey, IconMail, IconPhone } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import OtpModal from '~/components/Modals/ModalOtp';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { UserInput, userInputSchema } from '~/shared/user.schema';
import { api } from '~/trpc/react';
import { TRPCErrorCode } from '~/types/ResponseFetcher';
import AddressSection from '../../../../components/AdressSection';

export default function Page() {
  const [opened, { open, close }] = useDisclosure();
  const [error, setError] = useState<{ code: TRPCErrorCode | undefined; message: string }>({
    code: undefined,
    message: ''
  });

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<UserInput>({
    resolver: zodResolver(userInputSchema),
    mode: 'onChange',
    defaultValues: {
      id: '',
      name: '',
      email: '',
      image: undefined,
      gender: Gender.OTHER,
      dateOfBirth: new Date(),
      isActive: true,
      password: '',
      phone: '',
      address: undefined,
      pointUser: 0,
      level: UserLevel.BRONZE
    }
  });

  const mutation = api.User.create.useMutation({
    onSuccess: () => {
      open();
    },
    onError: e => {
      setError({
        code: e.data?.code,
        message: e.message
      });
      NotifyError(e.message);
    }
  });

  const onSubmit: SubmitHandler<UserInput> = async formData => {
    console.log(formData);
    try {
      await mutation.mutateAsync({
        ...formData,
        image: {
          fileName: '',
          base64: ''
        }
      });
    } catch {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  };
  const updateMutation = api.User.updateAny.useMutation({
    onSuccess: () => {
      NotifySuccess('Xác thực tài khoản thành công!');
      window.location.href = '/dang-nhap';
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Center my={'md'}>
          <Card
            className='animate-fadeUp'
            w={{ base: '100%', sm: '50vw', md: '40vw' }}
            h={'max-content'}
            py={'xs'}
            shadow='xl'
            radius={'md'}
          >
            <Card.Section p='md'>
              <Grid w={'100%'}>
                <GridCol span={12} className='flex justify-center'>
                  <Title className='font-quicksand text-black dark:text-dark-text' order={2} size={28}>
                    ĐĂNG KÍ
                  </Title>
                </GridCol>
                {error.code && (
                  <GridCol span={12} className='flex justify-center'>
                    <Alert
                      w={'100%'}
                      radius={'md'}
                      variant='light'
                      color='yellow'
                      title='Cảnh báo'
                      icon={<IconInfoCircle />}
                    >
                      {error.message}{' '}
                      {error.code === 'NOT_IMPLEMENTED' && (
                        <Link href={`/password/verify-email?email=${getValues('email')}`}>
                          <BButton variant='outline'>Kích hoạt</BButton>
                        </Link>
                      )}
                    </Alert>
                  </GridCol>
                )}
                <GridCol span={6}>
                  <Controller
                    control={control}
                    name='name'
                    render={({ field }) => (
                      <TextInput
                        radius={'md'}
                        withAsterisk
                        label='Họ tên'
                        placeholder='Họ tên'
                        {...field}
                        error={errors.name?.message}
                      />
                    )}
                  />
                </GridCol>

                <GridCol span={6}>
                  <Controller
                    control={control}
                    name='email'
                    render={({ field }) => (
                      <TextInput
                        radius={'md'}
                        withAsterisk
                        leftSection={<IconMail size={18} stroke={1.5} />}
                        placeholder='E-mail'
                        type='email'
                        label='E-mail'
                        {...field}
                        error={errors.email?.message}
                      />
                    )}
                  />
                </GridCol>
                <GridCol span={6}>
                  <Controller
                    control={control}
                    name='phone'
                    render={({ field }) => (
                      <TextInput
                        radius={'md'}
                        {...field}
                        withAsterisk
                        label='Số điện thoại'
                        leftSection={<IconPhone size={18} stroke={1.5} />}
                        placeholder='Số điện thoại'
                        error={errors.phone?.message}
                      />
                    )}
                  />
                </GridCol>
                <GridCol span={6}>
                  <Controller
                    control={control}
                    name='password'
                    render={({ field }) => (
                      <PasswordInput
                        radius={'md'}
                        label='Mật khẩu'
                        withAsterisk
                        leftSection={<IconKey size={18} stroke={1.5} />}
                        placeholder='Nhập mặt khẩu'
                        {...field}
                        error={errors.password?.message}
                      />
                    )}
                  />
                </GridCol>
                <GridCol span={6}>
                  <Controller
                    control={control}
                    name='dateOfBirth'
                    render={({ field }) => {
                      const dateValue = field.value ? new Date(field.value) : null;
                      return (
                        <DateTimePicker
                          radius={'md'}
                          valueFormat='DD-MM-YYYY'
                          leftSection={<IconCalendar size={18} stroke={1.5} />}
                          dropdownType='modal'
                          label='Năm sinh'
                          placeholder='Chọn năm sinh'
                          {...field}
                          value={dateValue}
                        />
                      );
                    }}
                  />
                </GridCol>
                <GridCol span={6}>
                  <Controller
                    control={control}
                    name='gender'
                    render={({ field }) => (
                      <Select
                        label='Giới tính'
                        searchable
                        radius={'md'}
                        placeholder='Giới tính'
                        {...field}
                        data={[
                          { value: Gender.MALE, label: 'Nam' },
                          { value: Gender.FEMALE, label: 'Nữ' },
                          { value: Gender.OTHER, label: 'Khác' }
                        ]}
                      />
                    )}
                  />
                </GridCol>
                <AddressSection control={control} setValue={setValue} />

                <GridCol span={12} className='flex justify-end'>
                  <Link href={'/dang-nhap'}>
                    <Text
                      fw={700}
                      className='cursor-pointer text-mainColor hover:text-subColor dark:text-dark-text dark:hover:text-mainColor'
                      size='sm'
                    >
                      Bạn đã có tài khoản?
                    </Text>
                  </Link>
                </GridCol>
                <GridCol span={12}>
                  <BButton
                    disabled={!isDirty}
                    loading={isSubmitting}
                    type='submit'
                    fullWidth
                    size='md'
                    children={'ĐĂNG KÍ'}
                  />
                </GridCol>
              </Grid>
            </Card.Section>
          </Card>
        </Center>
      </form>
      <OtpModal
        opened={opened}
        onClose={close}
        email={getValues('email')}
        timeExpiredMinutes={3}
        onAfterVerify={async () => {
          await updateMutation.mutateAsync({
            where: {
              email: getValues('email')
            },
            data: {
              isVerified: true
            }
          });
        }}
      />
    </>
  );
}
