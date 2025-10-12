'use client';

import { Button, Card, Center, Divider, Flex, Grid, GridCol, Text, TextInput, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCircleDashedCheck, IconLock, IconMail } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import BButton from '~/components/Button';
import { NotifyError } from '~/lib/func-handler/toast';
import { api } from '~/trpc/react';
import ResetPasswordSection from '../../components/ResetPasswordSection';
import VerifySection from '../../components/VerifySection';
const OtpModal = dynamic(() => import('../../components/Modal/ModalOtp'), {
  ssr: false
});

const TIME_EXPIRED_MINUTES = 3;

export default function ForgotPassword() {
  const [period, setPeriod] = useState<{
    type: 'email' | 'verify' | 'reset';
    email: string | null;
    token: string | null;
  }>({ type: 'email', email: null, token: null });
  const { data: user } = useSession();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure();

  useEffect(() => {
    if (user?.user.email) {
      setEmail(user?.user?.email);
    }
  }, [user]);

  const requestPasswordReset = api.User.requestPasswordReset.useMutation({
    onSuccess: () => {
      setLoading(false);
      setPeriod({
        type: 'verify',
        email: email,
        token: null
      });
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
                    Quên mật khẩu
                  </Title>
                </GridCol>
                <GridCol span={12} className='flex justify-center'>
                  <Flex align={'center'} justify={'space-between'} w={'100%'}>
                    <Button
                      variant='transparent'
                      className={`text-black ${period.type === 'email' || period.type === 'reset' || period.type === 'verify' ? 'font-bold text-mainColor' : ''}`}
                      size='sm'
                      p={0}
                      m={0}
                      leftSection={<IconMail size={24} stroke={1.5} />}
                    >
                      Email
                    </Button>
                    <Divider
                      w={25}
                      size={'sm'}
                      color={period.type === 'reset' || period.type === 'verify' ? '#008B4B' : 'transparent'}
                    />
                    <Button
                      variant='transparent'
                      className={`text-black ${period.type === 'reset' || period.type === 'verify' ? 'font-bold text-mainColor' : ''}`}
                      size='sm'
                      leftSection={<IconCircleDashedCheck size={24} stroke={1.5} />}
                      p={0}
                      m={0}
                    >
                      Xác thực
                    </Button>
                    <Divider color={period.type === 'reset' ? '#008B4B' : 'transparent'} w={25} size={'sm'} />

                    <Button
                      variant='transparent'
                      className={`text-black ${period.type === 'reset' ? 'font-bold text-mainColor' : ''}`}
                      size='sm'
                      p={0}
                      m={0}
                      leftSection={<IconLock size={24} stroke={1.5} />}
                    >
                      Mật khẩu mới
                    </Button>
                  </Flex>
                </GridCol>

                {period.type === 'verify' ? (
                  <GridCol span={12}>
                    <VerifySection email={email} timeExpiredMinutes={TIME_EXPIRED_MINUTES} setPeriod={setPeriod} />
                  </GridCol>
                ) : period.type === 'reset' ? (
                  <GridCol span={12}>
                    <ResetPasswordSection email={period.email} token={period.token} />
                  </GridCol>
                ) : (
                  <>
                    <GridCol span={12}>
                      <Text size='sm' className='text-center' mb={1}>
                        Chúng tôi sẽ gửi mã xác nhận đến địa chỉ email này.
                      </Text>
                      <TextInput
                        type='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder='E-mail'
                        leftSection={<IconMail size={18} stroke={1.5} />}
                      />
                    </GridCol>
                    <GridCol span={12}>
                      <Text size='sm' c={'dimmed'}>
                        Chúng tôi sẽ dùng email này để gửi thông tin cập nhật về quy trình xem xét và cho bạn biết kết
                        quả.
                      </Text>
                    </GridCol>
                    <GridCol span={12}>
                      <Divider />
                    </GridCol>
                    <GridCol span={12}>
                      <BButton radius='md' loading={loading} type='submit' fullWidth size='md' label={'Gửi mã'} />
                    </GridCol>
                  </>
                )}
              </Grid>
            </Card.Section>
          </Card>
        </Center>
      </form>
      {/* <OtpModal opened={opened} onClose={close} email={email} timeExpiredMinutes={TIME_EXPIRED_MINUTES} /> */}
    </>
  );
}
