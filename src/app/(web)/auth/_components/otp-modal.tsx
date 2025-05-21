'use client';

import { Button, Center, Group, Modal, PinInput, Text, Title } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { hashPassword } from '~/app/lib/utils/func-handler/hashPassword';
import { NotifyError, NotifySuccess } from '~/app/lib/utils/func-handler/toast';
import { api } from '~/trpc/react';

interface OtpModalProps {
  opened: boolean;
  onClose: () => void;
  email: string;
}

export default function OtpModal({ opened, onClose, email }: OtpModalProps) {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(60); // 5 phút
  const [loading, setLoading] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);

  const router = useRouter();

  const verifyOtp = api.User.verifyOtp.useMutation({
    onSuccess: async () => {
      NotifySuccess('Xác thực OTP thành công!');
      onClose();
      const hashToken = await hashPassword(otp);
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&token=${hashToken}`);
      setLoading(false);
    },
    onError: error => {
      NotifyError(error.message);
      setLoading(false);
    }
  });

  useEffect(() => {
    if (!opened) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [opened]);

  const handleSubmit = () => {
    if (otp.length !== 6) {
      NotifyError('Vui lòng nhập đầy đủ 6 chữ số.');
      return;
    }
    setLoading(true);
    verifyOtp.mutate({ email, otp });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const requestPasswordReset = api.User.requestPasswordReset.useMutation({
    onSuccess: data => {
      setLoadingOtp(false);
      NotifySuccess('Mã OTP đã được gửi lại!');
      setTimeLeft(60);
    },
    onError: error => {
      setLoadingOtp(false);
      NotifyError(error.message);
    }
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Title order={2} className='font-quicksand'>
          Nhập mã OTP
        </Title>
      }
    >
      <Text size='sm'>
        Mã OTP đã được gửi đến email: <b>{email}</b>
      </Text>
      <Group mt='md'>
        <Center>
          <PinInput length={6} value={otp} onChange={setOtp} />
        </Center>
      </Group>
      <Text size='sm' mt='md'>
        Thời gian còn lại: {formatTime(timeLeft)}
      </Text>
      {timeLeft === 0 && (
        <Group gap={5}>
          <Text c='red' size='md'>
            Hết thời gian
          </Text>
          <Button
            w={'max-content'}
            variant='subtle'
            size='sm'
            loading={loadingOtp}
            onClick={() => {
              setLoadingOtp(true);
              requestPasswordReset.mutate({ email });
            }}
          >
            Gửi lại mã
          </Button>
        </Group>
      )}
      <Button fullWidth mt='md' onClick={handleSubmit} disabled={timeLeft === 0} loading={loading}>
        Xác nhận
      </Button>
    </Modal>
  );
}
