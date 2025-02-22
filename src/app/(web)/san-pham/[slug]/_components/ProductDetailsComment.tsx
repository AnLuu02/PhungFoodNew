import { Badge, Group, Image, Paper, Rating, Spoiler, Stack, Text, Title } from '@mantine/core';
import { formatPriceLocaleVi } from '~/app/lib/utils/format/formatPrice';

export function ProductDetails({ product }: { product: any }) {
  return (
    <Paper withBorder p='md'>
      <Stack>
        <Image loading='lazy' src={product.thumbnail || '/images/jpg/empty-300x240.jpg'} w={300} fit='contain' />
        <Title order={2}>{product.name}</Title>
        <Group>
          <Badge size='lg' variant='filled'>
            {formatPriceLocaleVi(product.price)}
          </Badge>
          <Group gap='xs'>
            <Rating value={product.rating} readOnly />
            <Text size='sm' color='dimmed'>
              ({product.total_rating} đánh giá)
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
        <Text size='sm' color='dimmed'>
          Product ID: {product.id}
        </Text>
      </Stack>
    </Paper>
  );
}
