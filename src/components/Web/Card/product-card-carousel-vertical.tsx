'use client';
import { Badge, Box, Button, Card, Flex, Group, Rating, Text, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconEye } from '@tabler/icons-react';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ToggleLikeButton from '~/components/ButtonToggleLike';
import { breakpoints } from '~/constants';
import { useModal } from '~/contexts/ModalContext';
import { formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { getImageProduct } from '~/lib/func-handler/getImageProduct';
import { LocalImageType } from '~/lib/zod/EnumType';
import ButtonAddToCart from '../../ButtonAddToCart';
const ProductCardCarouselVertical = ({ data }: { data?: any }) => {
  const router = useRouter();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.xs}px)`);
  const { openModal } = useModal();
  return (
    <Card
      h={320}
      radius='md'
      padding={0}
      shadow='sm'
      className='group flex transform cursor-pointer flex-col justify-between transition-all duration-300 hover:shadow-xl'
      pos={'relative'}
    >
      <Card.Section pos={'relative'} className='cursor-pointer overflow-hidden' h={'50%'}>
        <Image
          loading='lazy'
          id={`productImage-${data?.id}`}
          src={getImageProduct(data?.images || [], LocalImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg'}
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
          className={clsx(
            'visible flex items-center justify-center bg-[rgba(0,0,0,0.2)] transition-all duration-200 ease-in-out group-hover:visible lg:invisible'
          )}
        >
          <Button.Group className='group-hover:animate-fadeBottom'>
            <Tooltip label='Xem nhanh'>
              {isMobile ? (
                <Button
                  size='xs'
                  p={5}
                  w={'max-content'}
                  variant='default'
                  className={clsx('border-t-r-0 text-mainColor hover:text-subColor')}
                >
                  <Link href={`/san-pham/${data?.tag}`}>
                    <IconEye />
                  </Link>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    openModal('details', null, data);
                  }}
                  size='xs'
                  p={5}
                  w={'max-content'}
                  variant='default'
                  className={`text-mainColor hover:text-subColor`}
                >
                  <IconEye />
                </Button>
              )}
            </Tooltip>

            <ToggleLikeButton data={data} />
          </Button.Group>
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
                isMobile ? router.push(`/san-pham/${data?.tag}/danh-gia`) : openModal('comments', null, data);
              }}
              size='xs'
              className='cursor-pointer text-gray-400 transition-all duration-200 ease-in-out hover:text-subColor hover:underline'
            >
              Có {data?.totalRating || 0} đánh giá
            </Text>
          </Flex>
          <Box>
            <ButtonAddToCart
              product={{ ...data, quantity: 1 }}
              style={{}}
              handleAfterAdd={() => openModal('success', null, data)}
              notify={() => {}}
            />
          </Box>
        </Flex>

        <Badge color='red' pr={20} pos={'absolute'} top={-15} right={-10}>
          <Text size='xs' className='text-white'>
            Đã bán: {data?.soldQuantity}
          </Text>
        </Badge>
      </Card.Section>

      {data?.discount > 0 && (
        <Badge color='red' pos={'absolute'} top={10} left={8}>
          {data?.discount ? `-${formatPriceLocaleVi(data?.discount)} ` : `180.000đ`}
        </Badge>
      )}
    </Card>
  );
};
export default ProductCardCarouselVertical;
