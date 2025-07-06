import { Box, Center, Group, Paper, ScrollAreaAutosize, Stack, Text, Tooltip } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { TOP_POSITION_STICKY } from '~/constants';
import { formatPriceLocaleVi } from '~/lib/func-handler/formatPrice';
import { getImageProduct } from '~/lib/func-handler/getImageProduct';
import { LocalImageType } from '~/lib/zod/EnumType';
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
      <Center className='rounded-t-md bg-mainColor p-2 text-white'>
        <Text size='sm' fw={700}>
          Có thể bạn thích
        </Text>
      </Center>
      <ScrollAreaAutosize mah={350} scrollbarSize={5}>
        <Stack p='md'>
          {data?.map((product: any) => (
            <Group key={product.id} wrap='nowrap' className='cursor-pointer'>
              <Box w={60} h={60} pos={'relative'} className='overflow-hidden'>
                <Image
                  loading='lazy'
                  src={
                    getImageProduct(product?.images || [], LocalImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg'
                  }
                  fill
                  style={{ objectFit: 'cover' }}
                  alt='Hình ảnh sản phẩm'
                  className='rounded-md'
                />
              </Box>
              <div>
                <Link href={`/san-pham/${product?.tag}`}>
                  <Tooltip label={product?.name}>
                    <Text
                      lineClamp={1}
                      size='md'
                      fw={700}
                      className='cursor-pointer text-black hover:text-mainColor dark:text-dark-text'
                    >
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
