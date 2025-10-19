'use client';

import { Alert, Box, Button, Center, Group, Modal, PinInput, Stack, Text, Title } from '@mantine/core';
import { IconInfoCircle, IconMail } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import PeriodControl from '~/app/(web)/(auth)/components/PeriodControl';
import BButton from '~/components/Button/Button';
import { hashPassword } from '~/lib/func-handler/hashPassword';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { api } from '~/trpc/react';
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function OtpModal({
  opened,
  onClose,
  email,
  timeExpiredMinutes
}: {
  opened: boolean;
  onClose: () => void;
  email: string;
  timeExpiredMinutes?: number;
}) {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState((timeExpiredMinutes || 3) * 60);
  const [loading, setLoading] = useState<{ type: 'submit' | 'resend'; value: boolean } | null>(null);
  const verifyOtp = api.User.verifyOtp.useMutation({
    onSuccess: async () => {
      const hashToken = await hashPassword(otp);
      window.location.href = `/auth/reset-password?email=${encodeURIComponent(email)}&token=${hashToken}`;
      onClose();
      NotifySuccess('Xác thực OTP thành công!');
      setLoading({ type: 'submit', value: false });
    },
    onError: error => {
      NotifyError(error.message);
      setLoading({ type: 'submit', value: false });
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
    setLoading({ type: 'submit', value: true });
    verifyOtp.mutate({ email, otp });
  };

  const requestPasswordReset = api.User.requestPasswordReset.useMutation({
    onSuccess: () => {
      setLoading({ type: 'resend', value: false });
      NotifySuccess('Mã OTP đã được gửi lại!');
      setTimeLeft(60);
    },
    onError: error => {
      setLoading({ type: 'resend', value: false });
      NotifyError(error.message);
    }
  });

  return (
    <Modal
      opened={opened}
      title={
        <Text fw={500} style={{ color: timeLeft === 0 ? 'red' : '' }}>
          Còn lại: {formatTime(timeLeft)}
        </Text>
      }
      onClose={onClose}
      radius={'lg'}
    >
      {timeLeft === 0 && (
        <Alert
          variant='light'
          color='yellow'
          title='Mã OTP đã hết hạn. Vui lòng thử lại.'
          icon={<IconInfoCircle />}
        ></Alert>
      )}
      <Stack className='text-center' px={'md'} gap={'lg'} pb={'lg'}>
        <Center>
          <IconMail size={50} className='text-mainColor' />
        </Center>
        <Stack gap={3}>
          <Title order={2} fw={700} className='font-quicksand'>
            Xác thực OTP
          </Title>
          <Box my={'sm'}>
            <PeriodControl period={'verify'} />
          </Box>

          <Text>Nhập mã xác minh được gửi đến</Text>
          <Text fw={700}>{email.slice(0, 3) + '***' + email.slice(email.length - 11)}</Text>
        </Stack>
        <Center my={'md'}>
          <PinInput length={6} value={otp} onChange={setOtp} error={timeLeft === 0} />
        </Center>

        <BButton
          radius='md'
          fullWidth
          size='md'
          onClick={handleSubmit}
          disabled={timeLeft === 0}
          loading={loading?.type === 'submit' && loading.value}
          children={' Xác nhận'}
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
      </Stack>
    </Modal>
  );
}
