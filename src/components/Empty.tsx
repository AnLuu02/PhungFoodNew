'use client';

import { Center, Text } from '@mantine/core';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import BButton from './Button/Button';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export default function Empty({
  noLogo = false,
  logoUrl = '',
  title = 'Giỏ hàng trống',
  content = 'Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.',
  url = '/thuc-don',
  size = 'md',
  hasButton = true,
  onClick
}: {
  noLogo?: boolean;
  logoUrl?: string;
  title?: string;
  content?: string;
  url?: string;
  size?: Size;
  hasButton?: boolean;
  onClick?: () => void;
}) {
  const [loadingEmpty, setLoadingEmpty] = useState(false);
  const router = useRouter();
  const sizeImage = {
    xs: 100,
    sm: 150,
    md: 200,
    lg: 300,
    xl: 400
  };

  return (
    <Center w={'100%'} h={'100%'} className='flex-col'>
      {!noLogo && (
        <Image
          loading='lazy'
          src={logoUrl || '/images/png/empty_cart.png'}
          alt='Empty Cart'
          className='mx-auto'
          style={{ objectFit: 'cover' }}
          width={sizeImage[size]}
          height={sizeImage[size]}
        />
      )}
      <Text size={'lg'} mb={4} fw={700} className='text-center'>
        {title}
      </Text>
      <Text size={size}>{content}</Text>
      {hasButton && (
        <BButton
          size={size}
          className='bg-red-500'
          loading={loadingEmpty}
          onClick={() => {
            onClick?.();
            if (onClick) {
              onClick();
            } else {
              setLoadingEmpty(true);
              router.push(url);
            }
          }}
        >
          Quay lại
        </BButton>
      )}
    </Center>
  );
}
