'use client';
import { Carousel, CarouselSlide, Embla } from '@mantine/carousel';
import { ActionIcon, Box, Center, Divider, Group } from '@mantine/core';
import { IconCheese, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { memo, useCallback, useEffect, useState } from 'react';
import Empty from '~/components/Empty';
import Reveal from '~/components/Reveal';
import { ProductBase } from '~/shared/type-trpc/product.type-trpc';
import ProductCardCarouselVertical from '../../Card/CardProductCarouselVertical';
import { CarouselSkeleton } from './CarouselSkeleton';

const TabsPanelCarousel = ({
  data,
  loading,
  fetching,
  posNav = 'left'
}: {
  data: ProductBase[];
  loading: boolean;
  fetching: boolean;
  posNav?: 'left' | 'right' | 'none';
}) => {
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
      <Center mb={'md'} className='sm:hidden'>
        <Divider
          variant='dashed'
          size={'sm'}
          w={'60%'}
          classNames={{
            root: 'border-mainColor'
          }}
          labelPosition='center'
          label={
            <>
              <IconCheese size={12} className='italic' />
              <Box ml={5} className='italic'>
                Sản phẩm
              </Box>
            </>
          }
        />
      </Center>
      {posNav !== 'none' && (
        <Center mb={{ base: 20, md: 0 }} className='hidden sm:block'>
          <Group
            gap={5}
            pos={{ base: 'relative', sm: 'absolute', md: 'absolute' }}
            top={{ base: 0, sm: 20, md: 20 }}
            className={`${posNav === 'left' ? 'left-0 sm:left-[10px] md:left-[20px]' : 'md:right[-2px]0 right-0 sm:right-[10px]'}`}
          >
            <ActionIcon
              radius={'50%'}
              size={'lg'}
              onClick={scrollPrev}
              className='bg-mainColor duration-200 hover:bg-subColor disabled:bg-transparent'
              disabled={!prevBtnEnabled}
            >
              <IconChevronLeft size={30} />
            </ActionIcon>
            <ActionIcon
              radius={'50%'}
              size={'lg'}
              onClick={scrollNext}
              className='bg-mainColor duration-200 hover:bg-subColor disabled:bg-transparent'
              disabled={!nextBtnEnabled}
            >
              <IconChevronRight size={30} />
            </ActionIcon>
          </Group>
        </Center>
      )}
      {loading ? (
        <>
          <CarouselSkeleton />
        </>
      ) : data?.length === 0 ? (
        <Empty content='' title='Không có sản phẩm phù hợp' hasButton={false} />
      ) : (
        <Carousel
          w='100%'
          slideSize={{ base: data?.length > 1 ? '70%' : '100%', sm: '33.33333%', md: '33.33333%', xl: '25%' }}
          slideGap={20}
          h={320}
          align='start'
          withControls={false}
          withIndicators
          slidesToScroll={1}
          getEmblaApi={setEmbla}
          containScroll='trimSnaps'
        >
          {data.map((product, index: number) => (
            <CarouselSlide key={index} h={320} style={{ opacity: fetching ? 0.6 : 1, transition: 'opacity 0.2s' }}>
              <Reveal key={product.id + index} x={(index + 1) * 2} delay={index * 0.01}>
                <ProductCardCarouselVertical data={product} key={product.id} />
              </Reveal>
            </CarouselSlide>
          ))}
        </Carousel>
      )}
    </>
  );
};

export default memo(TabsPanelCarousel);
