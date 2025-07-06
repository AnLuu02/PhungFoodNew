'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  Grid,
  GridCol,
  PasswordInput,
  rem,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { IconKey, IconMail } from '@tabler/icons-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { NotifyError } from '~/lib/func-handler/toast';
import LoginServices from '../components/LoginServices';

export default function Page() {
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string().min(1, 'Email là bắt buộc'),
        password: z.string().min(1, 'Password là bắt buộc')
      })
    ),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit: SubmitHandler<{ email: string; password: string }> = async formData => {
    setError('');
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok && result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Center my={'md'}>
        <Card
          w={{ base: '100%', sm: '50vw', md: '40vw', lg: '25vw' }}
          h={'max-content'}
          py={'xs'}
          shadow='xl'
          radius={'md'}
        >
          <Card.Section p={'md'}>
            <Grid>
              <GridCol span={12} className='flex justify-center'>
                <Title className='font-quicksand' size={rem(28)}>
                  ĐĂNG NHẬP
                </Title>
              </GridCol>
              <GridCol span={12}>
                <Controller
                  control={control}
                  name='email'
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      placeholder='E-mail'
                      type='email'
                      label='E-mail'
                      leftSection={<IconMail size={18} stroke={1.5} />}
                      onChange={e => {
                        field.onChange(e.target.value);
                        setError('');
                      }}
                      error={error !== '' || errors.email?.message}
                    />
                  )}
                />
              </GridCol>
              <GridCol span={12}>
                <Controller
                  control={control}
                  name='password'
                  render={({ field }) => (
                    <PasswordInput
                      {...field}
                      placeholder='Mật khẩu'
                      leftSection={<IconKey size={18} stroke={1.5} />}
                      onChange={e => {
                        field.onChange(e.target.value);
                        setError('');
                      }}
                      error={error !== '' || errors.password?.message}
                    />
                  )}
                />
                {error && (
                  <Text size='xs' className='text-red-500' mt={5}>
                    {error}
                  </Text>
                )}
              </GridCol>

              <GridCol span={12} className='flex justify-end'>
                <Link href={'/forgot-password'} className='text-sm text-black hover:text-red-500 dark:text-dark-text'>
                  Bạn quên mật khẩu?
                </Link>
              </GridCol>
            </Grid>

            <Grid>
              <GridCol span={12} className=''>
                <Button
                  fullWidth
                  size='md'
                  className='bg-mainColor text-white transition-all duration-200 ease-in-out hover:bg-subColor hover:text-black'
                  type='submit'
                  loading={isSubmitting}
                >
                  ĐĂNG NHẬP
                </Button>
              </GridCol>
              <GridCol span={12} className='flex justify-center'>
                <Flex align={'center'}>
                  <Text size='sm'>Bạn chưa có tài khoản?</Text>
                  <Link href={'/dang-ki'} className='text-white'>
                    <Text
                      className='cursor-pointer text-black underline hover:text-red-500 dark:text-dark-text'
                      size='sm'
                    >
                      Đăng ký ngay
                    </Text>
                  </Link>
                </Flex>
              </GridCol>
              <GridCol span={12} className='flex justify-center' mt={10}>
                <Flex align={'center'} gap={10}>
                  <Box w={100} h={1} className='bg-black opacity-20 dark:bg-dark-text'></Box>
                  <Text size='xs' className='text-black dark:text-dark-text' opacity={0.5}>
                    / HOẶC /
                  </Text>
                  <Box w={100} h={1} className='bg-black opacity-20 dark:bg-dark-text'></Box>
                </Flex>
              </GridCol>

              <GridCol span={12} className='flex justify-center'>
                <LoginServices />
              </GridCol>
            </Grid>
          </Card.Section>
        </Card>
      </Center>
    </form>
  );
}
