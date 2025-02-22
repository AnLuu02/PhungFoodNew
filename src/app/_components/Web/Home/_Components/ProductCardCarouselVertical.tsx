'use client';
import { Badge, Box, Button, Card, Flex, Group, Image, Rating, Text, Tooltip } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconEye, IconHeart, IconHeartFilled } from '@tabler/icons-react';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import BButton from '~/app/_components/Button';
import { useModal } from '~/app/contexts/ModalContext';
import { formatPriceLocaleVi } from '~/app/lib/utils/format/formatPrice';
import { NotifyError, NotifySuccess } from '~/app/lib/utils/func-handler/toast';
import { api } from '~/trpc/react';
const ProductCardCarouselVertical = ({ product, quickOrder }: { product?: any; quickOrder?: boolean }) => {
  const [cart, setCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const { data: user } = useSession();
  const pathname = usePathname();
  const { openModal } = useModal();
  const [like, setLike] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const utils = api.useUtils();

  useEffect(() => {
    if (user) {
      const favourite = product?.favourite_food?.find((item: any) => item.userId === user?.user?.id);
      if (favourite) {
        setLike(true);
      }
    }
  }, [product, user]);

  const mutationAddFavourite = api.FavouriteFood.create.useMutation({
    onSuccess: data => {
      setLike(true);
      setLoading(false);

      utils.FavouriteFood.invalidate();
    },
    onError: error => {
      NotifyError(error.message);
    }
  });
  const mutationCancleFavourite = api.FavouriteFood.delete.useMutation({
    onSuccess: data => {
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
        <Image loading='lazy' src={product?.thumbnail || '/images/jpg/empty-300x240.jpg'} h={'100%'} />
        <Box
          pos={'absolute'}
          left={0}
          top={0}
          h='100%'
          w='100%'
          className={clsx(
            'visible flex items-center justify-center bg-[rgba(0,0,0,0.2)] transition-all duration-200 ease-in-out group-hover/item:visible xl:invisible'
          )}
        >
          <Button.Group className='group-hover/item:animate-fadeBottom'>
            <Tooltip label='Xem nhanh'>
              <Button
                onClick={() => {
                  openModal('details', null, product);
                }}
                size='xs'
                w={'max-content'}
                p={5}
                variant='default'
                className={clsx('text-[#008b4b] hover:text-[#f8c144]')}
              >
                <IconEye />
              </Button>
            </Tooltip>

            <Button
              className={clsx('text-[#008b4b] hover:text-[#f8c144]')}
              size='xs'
              w={'max-content'}
              p={5}
              variant='default'
              loading={loading}
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
          <Link href={`/san-pham/${product?.tag}`} className='no-underline'>
            <Tooltip label={product?.name}>
              <Text
                lineClamp={1}
                size='md'
                fw={700}
                px={10}
                className='cursor-pointer text-center text-black hover:text-[#008b4b]'
              >
                {product?.name || 'Cá thu'}
              </Text>
            </Tooltip>
          </Link>
          <Group m={0}>
            {product?.discount > 0 && (
              <Text size='sm' c={'dimmed'} fw={700} td='line-through'>
                {product?.discount ? `-${formatPriceLocaleVi(product?.price)}` : `180.000đ`}
              </Text>
            )}
            <Text size='md' fw={700} className='text-[#008b4b]'>
              {product?.price ? `${formatPriceLocaleVi(product?.price - product?.discount)} ` : `180.000đ`}
            </Text>
          </Group>
          <Flex align={'center'} gap={10} justify={'space-between'}>
            <Rating fractions={4} readOnly value={product?.rating || 0} onChange={() => {}} color={'#F8C144'} />
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
              className='cursor-pointer text-gray-400 transition-all duration-200 ease-in-out hover:text-[#f8c144] hover:underline'
            >
              {pathname === '/' ? (
                <Link
                  className='cursor-pointer text-gray-400 no-underline transition-all duration-200 ease-in-out hover:text-[#f8c144] hover:underline'
                  href={`/san-pham/${product?.tag}/danh-gia`}
                >
                  Có {product?.total_rating || 0} đánh giá
                </Link>
              ) : (
                `Có ${product?.total_rating || 0} đánh giá`
              )}
            </Text>
          </Flex>
          <Box>
            <BButton
              onClick={() => {
                if (quickOrder) {
                  const existingItem = cart.find((item: any) => item.id === product?.id);
                  if (existingItem) {
                    setCart(
                      cart.map((item: any) =>
                        item.id === product?.id ? { ...item, quantity: 1 + existingItem.quantity } : item
                      )
                    );
                  } else {
                    setCart([...cart, { ...product, quantity: 1 }]);
                  }
                  NotifySuccess('Thành công!', 'Thêm với gio hàng thành cong.');
                } else {
                  openModal('details', null, product);
                }
              }}
            />
          </Box>
        </Flex>

        <Badge color='red' pr={20} pos={'absolute'} top={-15} right={-10}>
          <Text size='xs' c={'white'}>
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
