'use client';

import { Button, Flex } from '@mantine/core';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

const providers = [
  { name: 'google', icon: '/images/png/google.png' },
  { name: 'facebook', icon: '/images/png/facebook.png' },
  { name: 'zalo', icon: '/images/png/zalo.png' } // giả lập
];

const LoginServices = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleLoginServices = async (provider: string) => {
    setLoadingProvider(provider);
    try {
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error(`Error logging in with ${provider}:`, error);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <Flex gap={10} align='center'>
      {providers.map(({ name, icon }) => (
        <Button
          key={name}
          w={50}
          h={50}
          loading={loadingProvider === name}
          loaderProps={{ size: 'xs', color: 'red' }}
          onClick={() => handleLoginServices(name)}
          className='hover: flex cursor-pointer items-center justify-center rounded-full bg-white opacity-100 transition-all duration-200 ease-in-out hover:scale-110 hover:bg-white hover:opacity-80'
        >
          <Image loading='lazy' src={icon} alt={name} width={30} height={30} style={{ objectFit: 'cover' }} />
        </Button>
      ))}
    </Flex>
  );
};

export default LoginServices;
