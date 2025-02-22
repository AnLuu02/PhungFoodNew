'use client';
import { Carousel, CarouselSlide, Embla } from '@mantine/carousel';
import { ActionIcon, Center, Flex, Group, Image, rem, Text } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import ProductCardCarouselVertical from '../_Components/ProductCardCarouselVertical';

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
            variant='subtle'
            radius={'50%'}
            size={'lg'}
            onClick={scrollPrev}
            color='#008b4b'
            disabled={!prevBtnEnabled}
          >
            <IconChevronLeft size={'xs'} />
          </ActionIcon>
          <ActionIcon
            variant='subtle'
            radius={'50%'}
            size={'lg'}
            onClick={scrollNext}
            color='#008b4b'
            disabled={!nextBtnEnabled}
          >
            <IconChevronRight size={'xs'} />
          </ActionIcon>
        </Group>
      </Center>
      {data?.length <= 0 ? (
        <Flex direction={'column'} justify={'center'} align={'center'} py={10}>
          <Image loading='lazy' src={'/images/png/empty_cart.png'} w={100} h={100} alt={'empty cart'} />
          <Text size='xl' fw={700} c={'dimmed'}>
            Không có sản phẩm phù hợp
          </Text>
        </Flex>
      ) : (
        <Carousel
          w='100%'
          slideSize={{ base: '100%', sm: '50%', md: '33.33333%', xl: '25%' }}
          slideGap={{ base: rem(20) }}
          h={320}
          dragFree
          align='start'
          withControls={false}
          withIndicators
          slidesToScroll={1}
          getEmblaApi={setEmbla}
          containScroll='trimSnaps'
        >
          {data.map((product: any, index: number) => (
            <CarouselSlide key={index} h={320}>
              <ProductCardCarouselVertical product={product} key={product.id} />
            </CarouselSlide>
          ))}
        </Carousel>
      )}
    </>
  );
};

export default TabsPanelCarousel;
