'use client';

import { Card, Center, Grid, GridCol, rem, TextInput, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMail } from '@tabler/icons-react';
import { useState } from 'react';
import BButton from '~/app/_components/Button';
import { NotifyError } from '~/app/lib/utils/func-handler/toast';
import { api } from '~/trpc/react';
import OtpModal from '../_components/otp-modal';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure();

  const requestPasswordReset = api.User.requestPasswordReset.useMutation({
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
    requestPasswordReset.mutate({ email });
  };

  return (
    <>
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
                  <Title className='font-quicksand' size={rem(28)}>
                    Quên mật khẩu
                  </Title>
                </GridCol>
                <GridCol span={12}>
                  <TextInput
                    type='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder='E-mail'
                    label='E-mail'
                    leftSection={<IconMail size={18} stroke={1.5} />}
                  />
                </GridCol>

                <GridCol span={12}>
                  <BButton radius='sm' loading={loading} type='submit' fullWidth size='md' title={'Gửi mã OTP'} />
                </GridCol>
              </Grid>
            </Card.Section>
          </Card>
        </Center>
      </form>
      <OtpModal opened={opened} onClose={close} email={email} />
    </>
  );
}
