import { Badge, Group, Paper, Rating, Spoiler, Stack, Text, Title } from '@mantine/core';
import { ImageType } from '@prisma/client';
import Image from 'next/image';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { getImageProduct } from '~/lib/FuncHandler/getImageProduct';

export default function ProductDetails({ product }: { product: any }) {
  return (
    <Paper withBorder p='md'>
      <Stack>
        <Paper w={300} h={300} pos={'relative'} className='overflow-hidden'>
          <Image
            loading='lazy'
            src={
              getImageProduct(product?.imageForEntities || [], ImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg'
            }
            fill
            alt='Hình ảnh sản phẩm'
            className='object-cover'
          />
        </Paper>
        <Title order={2} className='font-quicksand'>
          {product.name}
        </Title>
        <Group>
          <Badge size='lg' variant='filled'>
            {formatPriceLocaleVi(product.price)}
          </Badge>
          <Group gap='xs'>
            <Rating value={product.rating} readOnly color={'#FFC522'} />
            <Text size='sm' c='dimmed'>
              ({product.totalRating} đánh giá)
            </Text>
          </Group>
        </Group>
        <Spoiler
          maxHeight={60}
          showLabel='Xem thêm'
          hideLabel='Ẩn'
          classNames={{
            control: 'text-sm font-bold text-mainColor'
          }}
        >
          <Text size='sm' mb='md'>
            {product.description}
          </Text>
        </Spoiler>
        <Text size='sm' c='dimmed'>
          Mã sản phẩm: {product.id}
        </Text>
      </Stack>
    </Paper>
  );
}
