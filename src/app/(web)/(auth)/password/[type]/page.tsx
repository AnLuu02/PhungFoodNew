'use client';

import { Card, Center, Divider, Grid, GridCol, Text, TextInput, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMail } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import BButton from '~/components/Button/Button';
import { NotifyError } from '~/lib/FuncHandler/toast';
import { api } from '~/trpc/react';
import PeriodControl from '../../components/PeriodControl';
const OtpModal = dynamic(() => import('../../../../../components/Modals/ModalOtp'), {
  ssr: false
});

const TIME_EXPIRED_MINUTES = 3;

export default function ForgotPassword() {
  const { data: user } = useSession();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure();

  useEffect(() => {
    if (user?.user.email) {
      setEmail(user?.user?.email);
    }
  }, [user]);

  const requestPasswordReset = api.User.verifyEmail.useMutation({
    onSuccess: () => {
      setLoading(false);
      open();
    },
    onError: error => {
      setLoading(false);
      NotifyError(error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    requestPasswordReset.mutate({ email, timeExpiredMinutes: TIME_EXPIRED_MINUTES });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Center my={'md'}>
          <Card
            w={{ base: '100%', sm: '50vw', md: '40vw', lg: '27vw' }}
            h={'max-content'}
            py={'xs'}
            pt={'xl'}
            shadow='xl'
            radius={'md'}
            withBorder
          >
            <Card.Section p={'md'}>
              <Grid>
                <GridCol span={12} className='flex justify-center'>
                  <Title className='font-quicksand' order={3}>
                    Nhập địa chỉ email của bạn
                  </Title>
                </GridCol>
                <GridCol span={12} className='flex justify-center'>
                  <PeriodControl period={'email'} />
                </GridCol>
                <GridCol span={12}>
                  <Text size='sm' className='text-center' mb={1}>
                    Chúng tôi sẽ gửi mã xác nhận đến địa chỉ email này.
                  </Text>
                  <TextInput
                    type='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    radius={'md'}
                    placeholder='E-mail'
                    leftSection={<IconMail size={18} stroke={1.5} />}
                  />
                </GridCol>
                <GridCol span={12}>
                  <Text size='sm' c={'dimmed'}>
                    Chúng tôi sẽ dùng email này để gửi thông tin cập nhật về quy trình xem xét và cho bạn biết kết quả.
                  </Text>
                </GridCol>
                <GridCol span={12}>
                  <Divider />
                </GridCol>
                <GridCol span={12}>
                  <BButton disabled={!email} loading={loading} type='submit' fullWidth size='md' children={'Gửi mã'} />
                </GridCol>
              </Grid>
            </Card.Section>
          </Card>
        </Center>
      </form>
      <OtpModal
        opened={opened}
        onClose={close}
        email={email}
        timeExpiredMinutes={TIME_EXPIRED_MINUTES}
        onAfterVerify={token =>
          (window.location.href = `/auth/reset-password?email=${encodeURIComponent(email)}&token=${token}`)
        }
      />
    </>
  );
}
