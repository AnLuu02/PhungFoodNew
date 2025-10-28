'use client';

import { Center, Grid, GridCol, Modal, TextInput, Title } from '@mantine/core';
import { IconMail } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import BButton from '~/components/Button/Button';
import { NotifyError } from '~/lib/FuncHandler/toast';
import { api } from '~/trpc/react';
const OtpModal = dynamic(() => import('~/components/Modals/ModalOtp'), {
  ssr: false
});

const TIME_EXPIRED_MINUTES = 3;

export const ModalChangePassword = ({ opened, setOpened }: { opened: boolean; setOpened: any }) => {
  const { data: user } = useSession();
  const [openedOtp, setOpenedOtp] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.user.email) {
      setEmail(user?.user?.email);
    }
  }, [user]);

  const requestPasswordReset = api.User.verifyEmail.useMutation({
    onSuccess: () => {
      setLoading(false);
      setOpenedOtp(true);
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
      <Modal
        opened={opened}
        centered
        withCloseButton={false}
        onClose={() => setOpened(false)}
        className='rounded-lg'
        transitionProps={{ duration: 300, transition: 'fade-up' }}
      >
        <form onSubmit={handleSubmit}>
          <Center>
            <Grid>
              <GridCol span={12} className='flex justify-center'>
                <Title className='font-quicksand' size={28}>
                  Quên mật khẩu
                </Title>
              </GridCol>
              <GridCol span={12}>
                <TextInput
                  type='email'
                  radius='md'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder='E-mail'
                  label='E-mail'
                  leftSection={<IconMail size={18} stroke={1.5} />}
                />
              </GridCol>

              <GridCol span={12}>
                <BButton loading={loading} type='submit' fullWidth size='md' children={'Gửi mã OTP'} />
              </GridCol>
            </Grid>
          </Center>
        </form>
      </Modal>

      <OtpModal
        opened={openedOtp}
        onClose={() => setOpenedOtp(false)}
        email={email}
        timeExpiredMinutes={TIME_EXPIRED_MINUTES}
        onAfterVerify={token =>
          (window.location.href = `/auth/reset-password?email=${encodeURIComponent(email)}&token=${token}`)
        }
      />
    </>
  );
};
