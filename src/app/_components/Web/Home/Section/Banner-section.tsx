'use client';

import { Carousel, type Embla } from '@mantine/carousel';
import { Box, Flex, Image, Paper, rem, SimpleGrid, Text } from '@mantine/core';
import { ImageType } from '@prisma/client';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function BannerSection({ banner }: any) {
  const [embla, setEmbla] = useState<Embla | null>(null);

  useEffect(() => {
    if (!embla) return;

    const autoplay = setInterval(() => {
      if (!embla) return;

      if (embla.canScrollNext()) {
        embla.scrollNext();
      } else {
        embla.scrollTo(0);
      }
    }, 5000);

    return () => clearInterval(autoplay);
  }, [embla]);

  const gallery = banner?.images?.filter((image: any) => image?.type === ImageType.GALLERY) || [];
  const banners = banner?.images?.filter((image: any) => image?.type === ImageType.BANNER) || [];

  const slides = gallery.map((slide: any) => (
    <Carousel.Slide key={slide.id} className='rounded-md'>
      <Box className='relative h-[400px] overflow-hidden rounded-md bg-gradient-to-b from-[#E1F5FE] to-[#FFF9C4]'>
        <Image src={slide.url || '/placeholder.svg'} alt={slide.altText} w={'100%'} h='100%' className='rounded-md' />
      </Box>
    </Carousel.Slide>
  ));

  return (
    <Box py='xl'>
      <Flex gap='md' direction={{ base: 'column', lg: 'row' }}>
        {/* Left side - Carousel */}
        <Box w={{ base: '100%', lg: '66.666667%' }}>
          <Carousel
            withControls
            withIndicators
            loop
            getEmblaApi={setEmbla}
            nextControlIcon={<IconChevronRight size={24} />}
            previousControlIcon={<IconChevronLeft size={24} />}
            controlSize={40}
            color='black'
            styles={{
              control: {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: 'none'
              },
              indicators: {
                bottom: 16
              },
              indicator: {
                width: rem(20),
                height: rem(8),
                backgroundColor: '#008b4b',
                margin: '0 6px'
              }
            }}
          >
            {slides}
          </Carousel>
        </Box>

        {/* Right side - Static banners */}
        <Flex
          direction={{ base: 'column', sm: 'row', md: 'row', lg: 'column' }}
          align='center'
          justify='space-between'
          w={{ base: '100%', lg: '33.333333%' }}
          className='hidden xl:flex'
        >
          {/* Top banner */}
          <Paper w={'100%'} h={190} className='relative overflow-hidden' radius={'md'}>
            <Image src={banners?.[0]?.url || '/images/jpg/empty-300x240.jpg'} alt={''} w={'100%'} h='100%' />
          </Paper>

          {/* Bottom banner */}
          <Paper w={'100%'} h={190} className='relative overflow-hidden' radius={'md'}>
            <Image src={banners?.[1]?.url || '/images/jpg/empty-300x240.jpg'} alt={''} w={'100%'} h='100%' />
          </Paper>
        </Flex>
      </Flex>

      {/* Service icons section */}
      <Box mt='md'>
        <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }} spacing='md'>
          {[
            { icon: '🍽️', title: 'Gọi món', href: '/thuc-don' },
            { icon: '👨‍🍳', title: 'Tư vấn món ăn' },
            { icon: '📍', title: 'Tìm nhà hàng', href: '/lien-he' },
            { icon: '🧾', title: 'Đơn hàng của tôi', href: '/don-hang-cua-toi' },
            { icon: '🎉', title: 'Đặt bàn & sự kiện' },
            { icon: '⭐', title: 'Đánh giá & phản hồi' }
          ].map((service, index) => (
            <Link href={service.href || ''} key={index}>
              <Paper
                key={index}
                bg={'gray.1'}
                className='flex cursor-pointer items-center justify-center transition-shadow hover:shadow-md'
                radius={'md'}
                p={'sm'}
                h={'100%'}
                shadow='xs'
              >
                <Flex align={'center'} gap={'xs'}>
                  <Text size='2rem'>{service.icon}</Text>
                  <Text fw={700} c='gray.8' size='md'>
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
