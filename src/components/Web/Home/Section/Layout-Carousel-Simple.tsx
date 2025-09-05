'use client';

import { Carousel, Embla } from '@mantine/carousel';
import { ActionIcon, Card, Flex, Space, Title } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import BButton from '~/components/Button';
import { useModal } from '~/contexts/ModalContext';
import { recipes } from '~/lib/data-test/recipe';
import RecipeCard from '../components/recip-card';

const LayoutCarouselSimple = () => {
  const { openModal } = useModal();
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
      <Card h={{ base: 'max-content', md: 530 }} radius={'lg'} className='bg-gray-100 dark:bg-dark-card' p={0}>
        <Flex direction={'column'} className='relative' h={'100%'} w={'100%'} p={'lg'}>
          <Flex
            align={'center'}
            justify={'space-between'}
            mb={20}
            direction={{ base: 'column', sm: 'row', md: 'row' }}
            gap={'md'}
          >
            <Title order={2} className='cursor-pointer font-quicksand font-bold hover:text-mainColor'>
              Video hướng dẫn
            </Title>

            <Flex align={'center'} justify={{ base: 'space-between' }}>
              <ActionIcon
                radius={'50%'}
                size={'lg'}
                onClick={scrollPrev}
                disabled={!prevBtnEnabled}
                className='bg-mainColor text-white hover:bg-mainColor/70 hover:text-white disabled:cursor-not-allowed disabled:bg-mainColor/70'
              >
                <IconChevronLeft size={'xs'} />
              </ActionIcon>
              <Space w={'xs'} />
              <ActionIcon
                radius={'50%'}
                onClick={scrollNext}
                disabled={!nextBtnEnabled}
                className='bg-mainColor text-white hover:bg-mainColor/70 hover:text-white disabled:cursor-not-allowed disabled:bg-mainColor/70'
                size={'lg'}
              >
                <IconChevronRight size={'xs'} />
              </ActionIcon>
            </Flex>
          </Flex>
          <Carousel
            w={'100%'}
            slideSize={{ base: '100%', sm: '50%', md: '25%' }}
            slideGap={20}
            h={420}
            align='center'
            containScroll='trimSnaps'
            withControls={false}
            slidesToScroll={1}
            getEmblaApi={setEmbla}
          >
            {recipes.map((recipe, index) => (
              <Carousel.Slide key={index} onClick={() => openModal('recipe', null, recipe)}>
                <RecipeCard recipe={recipe} />
              </Carousel.Slide>
            ))}
          </Carousel>
          <Flex align={'center'} justify={'center'} my={30}>
            <BButton title={'Xem tất cả'} variant='outline' size='sm' />
          </Flex>
        </Flex>
      </Card>
    </>
  );
};

export default LayoutCarouselSimple;
