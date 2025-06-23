'use client';

import { Center, Group, Paper, ScrollAreaAutosize, Stack, Text, Tooltip } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { TOP_POSITION_STICKY } from '~/app/lib/utils/constants/constant';
import { formatPriceLocaleVi } from '~/app/lib/utils/func-handler/formatPrice';
import { getImageProduct } from '~/app/lib/utils/func-handler/getImageProduct';
import { LocalImageType } from '~/app/lib/utils/zod/EnumType';
export default function RelatedProducts({ data }: any) {
  return (
    <Paper
      radius='md'
      withBorder
      mah={400}
      pos={'sticky'}
      top={TOP_POSITION_STICKY}
      right={0}
      className='h-fit'
      mt={{ base: 50, sm: 0, md: 0, lg: 0 }}
    >
      <Center className='rounded-t-md bg-green-600 p-2 text-white'>
        <Text size='sm' fw={700}>
          Có thể bạn thích
        </Text>
      </Center>
      <ScrollAreaAutosize mah={350} scrollbarSize={5}>
        <Stack p='md'>
          {data?.map((product: any) => (
            <Group key={product.id} wrap='nowrap' className='cursor-pointer'>
              <Image
                loading='lazy'
                src={
                  getImageProduct(product?.images || [], LocalImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg'
                }
                width={60}
                height={60}
                alt='Hình ảnh sản phẩm'
                className='rounded-md'
              />
              <div>
                <Link href={`/san-pham/${product?.tag}`} prefetch={false}>
                  <Tooltip label={product?.name}>
                    <Text lineClamp={1} size='md' fw={700} className='cursor-pointer text-black hover:text-[#008b4b]'>
                      {product?.name || 'Cá thu'}
                    </Text>
                  </Tooltip>
                </Link>
                <Group gap='xs'>
                  <Text c='red' fw={700}>
                    {formatPriceLocaleVi(product.price - product.discount)}
                  </Text>
                  {product.discount > 0 && (
                    <Text c='dimmed' td='line-through' size='sm'>
                      {formatPriceLocaleVi(product.price)}
                    </Text>
                  )}
                </Group>
              </div>
            </Group>
          ))}
        </Stack>
      </ScrollAreaAutosize>
    </Paper>
  );
}
