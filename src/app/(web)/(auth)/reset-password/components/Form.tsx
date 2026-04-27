'use client';

import { Button, Card, Center, Grid, GridCol, PasswordInput, TextInput, Title } from '@mantine/core';
import { IconMail } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { api } from '~/trpc/react';
import PeriodControl from '../../components/PeriodControl';

export default function FormResetPassword({ email, token }: { email: string; token: string }) {
  const { data: user } = useSession();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const resetPassword = api.User.resetPassword.useMutation({
    onSuccess: data => {
      NotifySuccess('Chúc mừng bạn thực hiện thao tác thành công.');
      setLoading(false);
      !user ? (window.location.href = '/dang-nhap') : (window.location.href = '/');
    },
    onError: error => {
      NotifyError(error.message);
      setLoading(false);
      !user
        ? (window.location.href = '/password/forgot-password')
        : (window.location.href = '/password/change-password');
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
    resetPassword.mutate({ email, password, token: token || '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Center my={'md'}>
        <Card w={{ base: '100%', sm: '50vw', md: '40vw', lg: '25vw' }} h={'max-content'} py={'xs'} shadow='xl'>
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
                  placeholder='Mật khẩu mới'
                />
              </GridCol>
              <GridCol span={12}>
                <PasswordInput
                  type='password'
                  value={confirmPassword}
                  label='Xác nhận mật khẩu'
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  placeholder='Xác nhận mật khẩu mới'
                  error={confirmPassword !== '' && password !== confirmPassword ? 'Mật khẩu không khớp' : ''}
                />
              </GridCol>

              <GridCol span={12}>
                <Button
                  loading={loading}
                  type='submit'
                  fullWidth
                  size='md'
                  children={'Xác nhận'}
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
