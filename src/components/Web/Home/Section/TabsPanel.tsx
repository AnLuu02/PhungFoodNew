'use client';
import { Carousel, CarouselSlide, Embla } from '@mantine/carousel';
import { ActionIcon, Center, Flex, Group, Text } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Image from 'next/image';
import { memo, useCallback, useEffect, useState } from 'react';
import ProductCardCarouselVertical from '../../Card/CardProductCarouselVertical';

const TabsPanelCarousel = ({ data }: any) => {
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
    <>
      <Center mb={{ base: 20, md: 0 }}>
        <Group
          gap={5}
          pos={{ base: 'relative', sm: 'absolute', md: 'absolute' }}
          top={{ base: 0, sm: 20, md: 20 }}
          left={{ base: 0, sm: 10, md: 20 }}
        >
          <ActionIcon
            radius={'50%'}
            size={'lg'}
            onClick={scrollPrev}
            className='bg-mainColor duration-200 hover:bg-subColor disabled:bg-transparent'
            disabled={!prevBtnEnabled}
          >
            <IconChevronLeft size={'xs'} />
          </ActionIcon>
          <ActionIcon
            radius={'50%'}
            size={'lg'}
            onClick={scrollNext}
            className='bg-mainColor duration-200 hover:bg-subColor disabled:bg-transparent'
            disabled={!nextBtnEnabled}
          >
            <IconChevronRight size={'xs'} />
          </ActionIcon>
        </Group>
      </Center>
      {data?.length === 0 ? (
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
        <Carousel
          w='100%'
          slideSize={{ base: '100%', sm: '33.33333%', md: '33.33333%', xl: '25%' }}
          slideGap={20}
          h={320}
          align='start'
          withControls={false}
          withIndicators
          slidesToScroll={1}
          getEmblaApi={setEmbla}
          containScroll='trimSnaps'
        >
          {data.map((product: any, index: number) => (
            <CarouselSlide key={index} h={320}>
              <ProductCardCarouselVertical data={product} key={product.id} />
            </CarouselSlide>
          ))}
        </Carousel>
      )}
    </>
  );
};

export default memo(TabsPanelCarousel);
