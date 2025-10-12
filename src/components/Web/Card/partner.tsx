'use client';

import { Card } from '@mantine/core';
import Image from 'next/image';

export function PartnerCard({ data }: any) {
  return (
    <Card
      padding={0}
      shadow='xl'
      radius={'md'}
      pos={'relative'}
      className='group w-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg'
      h={80}
      w={'100%'}
    >
      <Image
        src={data || `/images/webp/img_brand_1.webp`}
        alt={data}
        fill
        className='object-contain transition-transform duration-300 group-hover:scale-105'
      />
    </Card>
  );
}
