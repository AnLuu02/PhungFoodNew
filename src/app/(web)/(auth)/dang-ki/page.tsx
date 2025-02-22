'use client';
import { DatePickerInput } from '@mantine/dates';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Center, Grid, GridCol, Input, PasswordInput, rem, Select, Text, Title } from '@mantine/core';
import { Gender, UserLevel, UserRole } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import useSWR from 'swr';
import { User } from '~/app/Entity/UserEntity';
import fetcher from '~/app/lib/utils/func-handler/fetcher';
import { NotifyError, NotifySuccess } from '~/app/lib/utils/func-handler/toast';
import { userSchema } from '~/app/lib/utils/zod/zodShcemaForm';
import { api } from '~/trpc/react';

export default function Page() {
  const router = useRouter();
  const { data: provinces } = useSWR<any>(`https://api.vnappmob.com/api/v2/province/`, fetcher);

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(userSchema),
    mode: 'onChange',
    defaultValues: {
      id: '',
      name: '',
      email: '',
      image: undefined,
      gender: Gender.OTHER,
      dateOfBirth: new Date(),
      password: '',
      phone: '',
      role: UserRole.CUSTOMER,
      address: '',
      pointLevel: 0,
      level: UserLevel.DONG
    }
  });

  const mutation = api.User.create.useMutation();

  const onSubmit: SubmitHandler<User> = async formData => {
    try {
      if (formData) {
        const result = await mutation.mutateAsync({
          ...formData,
          image: {
            fileName: '',
            base64: ''
          }
        });
        if (result.success) {
          NotifySuccess('Thành công!', `${result.message}`);
          router.push('/dang-nhap');
        } else {
          NotifyError('Cảnh báo!', `${result.message}`);
        }
      }
    } catch (error) {
      NotifyError('Error created Category');
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Center my={'md'}>
        <Card
          w={{ base: '100%', sm: '50vw', md: '40vw', lg: '30vw' }}
          h={'max-content'}
          py={'xs'}
          shadow='xl'
          radius={'md'}
        >
          <Card.Section p='md'>
            <Grid w={'100%'}>
              <GridCol span={12} className='flex justify-center'>
                <Title className='font-quicksand' order={2} size={rem(28)} c={'black'}>
                  ĐĂNG KÍ
                </Title>
              </GridCol>
              <GridCol span={12}>
                <Controller
                  control={control}
                  name='name'
                  render={({ field }) => <Input placeholder='Họ tên' {...field} error={errors.name?.message} />}
                />
              </GridCol>

              <GridCol span={12}>
                <Controller
                  control={control}
                  name='email'
                  render={({ field }) => (
                    <Input placeholder='E-mail, số điện thoại' {...field} error={errors.email?.message} />
                  )}
                />
              </GridCol>
              <GridCol span={12}>
                <Controller
                  control={control}
                  name='phone'
                  render={({ field }) => <Input placeholder='Số điện thoại' {...field} error={errors.phone?.message} />}
                />
              </GridCol>
              <GridCol span={12}>
                <Controller
                  control={control}
                  name='password'
                  render={({ field }) => (
                    <PasswordInput placeholder='Nhập mặt khẩu' {...field} error={errors.password?.message} />
                  )}
                />
              </GridCol>
              {/* <GridCol span={12}>
                <Controller
                  control={control}
                  name='password'
                  render={({ field }) => (
                    <PasswordInput
                      
                      placeholder='Xác nhận mật khẻu'
                      {...field}
                      error={errors.password?.message}
                    />
                  )}
                />
              </GridCol> */}
              <GridCol span={12}>
                <Controller
                  control={control}
                  name='dateOfBirth'
                  render={({ field }) => {
                    const dateValue = field.value ? new Date(field.value) : null;
                    return <DatePickerInput placeholder='Chọn năm sinh' {...field} value={dateValue} />;
                  }}
                />
              </GridCol>
              <GridCol span={12}>
                <Controller
                  control={control}
                  name='gender'
                  render={({ field }) => (
                    <Select
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
              <GridCol span={12}>
                <Controller
                  control={control}
                  name='address'
                  render={({ field }) => (
                    <Select
                      placeholder=' Chọn tỉnh thành'
                      data={provinces?.results?.map((item: any) => ({
                        value: item.province_id,
                        label: item.province_name
                      }))}
                      nothingFoundMessage='Nothing found...'
                      {...field}
                    />
                  )}
                />
              </GridCol>
              <GridCol span={12} className='flex justify-end'>
                <Link href={'/dang-nhap'} className='text-white'>
                  <Text size='sm' className='cursor-pointer text-black underline hover:text-red-500'>
                    Bạn đã có tài khoản?
                  </Text>
                </Link>
              </GridCol>
              <GridCol span={12}>
                <Button
                  fullWidth
                  size='md'
                  className='bg-[#008b4b] text-white transition-all duration-200 ease-in-out hover:bg-[#f8c144] hover:text-black'
                  type='submit'
                  loading={isSubmitting}
                >
                  ĐĂNG KÍ
                </Button>
              </GridCol>
            </Grid>
          </Card.Section>
        </Card>
      </Center>
    </form>
  );
}
