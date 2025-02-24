'use client';
import { Badge, Box, Button, Card, Flex, Group, Image, Progress, Text, Tooltip } from '@mantine/core';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';
import { ImageType } from '@prisma/client';
import { IconEye, IconHeart } from '@tabler/icons-react';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import BButton from '~/app/_components/Button';
import { useModal } from '~/app/contexts/ModalContext';
import { breakpoints } from '~/app/lib/utils/constants/device';
import { formatPriceLocaleVi } from '~/app/lib/utils/format/formatPrice';
import { getImageProduct } from '~/app/lib/utils/func-handler/getImageProduct';
import { NotifyError } from '~/app/lib/utils/func-handler/toast';
const ProductCardCarouselHorizontal = ({ data }: { data?: any }) => {
  const [cart, setCart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const { data: user } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.sm}px)`);
  const { openModal } = useModal();

  return (
    <Card radius={'md'} withBorder bg={'white'} p={0} pos={'relative'}>
      <Flex h={162} gap={'xs'}>
        <Box w={'36%'} className='group/item relative flex cursor-pointer items-center justify-center'>
          <Image
            loading='lazy'
            src={getImageProduct(data?.images || [], ImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg'}
            w={'100%'}
            h={'100%'}
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
                  className={clsx('text-[#008b4b] hover:text-[#f8c144]')}
                >
                  <IconEye />
                </Button>
              </Tooltip>
              <Tooltip label='Thêm vào yêu thích'>
                <Button
                  size='xs'
                  p={5}
                  className={clsx('text-[#008b4b] hover:text-[#f8c144]')}
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
          <Link href={`/san-pham/${data?.tag}`} className='no-underline'>
            <Tooltip label={data?.name}>
              <Text
                lineClamp={1}
                size='md'
                fw={700}
                className='cursor-pointer text-center text-black hover:text-[#008b4b]'
              >
                {data?.name || 'Cá thu'}
              </Text>
            </Tooltip>
          </Link>
          <Flex direction={'column'} w={'100%'}>
            <Progress
              size={'sm'}
              color={'#008b4b'}
              value={((data?.soldQuantity || 0) / (data?.availableQuantity || 0)) * 100}
            />
            <Flex align={'center'} justify={'space-between'}>
              <Text size='xs' c={'dimmed'}>
                Đã bán: {data?.soldQuantity || 0}/{data?.availableQuantity || 0}
              </Text>
              <Text size='xs' className='text-[#008b4b]'>
                {(((data?.soldQuantity || 0) / (data?.availableQuantity || 0)) * 100)?.toFixed(2)}%
              </Text>
            </Flex>
          </Flex>
          <Group>
            <Text size='sm' c={'dimmed'} td='line-through'>
              {formatPriceLocaleVi(data?.price || 0)}
            </Text>
            <Text size='md' fw={700} className='text-[#008b4b]'>
              {formatPriceLocaleVi((data?.price || 0) - (data?.discount || 0))}
            </Text>
          </Group>
          <Flex align={'center'} gap={10} justify={'space-between'}>
            <BButton
              onClick={() => {
                const existingItem = cart.find((item: any) => item.id === data?.id);
                if (existingItem) {
                  setCart(
                    cart.map((item: any) =>
                      item.id === data?.id ? { ...item, quantity: 1 + existingItem.quantity } : item
                    )
                  );
                } else {
                  setCart([...cart, { ...data, quantity: 1 }]);
                }
                openModal('success', null, data);
              }}
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
              className='cursor-pointer text-gray-400 transition-all duration-200 ease-in-out hover:text-[#f8c144] hover:underline'
            >
              Có {data?.total_rating || 0} đánh giá
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
        {data?.rating.toFixed(1) || 0} ⭐
      </Badge>
    </Card>
  );
};
export default ProductCardCarouselHorizontal;
