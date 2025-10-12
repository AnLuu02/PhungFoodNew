'use client';

import { Alert, Button, Divider, Group, PinInput, Stack, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import BButton from '~/components/Button';
import { hashPassword } from '~/lib/func-handler/hashPassword';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { api } from '~/trpc/react';
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function VerifySection({
  email,
  timeExpiredMinutes,
  setPeriod
}: {
  email: string;
  timeExpiredMinutes?: number;
  setPeriod: any;
}) {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState((timeExpiredMinutes || 3) * 60);
  const [loading, setLoading] = useState<{ type: 'submit' | 'resend'; value: boolean } | null>(null);
  const verifyOtp = api.User.verifyOtp.useMutation({
    onSuccess: async () => {
      const hashToken = await hashPassword(otp);
      //   window.location.href = `/auth/reset-password?email=${encodeURIComponent(email)}&token=${hashToken}`;

      NotifySuccess('Xác thực OTP thành công!');
      setPeriod({ type: 'reset', email: email, token: hashToken });
      setLoading({ type: 'submit', value: false });
    },
    onError: error => {
      NotifyError(error.message);
      setTimeLeft(0);
      setLoading({ type: 'submit', value: false });
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    if (otp.length !== 6) {
      NotifyError('Vui lòng nhập đầy đủ 6 chữ số.');
      return;
    }
    setLoading({ type: 'submit', value: true });
    verifyOtp.mutate({ email, otp });
  };

  const requestPasswordReset = api.User.requestPasswordReset.useMutation({
    onSuccess: () => {
      setLoading({ type: 'resend', value: false });
      NotifySuccess('Mã OTP đã được gửi lại!');
      setOtp('');
      setTimeLeft((timeExpiredMinutes || 3) * 60);
    },
    onError: error => {
      setLoading({ type: 'resend', value: false });
      NotifyError(error.message);
    }
  });

  return (
    <Stack gap={'xs'}>
      <Text size='sm'>Chúng tôi đã gửi mã xác thực đến email:</Text>
      <Text fw={700}>{email.slice(0, 3) + '***' + email.slice(email.length - 11)}</Text>
      <Text size='sm'>Vui lòng kiểm tra hộp thư đến hoặc thư rác</Text>
      <Text size='sm'>
        Mã xác thực (6 số) <b className='text-mainColor'>{formatTime(timeLeft)}</b>
      </Text>
      <PinInput length={6} value={otp} onChange={setOtp} error={timeLeft === 0} />
      <Divider my={'xs'} />
      <BButton
        radius='md'
        fullWidth
        size='md'
        onClick={handleSubmit}
        disabled={timeLeft === 0}
        loading={loading?.type === 'submit' && loading.value}
        label={' Xác thục'}
      />
      <Group justify='center' gap={3} align='center'>
        <Text size='sm'>Không nhận được mã OTP?</Text>
        <Button
          w={'max-content'}
          variant='subtle'
          disabled={timeLeft !== 0}
          loading={loading?.type === 'resend' && loading.value}
          onClick={() => {
            setLoading({ type: 'resend', value: true });
            requestPasswordReset.mutate({ email, timeExpiredMinutes });
          }}
        >
          Gửi lại
        </Button>
      </Group>
      {timeLeft === 0 && (
        <Alert
          variant='light'
          color='yellow'
          title='Mã OTP đã hết hạn. Vui lòng thử lại.'
          icon={<IconInfoCircle />}
        ></Alert>
      )}
    </Stack>
  );
}
