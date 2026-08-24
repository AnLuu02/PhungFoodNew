import { Badge, Divider, Flex, Grid, GridCol, Group, Rating, Stack, Text, Title } from '@mantine/core';
import { IconRefresh, IconShieldCheck, IconTruck } from '@tabler/icons-react';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';

import { ImageType } from '@prisma/client';
import { ShareSocials } from '~/components/ShareSocial';
import type { ProductBase } from '~/shared/type-trpc/product.type-trpc';
import ProductImage from './client-component/ProductImage';
import PurchaseAction from './client-component/PurchaseActions';

export const ProductOverview = ({ product }: { product: NonNullable<ProductBase> }) => {
  const inStock = product?.availableQuantity > 0;
  const discount = product?.discount || 0;
  const { thumbnail, gallery } = product.imageForEntities.reduce(
    (acc: { thumbnail: string; gallery: string[] }, item: (typeof product)['imageForEntities'][number]) => {
      if (item.type === ImageType.THUMBNAIL) acc.thumbnail = item?.image?.url ?? '/images/jpg/empty-300x240.jpg';
      else if (item.type === ImageType.GALLERY) acc.gallery.push(item?.image?.url ?? '/images/jpg/empty-300x240.jpg');
      return acc;
    },
    { thumbnail: '/images/jpg/empty-300x240.jpg', gallery: [] }
  );

  return (
    <Grid>
      <GridCol span={{ base: 12, sm: 6, md: 6 }} className='relative top-0 h-fit sm:sticky sm:top-[70px]'>
        <ProductImage
          thumbnail={thumbnail}
          gallery={gallery}
          discount={product?.discount || 0}
          tag={product?.tag || ''}
        />
      </GridCol>
      <GridCol span={{ base: 12, sm: 6, md: 6 }} className='h-fit'>
        <Stack gap='md'>
          <Flex align='center' gap={'xs'}>
            <Badge className={`${inStock ? 'bg-mainColor' : 'bg-red-500'}`} size='md'>
              {inStock ? 'Còn hàng' : 'Hết hàng'}
            </Badge>
            <Rating value={product?.rating} readOnly size='md' color={'#FFC522'} />
            <Text size='xs' className='text-mainColor'>
              {product?.totalRating || 0} đánh giá
            </Text>
          </Flex>

          <Title order={2} className='font-quicksand' fw={700}>
            {product?.name || 'Đang cập nhật'}
          </Title>

          <Flex
            align={{ base: 'flex-start', md: 'center' }}
            justify={'flex-start'}
            gap={'xs'}
            direction={{ base: 'column', md: 'row' }}
          >
            <Text c='dimmed' size='sm'>
              Danh mục: <b className='font-bold text-mainColor'>{product?.subCategory?.name || 'Đang cập nhật'}</b>
            </Text>

            <Text c='dimmed' size='sm' className='hidden md:block'>
              |
            </Text>
            <Text c='dimmed' size='sm'>
              Mã sản phẩm: <b className='font-bold text-mainColor'>{product?.id || 'asd15as5d465as65d465a16198'}</b>
            </Text>
          </Flex>

          <Divider />
          <Group align='center'>
            <Title order={2} className='font-quicksand text-subColor' fw={700}>
              <b className='text-black dark:text-dark-text'>Giá:</b>{' '}
              {formatPriceLocaleVi((product?.price || 0) - discount || 0)}
            </Title>
            {discount > 0 && (
              <Text size='sm' td='line-through' c='dimmed'>
                Giá thị trường: {formatPriceLocaleVi(product?.price || 0)}
              </Text>
            )}
          </Group>
          <Divider />

          {discount > 0 && (
            <Text size='sm' c='dimmed'>
              Tiết kiệm: {formatPriceLocaleVi(product?.discount || 0)} so với giá thị trường
            </Text>
          )}

          <PurchaseAction
            product={{
              id: product?.id,
              name: product?.name,
              price: product?.price,
              discount: product?.discount,
              description: product?.description,
              availableQuantity: product?.availableQuantity,
              thumbnail
            }}
          />

          <Stack gap={5}>
            <Text c={'dimmed'} size='sm'>
              Thương hiệu: Phụng Food Việt Nam
            </Text>
            <Text c={'dimmed'} size='sm'>
              Loại sản phẩm: {product?.subCategory?.name || 'Súp bông tuyết'}
            </Text>
            <Text c={'dimmed'} size='sm'>
              Khuyến mãi: <b className='text-red-500'>giảm {formatPriceLocaleVi(product?.discount)}</b>
            </Text>
            <Text c={'dimmed'} size='sm'>
              Đã bán: <b className='text-red-500'>{product?.soldQuantity || 0}</b> sản phẩm
            </Text>
          </Stack>
          {/* tag */}
          <ShareSocials data={product} type='detail' />
          <Group mt={{ base: 20, sm: 'xs', md: 'xs', lg: 'xl' }} grow>
            <Stack align='center' gap={5}>
              <IconTruck style={{ width: 24, height: 24 }} stroke={1.5} />
              <Text size='xs' ta='center'>
                Miễn phí vận chuyển tại TPHCM
              </Text>
            </Stack>
            <Stack align='center' gap={5}>
              <IconShieldCheck style={{ width: 24, height: 24 }} stroke={1.5} />
              <Text size='xs' ta='center'>
                Bảo hành chính hãng toàn quốc
              </Text>
            </Stack>
            <Stack align='center' gap={5}>
              <IconRefresh style={{ width: 24, height: 24 }} stroke={1.5} />
              <Text size='xs' ta='center'>
                1 đổi 1 nếu sản phẩm lỗi
              </Text>
            </Stack>
          </Group>
        </Stack>
      </GridCol>
    </Grid>
  );
};
