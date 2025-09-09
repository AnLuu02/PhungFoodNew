'use client';

import { Carousel } from '@mantine/carousel';
import { Box, Flex, Paper, SimpleGrid, Text } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { LocalImageType } from '~/lib/zod/EnumType';

export default function BannerSection({ banner }: any) {
  const autoplay = useMemo(() => Autoplay({ delay: 5000 }), []);
  const gallery = banner?.images?.filter((image: any) => image?.type === LocalImageType.GALLERY) || [];
  const banners = banner?.images?.filter((image: any) => image?.type === LocalImageType.BANNER) || [];

  const slides = gallery.map((slide: any) => (
    <Carousel.Slide key={slide.id} className='rounded-md'>
      <Box className='relative h-[400px] overflow-hidden rounded-md bg-gradient-to-b from-[#E1F5FE] to-[#FFF9C4]'>
        <Image
          style={{ objectFit: 'cover' }}
          src={slide.url || '/images/jpg/empty-300x240.jpg'}
          alt={slide.altText}
          fill
          className='rounded-md'
        />
      </Box>
    </Carousel.Slide>
  ));

  return (
    <Box>
      <Flex gap='md' direction={{ base: 'column', lg: 'row' }}>
        <Box w={{ base: '100%', lg: '66.666667%' }}>
          <Carousel
            withControls
            withIndicators
            loop
            plugins={[autoplay]}
            nextControlIcon={<IconChevronRight size={24} />}
            previousControlIcon={<IconChevronLeft size={24} />}
            controlSize={40}
            color='black'
            classNames={{
              control: 'border-none bg-white/80 text-sm font-bold text-mainColor',
              indicators: 'bottom-4',
              indicator: 'mx-[6px] h-[8px] w-[20px] rounded-full bg-mainColor transition'
            }}
          >
            {slides}
          </Carousel>
        </Box>

        <Flex
          direction={{ base: 'column', sm: 'row', md: 'row', lg: 'column' }}
          align='center'
          justify='space-between'
          w={{ base: '100%', lg: '33.333333%' }}
          className='hidden lg:flex'
        >
          <Paper w={'100%'} h={190} className='relative overflow-hidden' radius={'md'}>
            <Image
              style={{ objectFit: 'cover' }}
              src={banners?.[0]?.url || '/images/jpg/empty-300x240.jpg'}
              alt={''}
              fill
            />
          </Paper>

          <Paper w={'100%'} h={190} className='relative overflow-hidden' radius={'md'}>
            <Image
              style={{ objectFit: 'cover' }}
              src={banners?.[1]?.url || '/images/jpg/empty-300x240.jpg'}
              alt={''}
              fill
            />
          </Paper>
        </Flex>
      </Flex>

      <Box mt='md'>
        <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }} spacing='md'>
          {[
            { icon: '🍽️', title: 'Gọi món', href: '/thuc-don' },
            { icon: '👨‍🍳', title: 'Tư vấn món ăn' },
            { icon: '📍', title: 'Tìm nhà hàng', href: '/lien-he' },
            { icon: '🛒', title: 'Đơn hàng', href: '/don-hang-cua-toi' },
            { icon: '📜', title: 'Chính sách', href: '/chinh-sach' },
            { icon: '⭐', title: 'Đánh giá' }
          ].map((service, index) => (
            <Link href={service.href || ''} key={index}>
              <Paper
                key={index}
                className='flex cursor-pointer items-center justify-center bg-gray-100 transition-shadow hover:shadow-md dark:bg-dark-background dark:text-dark-text'
                radius={'md'}
                p={'sm'}
                h={'100%'}
                shadow='xs'
              >
                <Flex align={'center'} gap={'xs'}>
                  <Text size='2rem'>{service.icon}</Text>
                  <Text fw={700} className='text-gray-800 dark:text-gray-500' size='md'>
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
