'use client';
import { ActionIcon, Badge, Box, Card, Flex, Group, Progress, Text, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ImageType } from '@prisma/client';
import { IconHeartFilled } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useMemo } from 'react';
import ButtonToggleLike from '~/components/Button/ButtonToggleLike';
import { ButtonViewProduct } from '~/components/Button/ButtonViewProduct';
import CardProductWrapper from '~/components/Card/CardProductWrapper';
import { useFavorite } from '~/components/Hooks/use-favorite';
import { breakpoints } from '~/constants';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { getImageProduct } from '~/lib/FuncHandler/getImageProduct';
import { useModalStore } from '~/stores/modal.store';
import { ButtonAddToCart } from '../../Button/ButtonAddToCart';
const ProductCardCarouselHorizontal = ({ data }: { data?: any }) => {
  const router = useRouter();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.xs}px)`);
  const openModal = useModalStore(s => s.open);
  const isLiked = useFavorite(data?.id);
  const thumbnail =
    getImageProduct(data?.imageForEntities || [], ImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg';
  const totalQuantityProduct = useMemo(() => {
    return (data?.availableQuantity || 0) + (data?.soldQuantity || 0);
  }, [data]);

  return (
    <CardProductWrapper slug={data.id} key={data?.id + 'horizontal'}>
      <Card
        withBorder
        className='group cursor-pointer overflow-hidden bg-white transition-all duration-300 hover:shadow-lg dark:bg-dark-card'
        padding={0}
        pos={'relative'}
      >
        <Flex h={162} gap={'xs'}>
          <Box w={'36%'} className='group relative flex cursor-pointer items-center justify-center' pos={'relative'}>
            <Image
              loading='lazy'
              id={`productImage-${data?.id}`}
              src={thumbnail}
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
              className={
                'visible flex items-center justify-center bg-[rgba(0,0,0,0.2)] transition-all duration-200 ease-in-out sm:group-hover:visible lg:invisible'
              }
            >
              <Group gap={5} className={`mr-1 mt-1 bg-transparent sm:group-hover:animate-fadeDown md:mr-0 md:mt-0`}>
                <ButtonViewProduct data={data} isMobile={isMobile} />
                <ButtonToggleLike isLiked={isLiked} key={data?.id + 'buttonToggleLikehorizontal'} product={data} />
              </Group>
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
                item={{
                  product: {
                    id: data?.id,
                    price: data?.price ?? 0,
                    discount: data?.discount ?? 0,
                    name: data?.name,
                    thumbnail
                  },
                  quantity: 1
                }}
                style={{}}
                handleAfterAdd={() => openModal('success', data)}
                notify={() => {}}
              />
              <Text
                onClick={() => {
                  isMobile
                    ? router.push(`/san-pham/${data?.tag}/danh-gia`, { scroll: false })
                    : openModal('comments', data);
                }}
                size='xs'
                className='cursor-pointer text-gray-400 transition-all duration-200 ease-in-out hover:text-subColor hover:underline dark:text-dark-text'
              >
                {data?.totalRating || 0} đánh giá
              </Text>
            </Flex>
          </Flex>
        </Flex>
        {data?.discount ? (
          <Badge color='red' pos={'absolute'} top={10} left={8}>
            Giảm {data?.discount ? ((data?.discount / data?.price) * 100).toFixed(0) + '%' : '20%'}
          </Badge>
        ) : (
          ''
        )}
        {isLiked && (
          <ActionIcon color='red' variant='white' pos='absolute' bottom={10} left={8} radius='xl'>
            <IconHeartFilled size={20} />
          </ActionIcon>
        )}

        <Badge color='red' pos={'absolute'} top={0} right={0} className='animate-wiggle'>
          {data?.rating !== 0 ? data?.rating.toFixed(1) : Number(5).toFixed(1)} ⭐
        </Badge>
      </Card>
    </CardProductWrapper>
  );
};
export default memo(ProductCardCarouselHorizontal);
