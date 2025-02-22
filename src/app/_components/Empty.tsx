'use client';

import { Button, Center, Image, Text } from '@mantine/core';
import Link from 'next/link';
import { useState } from 'react';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export default function Empty({
  noLogo = false,
  logoUrl = '',
  title = 'Giỏ hàng trống',
  content = 'Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.',
  url = '/thuc-don',
  size = 'md',
  hasButton = true
}: {
  noLogo?: boolean;
  logoUrl?: string;
  title?: string;
  content?: string;
  url?: string;
  size?: Size;
  hasButton?: boolean;
}) {
  const [loadingEmptyCart, setLoadingEmptyCart] = useState(false);

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
          src={logoUrl || '/images/png/empty_cart.png'}
          alt='Empty Cart'
          className='mx-auto'
          w={sizeImage[size]}
          h={sizeImage[size]}
        />
      )}
      <Text size={'lg'} mb={4} fw={700}>
        {title}
      </Text>
      <Text size={size}>{content}</Text>
      {hasButton && (
        <Link href={url} className='text-white no-underline'>
          <Button
            color='red'
            size={size}
            className='mt-4 text-center'
            loading={loadingEmptyCart}
            onClick={() => setLoadingEmptyCart(true)}
          >
            Quay lại
          </Button>
        </Link>
      )}
    </Center>
  );
}
