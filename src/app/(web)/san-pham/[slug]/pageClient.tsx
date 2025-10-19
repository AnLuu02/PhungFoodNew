'use client';

import {
  Badge,
  Box,
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
  Tabs,
  Text,
  Textarea,
  Title
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconPencil, IconRefresh, IconShieldCheck, IconTruck } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { ButtonAddToCart } from '~/components/Button/ButtonAddToCart';
import Comments from '~/components/Comments/Comments';
import { breakpoints, TOP_POSITION_STICKY } from '~/constants';
import { formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { getImageProduct } from '~/lib/func-handler/getImageProduct';
import { NotifySuccess } from '~/lib/func-handler/toast';
import { LocalImageType } from '~/lib/zod/EnumType';
import DiscountCodes from './components/DiscountCodes';
import ProductImage from './components/ProductImage';
import RatingStatistics from './components/RatingStatistics';
import RelatedProducts from './components/RelatedProducts';

import { useSession } from 'next-auth/react';
import { ShareSocials } from '~/components/ShareSocial';
import { TiptapViewer } from '~/components/Tiptap/TiptapViewer';
import ViewingUser from '~/components/UserViewing';
import ProductCardCarouselVertical from '~/components/Web/Card/CardProductCarouselVertical';
import LayoutGridCarouselOnly from '~/components/Web/Home/Section/Layout-Grid-Carousel-Only';
import GuideOrder from './components/GuideOrder';

export default function ProductDetailClient(data: any) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('description');
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { product, dataRelatedProducts, dataHintProducts, dataVouchers }: any = data?.data || {
    product: {},
    dataRelatedProducts: [],
    dataHintProducts: [],
    dataVouchers: []
  };
  const discount = product?.discount || 0;
  const [relatedProducts, hintProducts, inStock, gallery] = useMemo(() => {
    return [
      dataRelatedProducts?.filter((item: any) => item.id !== product?.id) || [],
      dataHintProducts?.filter((item: any) => item.id !== product?.id) || [],
      product?.availableQuantity - product?.soldQuantity > 0,
      product?.images?.filter((item: any) => item.type !== LocalImageType.THUMBNAIL && item.url) || []
    ];
  }, [product]);
  const ratingCounts = useMemo(() => {
    let ratingCountsDefault = [0, 0, 0, 0, 0];
    return (
      product?.review?.reduce((acc: any, item: any) => {
        acc[item.rating - 1] += 1;
        return acc;
      }, ratingCountsDefault) || ratingCountsDefault
    );
  }, [product?.review]);

  const isMobile = useMediaQuery(`(max-width: ${breakpoints.xs}px)`);

  return (
    <>
      <Grid>
        <Grid.Col
          span={{ base: 12, sm: 6, md: 6 }}
          pos={isMobile ? 'relative' : 'sticky'}
          top={isMobile ? 0 : TOP_POSITION_STICKY}
          className='h-fit'
        >
          <ProductImage
            thumbnail={
              getImageProduct(product?.images || [], LocalImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg'
            }
            gallery={
              gallery?.length > 0
                ? gallery
                : [
                    { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000' },
                    { url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000' },
                    { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000' },
                    { url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000' },
                    { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000' },
                    { url: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000' }
                  ]
            }
            discount={discount}
            tag={product?.tag || ''}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 6 }} className='h-fit'>
          <Stack gap='md'>
            <Flex align='center' gap={'xs'}>
              <Badge className={`${inStock ? 'bg-mainColor' : 'bg-red-500'}`} radius={'sm'} size='md'>
                {inStock ? 'Còn hàng' : 'Hết hàng'}
              </Badge>
              <Rating value={product?.rating?.toFixed(1)} readOnly size='md' color={'#FFC522'} />
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
              radius={'md'}
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
                  control: 'text-sm font-bold text-mainColor'
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
                  radius={'md'}
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
                  radius='md'
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
                product={{ ...product, note, quantity }}
                style={{
                  children: 'Mua hàng',
                  size: 'md',
                  fullWidth: true,
                  radius: 'md'
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
      <Grid mt={'md'}>
        {dataVouchers?.length > 0 && !isMobile ? (
          <Grid.Col span={12}>
            <DiscountCodes data={dataVouchers || []} />
          </Grid.Col>
        ) : null}

        <Grid.Col
          mt={{ base: 'md', sm: 0 }}
          className='h-fit'
          span={{
            base: 12,
            sm: hintProducts?.length > 0 ? 7 : 12,
            md: hintProducts?.length > 0 ? 8 : 12,
            lg: hintProducts?.length > 0 ? 9 : 12
          }}
        >
          <Tabs
            classNames={{
              tab: `mr-[10px] border-0 transition-all duration-200 hover:bg-mainColor hover:text-white data-[active=true]:bg-mainColor data-[active=true]:text-white`
            }}
            defaultValue='description'
            value={activeTab}
            onChange={value => setActiveTab(value ?? 'description')}
          >
            <Tabs.List>
              <Tabs.Tab value='description'>
                <Title order={5} className='font-quicksand'>
                  Mô tả
                </Title>
              </Tabs.Tab>
              <Tabs.Tab value='guide'>
                <Title order={5} className='font-quicksand'>
                  Hướng dẫn
                </Title>
              </Tabs.Tab>
              <Tabs.Tab value='reviews'>
                <Title order={5} className='font-quicksand'>
                  Đánh giá
                </Title>
              </Tabs.Tab>
            </Tabs.List>

            <Box mt='md'>
              <Tabs.Panel value='description' hidden={activeTab !== 'description'}>
                <Spoiler
                  maxHeight={300}
                  showLabel='Xem thêm'
                  hideLabel='Ẩn'
                  classNames={{
                    control: 'text-sm font-bold text-mainColor'
                  }}
                >
                  <Stack gap='md'>
                    <TiptapViewer descriptionDetailHtml={product?.descriptionDetailHtml} />
                  </Stack>
                </Spoiler>
              </Tabs.Panel>

              <Tabs.Panel value='guide' hidden={activeTab !== 'guide'}>
                <GuideOrder />
              </Tabs.Panel>

              <Tabs.Panel value='reviews' hidden={activeTab !== 'reviews'}>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <RatingStatistics ratings={ratingCounts} />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 8 }}>
                    <Comments product={product} max_height_scroll={200} />
                  </Grid.Col>
                </Grid>
              </Tabs.Panel>
            </Box>
          </Tabs>
        </Grid.Col>

        {hintProducts?.length > 0 && (
          <Grid.Col span={{ base: 12, sm: 5, md: 4, lg: 3 }}>
            <RelatedProducts data={hintProducts} />
          </Grid.Col>
        )}

        {relatedProducts?.length > 0 && (
          <Grid.Col span={12}>
            <LayoutGridCarouselOnly
              title='Sản phẩm liên quan'
              data={relatedProducts}
              navigation={{
                href: '/thuc-don?loai=san-pham-hot',
                label: 'Xem tất cả'
              }}
              CardElement={<ProductCardCarouselVertical />}
            />
          </Grid.Col>
        )}
      </Grid>
    </>
  );
}
