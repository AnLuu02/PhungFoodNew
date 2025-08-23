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
  rem,
  Select,
  Spoiler,
  Stack,
  Tabs,
  Text,
  Textarea,
  Title
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconBrandFacebook,
  IconBrandPinterest,
  IconBrandTwitter,
  IconBrandYoutube,
  IconEye,
  IconMail,
  IconPencil,
  IconRefresh,
  IconShieldCheck,
  IconTruck
} from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import ButtonAddToCart from '~/components/ButtonAddToCart';
import Comments from '~/components/Comments/Comments';
import LayoutProductCarouselOnly from '~/components/Web/Home/Section/Layout-Product-Carousel-Only';
import { breakpoints, TOP_POSITION_STICKY } from '~/constants';
import { formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { getImageProduct } from '~/lib/func-handler/getImageProduct';
import { NotifySuccess } from '~/lib/func-handler/toast';
import { LocalImageType } from '~/lib/zod/EnumType';
import DiscountCodes from './DiscountCodes';
import ProductImage from './ProductImage';
import RatingStatistics from './RatingStatistics';
import RelatedProducts from './RelatedProducts';

import clsx from 'clsx';

export default function ProductDetailClient(data: any) {
  const [activeTab, setActiveTab] = useState('description');
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { product, dataRelatedProducts, dataHintProducts }: any = data?.data || {
    product: {},
    dataRelatedProducts: [],
    dataHintProducts: []
  };

  const relatedProducts = dataRelatedProducts?.filter((item: any) => item.id !== product?.id) || [];
  const hintProducts = dataHintProducts?.filter((item: any) => item.id !== product?.id) || [];
  const discount = product?.discount || 0;
  const inStock = useMemo(() => product?.availableQuantity - product?.soldQuantity > 0, [product]);
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
  const gallery = useMemo(() => {
    return product?.images?.filter((item: any) => item.type !== LocalImageType.THUMBNAIL && item.url) || [];
  }, [product]);

  return (
    <Box>
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
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 6 }} className='h-fit'>
          <Stack gap='md'>
            <Flex align='center' gap={'xs'}>
              <Badge className={clsx(inStock ? 'bg-mainColor' : 'bg-red-500')} radius={'sm'} size='md'>
                {inStock ? 'Còn hàng' : 'Hết hàng'}
              </Badge>
              <Rating value={product?.rating?.toFixed(1)} readOnly size='md' color={'#FFC522'} />
              <Text size='xs' className='text-mainColor'>
                Có {product?.totalRating || 0} đánh giá
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
              <Title order={2} className='font-quicksand' fw={700} c='red'>
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

            <Group>
              <IconEye size={16} />
              <Text size='sm'>29 người đang xem sản phẩm này</Text>
            </Group>

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
                  label={
                    <Text size='sm' fw={700}>
                      Kích cỡ:
                    </Text>
                  }
                  searchable
                  placeholder='Pick value'
                  data={['1 người ăn', '2 người ăn', '3 người ăn', '5 người ']}
                />
              </Group>
              <ButtonAddToCart
                product={{ ...product, note, quantity }}
                style={{
                  title: 'Mua hàng',
                  size: 'md',
                  fullWidth: true,
                  radius: 'sm'
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
            <Group gap={5}>
              <Text c={'dimmed'} size='sm'>
                Chia sẻ:
              </Text>
              <IconBrandFacebook size={16} className='cursor-pointer hover:scale-150 hover:text-mainColor' />
              <IconBrandPinterest size={16} className='cursor-pointer hover:scale-150 hover:text-mainColor' />
              <IconBrandTwitter size={16} className='cursor-pointer hover:scale-150 hover:text-mainColor' />
              <IconBrandYoutube size={16} className='cursor-pointer hover:scale-150 hover:text-mainColor' />
              <IconMail size={16} className='cursor-pointer hover:scale-150 hover:text-mainColor' />
            </Group>
            <Group mt={{ base: 20, sm: 'xs', md: 'xs', lg: 'xl' }} grow>
              <Stack align='center' gap={5}>
                <IconTruck style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
                <Text size='xs' ta='center'>
                  Miễn phí vận chuyển tại TPHCM
                </Text>
              </Stack>
              <Stack align='center' gap={5}>
                <IconShieldCheck style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
                <Text size='xs' ta='center'>
                  Bảo hành chính hãng toàn quốc
                </Text>
              </Stack>
              <Stack align='center' gap={5}>
                <IconRefresh style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
                <Text size='xs' ta='center'>
                  1 đổi 1 nếu sản phẩm lỗi
                </Text>
              </Stack>
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>
      <Grid mt={'md'}>
        {!isMobile && (
          <Grid.Col span={12}>
            <DiscountCodes />
          </Grid.Col>
        )}

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
                <Stack gap='md'>
                  <Group>
                    <Text size='sm'>
                      <b>Chứng nhận/ Cạnh tác:</b> Canh tác theo hướng hữu cơ.
                    </Text>
                  </Group>
                  <Group>
                    <Text size='sm'>
                      <b> Xuất xứ:</b> Trang trại Lạc Dương, Lâm Đồng.
                    </Text>
                  </Group>
                  <Text size='sm'>
                    <b>Mô tả: </b>
                    {product?.description}
                  </Text>
                  <Group>
                    <Text size='sm'>
                      <b>Hướng dẫn bảo quản:</b> Bảo quản trong ngăn mát tủ lạnh.
                    </Text>
                  </Group>
                  <Group>
                    <Text size='sm'>
                      <b>Hạn sử dụng:</b> 3 - 6 ngày tùy điều kiện bảo quản.
                    </Text>
                  </Group>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value='guide' hidden={activeTab !== 'guide'}>
                <Spoiler
                  maxHeight={300}
                  showLabel='Xem thêm'
                  hideLabel='Ẩn'
                  classNames={{
                    control: 'text-sm font-bold text-mainColor'
                  }}
                >
                  <Stack>
                    <Text size='sm'>
                      <b> Bước 1:</b> Truy cập website và lựa chọn sản phẩm cần mua
                    </Text>

                    <Text size='sm'>
                      <b>Bước 2:</b> Click và sản phẩm muốn mua, màn hình hiển thị ra pop up với các lựa chọn sau
                    </Text>

                    <Text size='sm'>
                      Nếu bạn muốn tiếp tục mua hàng: Bấm vào phần tiếp tục mua hàng để lựa chọn thêm sản phẩm vào giỏ
                      hàng
                    </Text>
                    <Text size='sm'>Nếu bạn muốn xem giỏ hàng để cập nhật sản phẩm: Bấm vào xem giỏ hàng</Text>
                    <Text size='sm'>
                      Nếu bạn muốn đặt hàng và thanh toán cho sản phẩm này vui lòng bấm vào: Đặt hàng và thanh toán
                    </Text>

                    <Text size='sm'>
                      <b> Bước 3:</b> Lựa chọn thông tin tài khoản thanh toán
                    </Text>

                    <Text size='sm'>
                      Nếu bạn đã có tài khoản vui lòng nhập thông tin tên đăng nhập là email và mật khẩu vào mục đã có
                      tài khoản trên hệ thống
                    </Text>
                    <Text size='sm'>
                      Nếu bạn chưa có tài khoản và muốn đăng ký tài khoản vui lòng điền các thông tin cá nhân để tiếp
                      tục đăng ký tài khoản. Khi có tài khoản bạn sẽ dễ dàng theo dõi được đơn hàng của mình
                    </Text>
                    <Text size='sm'>
                      Nếu bạn muốn mua hàng mà không cần tài khoản vui lòng nhấp chuột vào mục đặt hàng không cần tài
                      khoản
                    </Text>

                    <Text size='sm'>
                      <b> Bước 4:</b> Điền các thông tin của bạn để nhận đơn hàng, lựa chọn hình thức thanh toán và vận
                      chuyển cho đơn hàng của mình
                    </Text>

                    <Text size='sm'>
                      <b> Bước 5:</b> Xem lại thông tin đặt hàng, điền chú thích và gửi đơn hàng
                    </Text>
                    <Text size='sm'>
                      Sau khi nhận được đơn hàng bạn gửi chúng tôi sẽ liên hệ bằng cách gọi điện lại để xác nhận lại đơn
                      hàng và địa chỉ của bạn.
                    </Text>
                    <Text size='sm'>Trân trọng cảm ơn.</Text>
                  </Stack>
                </Spoiler>
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
            <LayoutProductCarouselOnly data={relatedProducts} title='Sản phẩm liên quan' />
          </Grid.Col>
        )}
      </Grid>
    </Box>
  );
}
