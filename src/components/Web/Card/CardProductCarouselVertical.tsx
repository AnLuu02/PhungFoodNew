'use client';
import { ActionIcon, Badge, Box, Card, Flex, Group, Rating, Text, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ImageType } from '@prisma/client';
import { IconHeartFilled } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo } from 'react';
import ButtonToggleLike from '~/components/Button/ButtonToggleLike';
import { ButtonViewProduct } from '~/components/Button/ButtonViewProduct';
import CardProductWrapper from '~/components/Card/CardProductWrapper';
import { useFavorite } from '~/components/Hooks/use-favorite';
import { breakpoints } from '~/constants';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { getImageProduct } from '~/lib/FuncHandler/getImageProduct';
import { useModalStore } from '~/stores/modal.store';
import { ButtonAddToCart } from '../../Button/ButtonAddToCart';
const ProductCardCarouselVertical = ({ data }: { data?: any }) => {
  const router = useRouter();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.xs}px)`);
  const openModal = useModalStore(s => s.open);
  const isLiked = useFavorite(data?.id);
  const thumbnail =
    getImageProduct(data?.imageForEntities || [], ImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg';

  return (
    <CardProductWrapper slug={data.id} key={data?.id + 'vertical'}>
      <Card
        h={320}
        padding={0}
        shadow='sm'
        className='group flex transform cursor-pointer flex-col justify-between transition-all duration-300 hover:shadow-xl'
        pos={'relative'}
      >
        <Card.Section pos={'relative'} className='cursor-pointer overflow-hidden' h={'50%'}>
          <Image
            loading='lazy'
            id={`productImage-${data?.id}`}
            src={thumbnail}
            fill
            style={{ objectFit: 'cover' }}
            className='object-cover transition-transform duration-300 group-hover:scale-105'
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
            <Group
              gap={5}
              className={`mr-1 mt-1 flex-col bg-transparent sm:group-hover:animate-fadeDown md:mr-0 md:mt-0 md:flex-row`}
            >
              <ButtonViewProduct data={data} isMobile={isMobile} />
              <ButtonToggleLike isLiked={isLiked} key={data?.id + 'buttonToggleLikevertical'} product={data} />
            </Group>
          </Box>
        </Card.Section>
        <Card.Section h={'50%'} pos={'relative'}>
          <Flex direction='column' gap='sm' pt={10} align='center' className='w-full' h='100%'>
            <Link href={`/san-pham/${data?.tag}`}>
              <Tooltip label={data?.name}>
                <Text
                  lineClamp={1}
                  size='md'
                  fw={700}
                  px={10}
                  className='cursor-pointer text-center hover:text-mainColor'
                >
                  {data?.name || 'Cá thu'}
                </Text>
              </Tooltip>
            </Link>
            <Group m={0}>
              {data?.discount > 0 && (
                <Text size='sm' c={'dimmed'} fw={700} td='line-through'>
                  {data?.discount ? `${formatPriceLocaleVi(data?.price)}` : `180.000đ`}
                </Text>
              )}
              <Text size='md' fw={700} className='text-mainColor'>
                {data?.price ? `${formatPriceLocaleVi(data?.price - data?.discount)} ` : `180.000đ`}
              </Text>
            </Group>
            <Flex align={'center'} gap={10} justify={'space-between'}>
              <Rating fractions={4} readOnly value={data?.rating || 0} onChange={() => {}} color={'#FFC522'} />
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
            <Box w={'100%'} px={'xs'}>
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
                style={{ fullWidth: true }}
                handleAfterAdd={() => openModal('success', data)}
                notify={() => {}}
              />
            </Box>
          </Flex>

          <Badge
            classNames={{
              root: 'bg-subColor'
            }}
            pr={20}
            pos={'absolute'}
            top={-15}
            right={-10}
          >
            <Text size='xs' fw={700} className='text-black'>
              Đã bán: {data?.soldQuantity}
            </Text>
          </Badge>
        </Card.Section>
        {data?.discount > 0 && (
          <Badge color='red' pos={'absolute'} top={0} left={-10} pl={20}>
            Giảm {data?.discount ? ((data?.discount / data?.price) * 100).toFixed(0) + '%' : '20%'}
          </Badge>
        )}
        {isLiked && (
          <ActionIcon color='red' variant='white' pos='absolute' top={10} right={8} radius='xl'>
            <IconHeartFilled size={20} />
          </ActionIcon>
        )}
      </Card>
    </CardProductWrapper>
  );
};
export default memo(ProductCardCarouselVertical);
