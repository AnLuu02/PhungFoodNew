'use client';
import { Badge, Box, Button, Card, Flex, Group, Progress, Text, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconEye } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useMemo } from 'react';
import { ButtonToggleLike } from '~/components/Button/ButtonToggleLike';
import { breakpoints } from '~/constants';
import { useModalActions } from '~/contexts/ModalContext';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { getImageProduct } from '~/lib/FuncHandler/getImageProduct';
import { LocalImageType } from '~/lib/ZodSchema/enum';
import { ButtonAddToCart } from '../../Button/ButtonAddToCart';
const ProductCardCarouselHorizontal = ({ data }: { data?: any }) => {
  const router = useRouter();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.xs}px)`);
  const { openModal } = useModalActions();
  const totalQuantityProduct = useMemo(() => {
    return (data?.availableQuantity || 0) + (data?.soldQuantity || 0);
  }, [data]);
  return (
    <Card
      radius={'md'}
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
            className={
              'visible flex items-center justify-center bg-[rgba(0,0,0,0.2)] transition-all duration-200 ease-in-out group-hover:visible lg:invisible'
            }
          >
            <Button.Group className='group-hover:animate-fadeTop'>
              <Tooltip label='Xem nhanh'>
                {isMobile ? (
                  <Button
                    size='xs'
                    p={5}
                    w={'max-content'}
                    variant='default'
                    className={`border-t-r-0 text-mainColor hover:text-subColor`}
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
              <ButtonToggleLike data={data} />
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
              product={{ ...data, quantity: 1 }}
              style={{}}
              handleAfterAdd={() => openModal('success', null, data)}
              notify={() => {}}
            />
            <Text
              onClick={() => {
                isMobile ? router.push(`/san-pham/${data?.tag}/danh-gia`) : openModal('comments', null, data);
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

      <Badge color='red' radius={'md'} pos={'absolute'} top={0} right={0} className='animate-wiggle'>
        {data?.rating !== 0 ? data?.rating.toFixed(1) : Number(5).toFixed(1)} ⭐
      </Badge>
    </Card>
  );
};
export default memo(ProductCardCarouselHorizontal);
