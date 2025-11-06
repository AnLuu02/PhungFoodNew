'use client';
import { Carousel, Embla } from '@mantine/carousel';
import { ActionIcon, Card, Flex, Space, StyleProp, Text, Title } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import BButton from '~/components/Button/Button';

const LayoutGridCarouselOnly = ({
  data,
  title,
  navigation,
  minHeight,
  configs = {
    slideSize: { base: '100%', sm: '33.3333%', md: '25%', xl: '20%' },
    h: 320
  },
  CardElement
}: {
  data: any;
  title?: string;
  configs?: {
    slideSize?: StyleProp<string | number> | undefined;
    h?: any;
  };
  navigation?: {
    href: string;
    label: string;
  };
  minHeight?: string | number;
  CardElement: React.ComponentType<{ data: any }>;
}) => {
  const dataRender = data || [];
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
    <Card mih={minHeight || 500} h={'max-content'} radius={'lg'} className='bg-gray-100 dark:bg-dark-background' p={0}>
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
              radius={'50%'}
              size={'lg'}
              onClick={scrollPrev}
              className='bg-mainColor duration-200 hover:bg-subColor disabled:bg-transparent'
              disabled={!prevBtnEnabled}
            >
              <IconChevronLeft size={30} />
            </ActionIcon>
            <Space w={'xs'} />
            <ActionIcon
              className='bg-mainColor duration-200 hover:bg-subColor disabled:bg-transparent'
              radius={'50%'}
              size={'lg'}
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
            >
              <IconChevronRight size={30} />
            </ActionIcon>
          </Flex>
        </Flex>
        {dataRender?.length === 0 ? (
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
              slideSize={configs?.slideSize}
              slideGap={20}
              h={configs?.h}
              align='start'
              withControls={false}
              withIndicators
              getEmblaApi={setEmbla}
              containScroll='trimSnaps'
              slidesToScroll={1}
              pos={'relative'}
            >
              {dataRender?.map((item: any, index: number) => (
                <Carousel.Slide key={index} className={`overflow-hidden`}>
                  <CardElement data={item} />
                </Carousel.Slide>
              ))}
            </Carousel>
            {navigation && (
              <Flex align={'center'} justify={'center'} my={30}>
                <Link href={navigation.href || `/thuc-don?loai=san-pham-moi`}>
                  <BButton children={navigation.label || 'Xem tất cả'} variant='outline' radius={'xl'} />
                </Link>
              </Flex>
            )}
          </>
        )}
      </Flex>
    </Card>
  );
};

export default LayoutGridCarouselOnly;
