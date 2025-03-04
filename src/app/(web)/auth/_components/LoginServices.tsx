'use client';

import { Button, Flex, Image } from '@mantine/core';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

const LoginServices = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [loadingLogin, setLoadingLogin] = useState(false);
  const handleLoginServices = async (type: string) => {
    try {
      setLoadingLogin(true);
      type === 'google' && (await signIn('google', { callbackUrl }));
      setLoadingLogin(false);
    } catch (error) {
      console.error('Error logging in:', error);
      setLoadingLogin(false);
    }
  };

  return (
    <Flex gap={10} align={'center'}>
      <Button
        w={50}
        h={50}
        className='hover: flex cursor-pointer items-center justify-center rounded-full bg-white opacity-100 hover:bg-white hover:opacity-80'
        loading={loadingLogin}
        loaderProps={{ size: 'xs', color: 'red' }}
        onClick={() => handleLoginServices('google')}
      >
        <Image loading='lazy' src='/images/png/google.png' alt='bottom' w={30} h={30} />
      </Button>
      <Button
        w={50}
        loaderProps={{ size: 'xs', color: 'red' }}
        h={50}
        className='hover: flex cursor-pointer items-center justify-center rounded-full bg-white opacity-100 hover:bg-white hover:opacity-80'
      >
        <Image loading='lazy' src='/images/png/facebook.png' alt='bottom' w={30} h={30} />
      </Button>
      <Button
        w={50}
        h={50}
        loaderProps={{ size: 'xs', color: 'red' }}
        className='hover: flex cursor-pointer items-center justify-center rounded-full bg-white opacity-100 hover:bg-white hover:opacity-80'
      >
        <Image loading='lazy' src='/images/png/zalo.png' alt='bottom' w={30} h={30} />
      </Button>
    </Flex>
  );
};
export default LoginServices;
