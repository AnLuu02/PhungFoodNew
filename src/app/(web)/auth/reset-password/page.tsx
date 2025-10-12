'use client';

import { Card, Center, Grid, GridCol, PasswordInput, TextInput, Title } from '@mantine/core';
import { IconMail } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import BButton from '~/components/Button';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { api } from '~/trpc/react';
import PeriodControl from '../components/PeriodControl';

export default function ResetPassword({
  searchParams
}: {
  searchParams: {
    email: string;
    token: string;
  };
}) {
  const email = decodeURIComponent(searchParams?.email) || '';
  const { data: user } = useSession();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const resetPassword = api.User.resetPassword.useMutation({
    onSuccess: data => {
      NotifySuccess(data.message);
      setLoading(false);
      !user ? (window.location.href = '/auth/login') : (window.location.href = '/');
    },
    onError: error => {
      NotifyError(error.message);
      setLoading(false);
      !user
        ? (window.location.href = '/auth/password/forgot-password')
        : (window.location.href = '/auth/password/change-password');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (password !== confirmPassword) {
      NotifyError('Mật khẩu không khớp');
      setLoading(false);
      return;
    }
    resetPassword.mutate({ email, password, token: searchParams.token || '' });
  };

  return (
    <form onSubmit={handleSubmit}>
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
                <Title className='font-quicksand' size={28}>
                  Đặt lại mật khẩu
                </Title>
              </GridCol>
              <GridCol span={12}>
                <PeriodControl period={'reset'} />
              </GridCol>

              <GridCol span={12}>
                <TextInput
                  type='email'
                  value={email}
                  readOnly
                  placeholder='E-mail'
                  label='E-mail'
                  leftSection={<IconMail size={18} stroke={1.5} />}
                />
              </GridCol>

              <GridCol span={12}>
                <PasswordInput
                  type='password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  label='Mật khẩu mới'
                  radius={'md'}
                  placeholder='Mật khẩu mới'
                />
              </GridCol>
              <GridCol span={12}>
                <PasswordInput
                  type='password'
                  value={confirmPassword}
                  radius={'md'}
                  label='Xác nhận mật khẩu'
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  placeholder='Xác nhận mật khẩu mới'
                  error={confirmPassword !== '' && password !== confirmPassword ? 'Mật khẩu không khớp' : ''}
                />
              </GridCol>

              <GridCol span={12}>
                <BButton
                  radius='md'
                  loading={loading}
                  type='submit'
                  fullWidth
                  size='md'
                  label={'Xác nhận'}
                  disabled={!confirmPassword || password !== confirmPassword}
                />
              </GridCol>
            </Grid>
          </Card.Section>
        </Card>
      </Center>
    </form>
  );
}
