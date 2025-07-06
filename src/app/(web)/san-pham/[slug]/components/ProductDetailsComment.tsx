import { Badge, Group, Paper, Rating, Spoiler, Stack, Text, Title } from '@mantine/core';
import Image from 'next/image';
import { formatPriceLocaleVi } from '~/lib/func-handler/formatPrice';
import { getImageProduct } from '~/lib/func-handler/getImageProduct';
import { LocalImageType } from '~/lib/zod/EnumType';

export default function ProductDetails({ product }: { product: any }) {
  return (
    <Paper withBorder p='md'>
      <Stack>
        <Image
          loading='lazy'
          src={getImageProduct(product?.images || [], LocalImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg'}
          width={300}
          height={300}
          alt='Hình ảnh sản phẩm'
          style={{ objectFit: 'cover' }}
        />
        <Title order={2}>{product.name}</Title>
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
          Product ID: {product.id}
        </Text>
      </Stack>
    </Paper>
  );
}
