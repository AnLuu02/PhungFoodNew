'use client';
import { Carousel, CarouselSlide, Embla } from '@mantine/carousel';
import { ActionIcon, Card, CardSection, Center, Flex, Group, rem, Stack, Text, Tooltip } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

const TabsPanelCarouselSimple = ({ data }: any) => {
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
          top={{ base: 0, sm: 8, md: 0 }}
          right={0}
        >
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
          <ActionIcon
            variant='subtle'
            radius={'50%'}
            size={'lg'}
            onClick={scrollNext}
            className='bg-mainColor text-white hover:bg-mainColor/90 disabled:cursor-not-allowed disabled:opacity-40'
            disabled={!nextBtnEnabled}
          >
            <IconChevronRight size={'xs'} />
          </ActionIcon>
        </Group>
      </Center>
      {data?.length <= 0 ? (
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
          slideSize={{ base: '50%', xl: '11.11%', sm: '25%', md: '20%' }}
          slideGap='4px'
          h={200}
          dragFree
          align='start'
          withControls={false}
          withIndicators
          slidesToScroll={1}
          getEmblaApi={setEmbla}
          containScroll='trimSnaps'
        >
          {data?.map((item: any) => (
            <CarouselSlide key={item.id}>
              <Card
                radius={'md'}
                padding='lg'
                component='a'
                shadow='sm'
                withBorder
                h={200}
                href={`/thuc-don?danh-muc=${item?.category?.tag}&loai-san-pham=${item?.tag}`}
                className='hover:border-10 dark:bg-dark-card cursor-pointer bg-gray-100 hover:border-mainColor hover:shadow-lg dark:hover:border-mainColor/50 dark:hover:shadow-lg'
              >
                <CardSection>
                  <div style={{ position: 'relative', width: '100%', height: '120px' }}>
                    <Image
                      style={{ objectFit: 'cover' }}
                      loading='lazy'
                      src={item?.image?.url || '/images/jpg/empty-300x240.jpg'}
                      fill
                      alt={item?.name || 'Cà chua'}
                    />
                  </div>
                </CardSection>
                <Stack gap={rem(1)} mt={'xs'} align='center'>
                  <Tooltip label={item?.name || 'Cà chua'} withArrow>
                    <Text size={'md'} fw={700} lineClamp={1} className='hover:text-mainColor'>
                      {item?.name || 'Cà chua'}
                    </Text>
                  </Tooltip>
                  <Text c='dimmed' size='xs'>
                    {item?.product?.length || 0} sản phẩm
                  </Text>
                </Stack>
              </Card>
            </CarouselSlide>
          ))}
        </Carousel>
      )}
    </>
  );
};

export default TabsPanelCarouselSimple;
