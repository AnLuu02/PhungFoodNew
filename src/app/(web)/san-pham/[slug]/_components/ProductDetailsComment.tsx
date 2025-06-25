import { Badge, Group, Paper, Rating, Spoiler, Stack, Text, Title } from '@mantine/core';
import Image from 'next/image';
import { formatPriceLocaleVi } from '~/app/lib/utils/func-handler/formatPrice';
import { getImageProduct } from '~/app/lib/utils/func-handler/getImageProduct';
import { LocalImageType } from '~/app/lib/utils/zod/EnumType';

export function ProductDetails({ product }: { product: any }) {
  return (
    <Paper withBorder p='md'>
      <Stack>
        <Image
          loading='lazy'
          src={getImageProduct(product?.images || [], LocalImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg'}
          width={300}
          height={300}
          alt='Hình ảnh sản phẩm'
          objectFit='cover'
        />
        <Title order={2}>{product.name}</Title>
        <Group>
          <Badge size='lg' variant='filled'>
            {formatPriceLocaleVi(product.price)}
          </Badge>
          <Group gap='xs'>
            <Rating value={product.rating} readOnly />
            <Text size='sm' c='dimmed'>
              ({product.totalRating} đánh giá)
            </Text>
          </Group>
        </Group>
        <Spoiler
          maxHeight={60}
          showLabel='Xem thêm'
          hideLabel='Ẩn'
          styles={{
            control: { color: '#008b4b', fontWeight: 700, fontSize: '14px' }
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
