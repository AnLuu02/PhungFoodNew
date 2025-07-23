'use client';
import { Badge, Box, Button, Card, Flex, Group, Progress, Text, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconEye, IconHeart } from '@tabler/icons-react';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { breakpoints } from '~/constants';
import { useModal } from '~/contexts/ModalContext';
import { formatPriceLocaleVi } from '~/lib/func-handler/formatPrice';
import { getImageProduct } from '~/lib/func-handler/getImageProduct';
import { NotifyError } from '~/lib/func-handler/toast';
import { LocalImageType } from '~/lib/zod/EnumType';
import ButtonAddToCart from '../../components/ButtonAddToCart';
const ProductCardCarouselHorizontal = ({ data }: { data?: any }) => {
  const { data: user } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.sm}px)`);
  const { openModal } = useModal();
  const totalQuantityProduct = useMemo(() => {
    return (data?.availableQuantity || 0) + (data?.soldQuantity || 0);
  }, [data]);

  return (
    <Card radius={'md'} withBorder className='bg-white dark:bg-dark-card' p={0} pos={'relative'}>
      <Flex h={162} gap={'xs'}>
        <Box w={'36%'} className='group/item relative flex cursor-pointer items-center justify-center' pos={'relative'}>
          <Image
            loading='lazy'
            src={getImageProduct(data?.images || [], LocalImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg'}
            fill
            style={{ objectFit: 'cover' }}
            alt={data?.name || 'Product Image'}
          />

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
            <Button.Group className='group-hover/item:animate-fadeTop'>
              <Tooltip label='Xem nhanh'>
                <Button
                  onClick={() => {
                    if (isMobile) {
                      router.push(`/san-pham/${data?.tag}`);
                    } else {
                      openModal('details', null, data);
                    }
                  }}
                  size='xs'
                  p={5}
                  w={'max-content'}
                  variant='default'
                  className={clsx('text-mainColor hover:text-subColor')}
                >
                  <IconEye />
                </Button>
              </Tooltip>
              <Tooltip label='Thêm vào yêu thích'>
                <Button
                  size='xs'
                  p={5}
                  className={clsx('text-mainColor hover:text-subColor')}
                  w={'max-content'}
                  variant='default'
                >
                  <IconHeart />
                </Button>
              </Tooltip>
            </Button.Group>
          </Box>
        </Box>

        <Flex direction={'column'} align={'flex-start'} w={'64%'} gap={'xs'} justify={'center'} pr={'md'}>
          <Link href={`/san-pham/${data?.tag}`}>
            <Tooltip label={data?.name}>
              <Text lineClamp={1} size='md' fw={700} className='cursor-pointer text-center hover:text-mainColor'>
                {data?.name || 'Cá thu'}
              </Text>
            </Tooltip>
          </Link>
          <Flex direction={'column'} w={'100%'}>
            <Progress
              size={'sm'}
              classNames={{ section: 'bg-mainColor' }}
              value={((data?.soldQuantity || 0) / totalQuantityProduct) * 100}
            />
            <Flex align={'center'} justify={'space-between'}>
              <Text size='xs' c={'dimmed'}>
                Đã bán: {data?.soldQuantity || 0}/{totalQuantityProduct}
              </Text>
              <Text size='xs' className='text-mainColor'>
                {(((data?.soldQuantity || 0) / totalQuantityProduct) * 100)?.toFixed(2)}%
              </Text>
            </Flex>
          </Flex>
          <Group>
            {data?.discount && (
              <Text size='sm' c={'dimmed'} td='line-through'>
                {formatPriceLocaleVi(data?.price || 0)}
              </Text>
            )}
            <Text size='md' fw={700} className='text-mainColor'>
              {formatPriceLocaleVi((data?.price || 0) - (data?.discount || 0))}
            </Text>
          </Group>
          <Flex w={'100%'} align={'center'} gap={10} justify={'space-between'}>
            <ButtonAddToCart
              product={data}
              quantity={1}
              style={{}}
              handleAfterAdd={() => openModal('success', null, data)}
              notify={() => {}}
            />
            <Text
              onClick={() => {
                if (user?.user?.email) {
                  pathname == '/' ? router.push(`/san-pham/${data?.tag}/danh-gia`) : openModal('comments', null, data);
                } else {
                  NotifyError('Vui lòng đăng nhập', 'Vui lòng đăng nhập trước khi đánh giá.');
                }
              }}
              size='xs'
              className='cursor-pointer text-gray-400 transition-all duration-200 ease-in-out hover:text-subColor hover:underline'
            >
              Có {data?.totalRating || 0} đánh giá
            </Text>
          </Flex>
        </Flex>
      </Flex>
      {data?.discount ? (
        <Badge color='red' pos={'absolute'} top={10} left={8}>
          -{formatPriceLocaleVi(data?.discount)}
        </Badge>
      ) : (
        ''
      )}

      <Badge color='red' radius={'md'} pos={'absolute'} top={0} right={0} className='animate-wiggle'>
        {data?.rating !== 0 ? data?.rating.toFixed(1) : Number(5).toFixed(1)} ⭐
      </Badge>
    </Card>
  );
};
export default ProductCardCarouselHorizontal;
