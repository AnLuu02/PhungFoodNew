'use client';
import { Badge, Box, Button, Card, Flex, Group, Rating, Text, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconEye, IconHeart, IconHeartFilled } from '@tabler/icons-react';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { breakpoints } from '~/constants';
import { useModal } from '~/contexts/ModalContext';
import { formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { getImageProduct } from '~/lib/func-handler/getImageProduct';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { LocalImageType } from '~/lib/zod/EnumType';
import { api } from '~/trpc/react';
import ButtonAddToCart from '../../ButtonAddToCart';
const ProductCardCarouselVertical = ({ product }: { product?: any }) => {
  const { data: user } = useSession();
  const router = useRouter();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.xs}px)`);
  const pathname = usePathname();
  const { openModal } = useModal();
  const [like, setLike] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const utils = api.useUtils();

  useEffect(() => {
    if (user) {
      const favourite = product?.favouriteFood?.find((item: any) => item.userId === user?.user?.id);
      if (favourite) {
        setLike(true);
      }
    }
  }, [product, user]);

  const mutationAddFavourite = api.FavouriteFood.create.useMutation({
    onSuccess: () => {
      setLike(true);
      setLoading(false);
      utils.FavouriteFood.invalidate();
    },
    onError: error => {
      NotifyError(error.message);
    }
  });
  const mutationCancleFavourite = api.FavouriteFood.delete.useMutation({
    onSuccess: () => {
      setLike(false);
      setLoading(false);
      utils.FavouriteFood.invalidate();
    },
    onError: error => {
      NotifyError(error.message);
    }
  });

  return (
    <Card h={320} radius='md' padding={0} shadow='sm' className='flex flex-col justify-between' pos={'relative'}>
      <Card.Section pos={'relative'} className='group/item cursor-pointer' h={'50%'}>
        <Image
          loading='lazy'
          id={`productImage-${product?.id}`}
          src={getImageProduct(product?.images || [], LocalImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg'}
          fill
          style={{ objectFit: 'cover' }}
          alt={product?.name || 'Product Image'}
        />
        <Box
          pos={'absolute'}
          left={0}
          top={0}
          h='100%'
          w='100%'
          className={clsx(
            'visible flex items-center justify-center bg-[rgba(0,0,0,0.2)] transition-all duration-200 ease-in-out group-hover/item:visible lg:invisible'
          )}
        >
          <Button.Group className='group-hover/item:animate-fadeBottom'>
            <Tooltip label='Xem nhanh'>
              {isMobile ? (
                <Button
                  size='xs'
                  p={5}
                  w={'max-content'}
                  variant='default'
                  className={clsx('border-t-r-0 text-mainColor hover:text-subColor')}
                >
                  <Link href={`/san-pham/${product?.tag}`}>
                    <IconEye />
                  </Link>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    openModal('details', null, product);
                  }}
                  size='xs'
                  p={5}
                  w={'max-content'}
                  variant='default'
                  className={clsx('text-mainColor hover:text-subColor')}
                >
                  <IconEye />
                </Button>
              )}
            </Tooltip>

            <Button
              className={clsx('text-mainColor hover:text-subColor')}
              size='xs'
              w={'max-content'}
              p={5}
              variant='default'
              loading={loading}
              disabled={loading}
            >
              {like ? (
                <Tooltip label='Xóa khỏi yêu thích'>
                  <IconHeartFilled
                    onClick={async () => {
                      if (user) {
                        await mutationCancleFavourite.mutate({ userId: user?.user?.id, productId: product.id });
                        NotifySuccess('Thành công!', 'Xóa yêu thích thành công.');
                        setLoading(true);
                      } else {
                        NotifyError('Chưa đăng nhập!', 'Vui lớng đăng nhập.');
                      }
                    }}
                  />
                </Tooltip>
              ) : (
                <Tooltip label='Thêm vào yêu thích'>
                  <IconHeart
                    onClick={async () => {
                      if (user) {
                        await mutationAddFavourite.mutate({ userId: user?.user?.id, productId: product.id });
                        NotifySuccess('Thành công!', 'Thêm yêu thích thành công.');
                        setLoading(true);
                      } else {
                        NotifyError('Chưa đăng nhập!', 'Vui lớng đăng nhập.');
                      }
                    }}
                  />
                </Tooltip>
              )}
            </Button>
          </Button.Group>
        </Box>
      </Card.Section>
      <Card.Section h={'50%'} pos={'relative'}>
        <Flex direction='column' gap='sm' pt={10} align='center' className='w-full' h='100%'>
          <Link href={`/san-pham/${product?.tag}`}>
            <Tooltip label={product?.name}>
              <Text
                lineClamp={1}
                size='md'
                fw={700}
                px={10}
                className='cursor-pointer text-center hover:text-mainColor'
              >
                {product?.name || 'Cá thu'}
              </Text>
            </Tooltip>
          </Link>
          <Group m={0}>
            {product?.discount > 0 && (
              <Text size='sm' c={'dimmed'} fw={700} td='line-through'>
                {product?.discount ? `${formatPriceLocaleVi(product?.price)}` : `180.000đ`}
              </Text>
            )}
            <Text size='md' fw={700} className='text-mainColor'>
              {product?.price ? `${formatPriceLocaleVi(product?.price - product?.discount)} ` : `180.000đ`}
            </Text>
          </Group>
          <Flex align={'center'} gap={10} justify={'space-between'}>
            <Rating fractions={4} readOnly value={product?.rating || 0} onChange={() => {}} color={'#FFC522'} />
            <Text
              onClick={() => {
                if (!user?.user?.email) {
                  NotifyError('Vui lòng đăng nhập', 'Vui lòng đăng nhập trước khi đánh giá.');
                  return;
                }
                if (pathname !== '/') {
                  openModal('comments', null, product);
                }
              }}
              size='xs'
              className='cursor-pointer text-gray-400 transition-all duration-200 ease-in-out hover:text-subColor hover:underline'
            >
              {pathname === '/' ? (
                <Link
                  className='cursor-pointer text-gray-400 transition-all duration-200 ease-in-out hover:text-subColor hover:underline'
                  href={`/san-pham/${product?.tag}/danh-gia`}
                >
                  Có {product?.totalRating || 0} đánh giá
                </Link>
              ) : (
                `Có ${product?.totalRating || 0} đánh giá`
              )}
            </Text>
          </Flex>
          <Box>
            <ButtonAddToCart
              product={{ ...product, quantity: 1 }}
              style={{}}
              handleAfterAdd={() => openModal('success', null, product)}
              notify={() => {}}
            />
          </Box>
        </Flex>

        <Badge color='red' pr={20} pos={'absolute'} top={-15} right={-10}>
          <Text size='xs' className='text-white'>
            Đã bán: {product?.soldQuantity}
          </Text>
        </Badge>
      </Card.Section>

      {product?.discount > 0 && (
        <Badge color='red' pos={'absolute'} top={10} left={8}>
          {product?.discount ? `-${formatPriceLocaleVi(product?.discount)} ` : `180.000đ`}
        </Badge>
      )}
    </Card>
  );
};
export default ProductCardCarouselVertical;
