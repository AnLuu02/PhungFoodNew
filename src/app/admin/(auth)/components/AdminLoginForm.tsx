'use client';

import {
  Alert,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { IconAlertCircle, IconLock, IconMail } from '@tabler/icons-react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import LoginServices from '~/components/Auth/LoginServices';

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    setErrorMessage('');
    setIsLoading(true);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
      loginType: 'admin'
    });

    setIsLoading(false);

    if (res?.error) {
      setErrorMessage('Email hoặc mật khẩu admin không chính xác');
      return;
    }

    router.replace(callbackUrl);
    router.refresh();
  };

  return (
    <Box className='flex min-h-screen items-center justify-center px-4'>
      <Container size={420} w='100%'>
        <Paper withBorder radius='xl' p='xl' className='bg-white shadow-2xl'>
          <Stack gap='lg'>
            <Stack gap={4} ta='center'>
              <Title order={2}>Admin Portal</Title>
              <Text size='sm' c='dimmed'>
                Đăng nhập khu vực quản trị hệ thống
              </Text>
            </Stack>

            <Divider label='Admin Access' labelPosition='center' />

            {errorMessage && (
              <Alert color='red' icon={<IconAlertCircle size={18} />} radius='lg'>
                {errorMessage}
              </Alert>
            )}

            <Stack gap='md'>
              <TextInput
                label='Email admin'
                placeholder='admin@example.com'
                value={email}
                onChange={e => setEmail(e.currentTarget.value)}
                leftSection={<IconMail size={18} />}
                radius='lg'
              />

              <PasswordInput
                label='Mật khẩu'
                placeholder='Nhập mật khẩu admin'
                value={password}
                onChange={e => setPassword(e.currentTarget.value)}
                leftSection={<IconLock size={18} />}
                radius='lg'
              />

              <Button fullWidth radius='lg' size='md' loading={isLoading} onClick={handleSubmit}>
                Đăng nhập Admin
              </Button>
              <Center mt={'sm'} mb={'md'}>
                <Divider
                  variant='dashed'
                  size={'sm'}
                  w={'80%'}
                  classNames={{
                    root: 'border-mainColor'
                  }}
                  labelPosition='center'
                  label={
                    <>
                      <Box ml={5} className='italic'>
                        Options
                      </Box>
                    </>
                  }
                />
              </Center>
              <Center>
                <LoginServices />
              </Center>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
