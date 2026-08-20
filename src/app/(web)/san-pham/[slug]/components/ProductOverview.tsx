'use client';

import {
  Badge,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  NumberInput,
  Rating,
  Select,
  Spoiler,
  Stack,
  Text,
  Textarea,
  Title
} from '@mantine/core';
import { IconPencil, IconRefresh, IconShieldCheck, IconShoppingCartPlus, IconTruck } from '@tabler/icons-react';
import { ButtonAddToCart } from '~/components/Button/ButtonAddToCart';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { NotifySuccess } from '~/lib/FuncHandler/toast';

import { ImageType } from '@prisma/client';
import { useMemo, useState } from 'react';
import { ShareSocials } from '~/components/ShareSocial';
import ViewingUser from '~/components/UserViewing';
import type { ProductBase } from '~/shared/type-trpc/product.type-trpc';
import ProductImage from './ProductImage';

export const ProductOverview = ({ product }: { product: NonNullable<ProductBase> }) => {
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState(1);
  const inStock = product?.availableQuantity > 0;
  const discount = product?.discount || 0;
  const { thumbnail, gallery } = useMemo(() => {
    const { thumbnail, gallery } = product.imageForEntities.reduce(
      (acc: { thumbnail: string; gallery: string[] }, item: (typeof product)['imageForEntities'][number]) => {
        if (item.type === ImageType.THUMBNAIL) acc.thumbnail = item?.image?.url ?? '/images/jpg/empty-300x240.jpg';
        else if (item.type === ImageType.GALLERY) acc.gallery.push(item?.image?.url ?? '/images/jpg/empty-300x240.jpg');
        return acc;
      },
      { thumbnail: '/images/jpg/empty-300x240.jpg', gallery: [] }
    );

    return {
      thumbnail,
      gallery
    };
  }, [product]);

  return (
    <Grid>
      <Grid.Col span={{ base: 12, sm: 6, md: 6 }} className='relative top-0 h-fit sm:sticky sm:top-[70px]'>
        <ProductImage
          thumbnail={thumbnail}
          gallery={gallery}
          discount={product?.discount || 0}
          tag={product?.tag || ''}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 6 }} className='h-fit'>
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

          <ViewingUser productId={product?.id || ''} />

          <Card
            withBorder
            className='border-0 border-l-2 border-mainColor bg-gray-100 dark:bg-dark-card'
            p={'xs'}
            my={'xs'}
          >
            <Spoiler
              maxHeight={60}
              showLabel='Xem thêm'
              hideLabel='Ẩn'
              classNames={{
                control: 'text-lg font-bold text-mainColor'
              }}
            >
              <Text size='sm'>{product?.description || 'Đang cập nhật'}</Text>
            </Spoiler>
          </Card>

          <Stack gap='xs'>
            <Text size='sm' fw={700}>
              Ghi chú:
            </Text>
            <Textarea
              placeholder='Thêm ghi chú sản phẩm'
              value={note}
              onChange={e => setNote(e.target.value)}
              leftSection={<IconPencil size={16} />}
            />
          </Stack>
          <Flex align='flex-end' gap={'md'} wrap={{ base: 'wrap', md: 'nowrap' }}>
            <Group gap='xs'>
              <NumberInput
                label={
                  <Text size='sm' fw={700}>
                    Số lượng:
                  </Text>
                }
                value={quantity}
                onChange={(value: any) => setQuantity(value)}
                thousandSeparator=','
                min={0}
                max={Number(product?.availableQuantity) || 100}
                clampBehavior='strict'
                className='w-[80px]'
              />
            </Group>
            <Group gap='xs'>
              <Select
                disabled
                label={
                  <Text size='sm' fw={700}>
                    Kích cỡ:
                  </Text>
                }
                searchable
                placeholder='Chọn'
                data={['1 người ăn', '2 người ăn', '3 người ăn', '5 người ']}
              />
            </Group>
            <ButtonAddToCart
              item={{
                product: {
                  id: product?.id,
                  price: product?.price ?? 0,
                  discount: product?.discount ?? 0,
                  name: product?.name,
                  thumbnail
                },
                note,
                quantity
              }}
              style={{
                children: 'Mua hàng',
                size: 'md',
                fullWidth: true,
                leftSection: <IconShoppingCartPlus size={20} className='mr-2 font-bold' />
              }}
              handleAfterAdd={() => {}}
              notify={() => NotifySuccess('Đã thêm vào giỏ hàng', 'Sản phẩm đã được Thêm.')}
            />
          </Flex>
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
      </Grid.Col>
    </Grid>
  );
};
