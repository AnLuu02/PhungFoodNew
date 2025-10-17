'use client';

import { Divider, PasswordInput, Stack, Text } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import BButton from '~/components/Button/Button';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { api } from '~/trpc/react';

export default function ResetPasswordSection({ email, token }: { email: string | null; token: string | null }) {
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
    resetPassword.mutate({ email: email || '', password, token: token || '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={'xs'}>
        <Text size='sm'>Tạo mật khẩu mới cho tài khoản của bạn</Text>
        <PasswordInput
          type='password'
          label={'Mật khẩu mới'}
          radius={'md'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          placeholder='Mật khẩu mới'
        />
        <PasswordInput
          type='password'
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          placeholder='Xác nhận mật khẩu mới'
          label={'Xác nhận mật khẩu mới'}
          radius={'md'}
          error={confirmPassword !== '' && password !== confirmPassword ? 'Mật khẩu không khớp' : ''}
        />
        <Divider my={'xs'} />

        <BButton
          disabled={!confirmPassword || password !== confirmPassword}
          radius='md'
          loading={loading}
          type='submit'
          fullWidth
          size='md'
          children={'Xác nhận'}
        />
      </Stack>
    </form>
  );
}
