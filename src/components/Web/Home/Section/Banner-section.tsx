'use client';

import { Carousel } from '@mantine/carousel';
import { Box, Flex, Paper, SimpleGrid, Text } from '@mantine/core';
import { ImageType } from '@prisma/client';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef } from 'react';

export default function BannerSection({ banner }: any) {
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const [gallery, banners] = useMemo(() => {
    return banner?.imageForEntities?.reduce(
      (acc: any, item: any) => {
        if (item?.type === ImageType.GALLERY) {
          acc[0].push(item?.image);
        } else if (item?.type === ImageType.THUMBNAIL) {
          acc[1].push(item?.image);
        }
        return acc;
      },
      [[], []]
    );
  }, [banner]);

  return (
    <Box>
      <Flex gap='md' direction={{ base: 'column', lg: 'row' }}>
        <Box
          w={{ base: '100%', lg: '66.666667%' }}
          className='animate-fadeUp sm:h-fit'
          style={{ animationDuration: '0.5s' }}
        >
          <Carousel
            withControls
            withIndicators
            loop
            plugins={[autoplay.current]}
            nextControlIcon={<IconChevronRight />}
            previousControlIcon={<IconChevronLeft />}
            controlSize={40}
            color='black'
            classNames={{
              root: 'group duration-200',
              control: 'border-none text-sm font-bold text-mainColor group-hover:bg-subColor/10',
              controls: 'opacity-50 duration-200 group-hover:opacity-100',
              indicators: 'bottom-4 opacity-50 duration-200 group-hover:opacity-100',
              indicator: 'mx-[6px] h-[8px] w-[20px] rounded-full bg-mainColor transition duration-200'
            }}
          >
            {(gallery?.length > 0 ? gallery : [{ url: '/images/jpg/empty-300x240.jpg', altText: 'empty' }])?.map(
              (slide: any) => (
                <Carousel.Slide key={slide.id} className='rounded-md'>
                  <Box className='relative h-[160px] overflow-hidden rounded-md bg-gradient-to-b from-[#E1F5FE] to-[#FFF9C4] sm:h-[400px]'>
                    <Image
                      style={{ objectFit: 'fill' }}
                      src={slide.url || '/images/jpg/empty-300x240.jpg'}
                      alt={slide.altText}
                      fill
                      className='rounded-md'
                    />
                  </Box>
                </Carousel.Slide>
              )
            )}
          </Carousel>
        </Box>
        <Flex
          direction={{ base: 'column', sm: 'row', md: 'row', lg: 'column' }}
          align='center'
          justify='space-between'
          w={{ base: '100%', lg: '33.333333%' }}
          gap={'md'}
          className='hidden lg:flex'
        >
          {[
            ...banners,
            { url: '/images/jpg/empty-300x240.jpg', altText: 'empty_banner1' },
            { url: '/images/jpg/empty-300x240.jpg', altText: 'empty_banner2' }
          ]
            ?.slice(0, 2)
            ?.map((banner: any, index: number) => (
              <Paper
                key={index}
                w={'100%'}
                h={190}
                className='relative animate-fadeUp overflow-hidden'
                radius={'md'}
                style={{ animationDuration: `${index * 0.05 + 0.5}s` }}
              >
                <Link href={'/thuc-don'}>
                  <Image
                    style={{ objectFit: 'cover' }}
                    src={banner?.url || '/images/jpg/empty-300x240.jpg'}
                    alt={''}
                    fill
                  />
                </Link>
              </Paper>
            ))}
        </Flex>
      </Flex>

      <Box mt='md'>
        <SimpleGrid cols={{ base: 3, sm: 3, md: 6 }} spacing={{ base: 'xs', sm: 'md' }}>
          {[
            { icon: '🍽️', title: 'Gọi món', href: '/thuc-don' },
            { icon: '👨‍🍳', title: 'Tư vấn' },
            { icon: '📍', title: 'Tìm nhà hàng', href: '/lien-he' },
            { icon: '🛒', title: 'Đơn hàng', href: '/don-hang-cua-toi' },
            { icon: '📜', title: 'Chính sách', href: '/chinh-sach' },
            { icon: '⭐', title: 'Đánh giá' }
          ].map((service, index) => (
            <Link
              href={service.href || ''}
              key={index}
              className='animate-fadeUp'
              style={{ animationDuration: `${index * 0.05 + 0.5}s` }}
            >
              <Paper
                key={index}
                className='flex cursor-pointer items-center justify-center bg-gray-100 transition-shadow hover:shadow-md dark:bg-dark-background dark:text-dark-text'
                radius={'md'}
                h={'100%'}
                shadow='xs'
              >
                <Flex align={'center'} gap={'xs'}>
                  <Text className='text-[1rem] sm:text-[2rem]'>{service.icon}</Text>
                  <Text fw={700} className='text-[8px] text-gray-800 dark:text-gray-500 sm:text-base'>
                    {service.title}
                  </Text>
                </Flex>
              </Paper>
            </Link>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
