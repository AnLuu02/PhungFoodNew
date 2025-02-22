'use client';
import { Carousel, CarouselSlide, Embla } from '@mantine/carousel';
import { ActionIcon, Card, CardSection, Center, Flex, Group, Image, rem, Stack, Text } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
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
                bg={'gray.1'}
                padding='lg'
                component='a'
                shadow='sm'
                withBorder
                h={200}
                href={`/thuc-don?danh-muc=${item?.category?.tag}&loai-san-pham=${item?.tag}`}
                className='hover:border-10 cursor-pointer hover:border-[#008b4b] hover:shadow-lg'
              >
                <CardSection>
                  <Image
                    loading='lazy'
                    src={item?.images[0]?.url || '/images/jpg/empty-300x240.jpg'}
                    height={120}
                    alt='Norway'
                  />
                </CardSection>
                <Stack gap={rem(1)} mt={'xs'} align='center'>
                  <Text size={'md'} fw={700}>
                    {item?.name || 'Cà chua'}
                  </Text>
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
