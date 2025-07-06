'use client';
import { Carousel, Embla } from '@mantine/carousel';
import { ActionIcon, Card, Flex, rem, Space, Text, Title } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import BButton from '~/components/Button';
import ProductCardCarouselVertical from '../components/ProductCardCarouselVertical';

type ISectionNoNav = {
  data?: any;
  title?: string;
};

const LayoutProductCarouselOnly = ({ data, title }: ISectionNoNav) => {
  const products = data || [];

  const [embla, setEmbla] = useState<Embla | null>(null);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (embla) {
      embla.on('select', onSelect);
      onSelect();
    }
  }, [embla, onSelect]);

  return (
    <Card mih={500} h={{ base: 'max-content', md: 500 }} radius={'lg'} className='bg-gray-100 dark:bg-dark-card' p={0}>
      <Flex direction={'column'} className='relative' h={'100%'} w={'100%'} p={'lg'}>
        <Flex
          align={'center'}
          justify={'space-between'}
          mb={20}
          direction={{ base: 'column', sm: 'row', md: 'row' }}
          gap={'md'}
        >
          <Title
            order={2}
            className='cursor-pointer font-quicksand font-bold text-black hover:text-mainColor dark:text-dark-text'
          >
            {title || 'Sản phẩm mới'}
          </Title>

          <Flex align={'center'} justify={{ base: 'space-between' }}>
            <ActionIcon
              variant='subtle'
              radius={'50%'}
              size={'lg'}
              onClick={scrollPrev}
              className='bg-mainColor text-white hover:bg-mainColor/90 disabled:cursor-not-allowed disabled:opacity-40'
              disabled={!prevBtnEnabled}
            >
              <IconChevronLeft size={'xs'} />
            </ActionIcon>
            <Space w={'xs'} />
            <ActionIcon
              variant='subtle'
              className='bg-mainColor text-white hover:bg-mainColor/90 disabled:cursor-not-allowed disabled:opacity-40'
              radius={'50%'}
              size={'lg'}
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
            >
              <IconChevronRight size={'xs'} />
            </ActionIcon>
          </Flex>
        </Flex>
        {products?.length <= 0 ? (
          <Flex direction={'column'} justify={'center'} align={'center'} py={10}>
            <Image
              style={{ objectFit: 'cover' }}
              loading='lazy'
              src={'/images/png/empty_cart.png'}
              width={100}
              height={100}
              alt={'empty cart'}
            />
            <Text size='xl' fw={700} c={'dimmed'}>
              Không có sản phẩm phù hợp
            </Text>
          </Flex>
        ) : (
          <>
            <Carousel
              w={'100%'}
              slideSize={{ base: '100%', sm: '33.3333%', md: '25%', xl: '20%' }}
              slideGap={rem(20)}
              h={320}
              dragFree
              align='start'
              withControls={false}
              withIndicators
              getEmblaApi={setEmbla}
              containScroll='trimSnaps'
              slidesToScroll={1}
            >
              {products?.map((item: any, index: number) => (
                <Carousel.Slide key={index} h={320}>
                  <ProductCardCarouselVertical product={item} key={index} />
                </Carousel.Slide>
              ))}
            </Carousel>
            <Flex align={'center'} justify={'center'} mt={30}>
              <Link href={`/thuc-don?loai=san-pham-moi`}>
                <BButton title={'Xem tất cả'} variant='outline' size='sm' />
              </Link>
            </Flex>
          </>
        )}
      </Flex>
    </Card>
  );
};

export default LayoutProductCarouselOnly;
