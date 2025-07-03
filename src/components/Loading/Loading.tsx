'use client';
import { Flex, Overlay } from '@mantine/core';
import Image from 'next/image';
import { useEffect } from 'react';

export default function LoadingComponent() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  return (
    <Flex align={'center'} justify={'center'} pos={'fixed'} top={0} left={0} bottom={0} right={0} className='z-[9999]'>
      <Image
        style={{ objectFit: 'cover' }}
        src={'/images/gif/loading.gif'}
        width={200}
        height={200}
        alt={'loading'}
        className='z-[1000]'
      />
      <Overlay color='#000' backgroundOpacity={0.15} blur={5} />
    </Flex>
  );
}
