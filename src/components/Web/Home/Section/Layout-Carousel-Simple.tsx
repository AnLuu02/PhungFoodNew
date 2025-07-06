'use client';

import { Carousel, Embla } from '@mantine/carousel';
import { ActionIcon, Box, Card, CardSection, Center, Flex, rem, Space, Text, Title } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconPlayerPlayFilled } from '@tabler/icons-react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import BButton from '~/components/Button';

const RecipeModal = dynamic(() => import('~/components/Web/Home/components/recipe-modal'), { ssr: false });

const recipes = [
  {
    title: 'Cách làm mandu thịt, mandu kim chi và mandu rau củ',
    image: '/images/temp/mandu.jpg',
    duration: "30'",
    category: 'Trung bình',
    ingredients: [
      '300g thịt băm',
      '200g kim chi',
      '1 củ cà rốt',
      '2 cây hành lá',
      'Vỏ bánh mandu',
      'Gia vị: muối, tiêu, dầu mè'
    ],
    steps: [
      'Thịt băm trộn đều với gia vị, để khoảng 15 phút cho ngấm',
      'Cà rốt băm nhỏ, hành lá thái nhỏ',
      'Trộn đều thịt với rau củ',
      'Cho nhân vào giữa vỏ bánh, gấp đôi và dán mép',
      'Hấp bánh trong 15 phút là được'
    ],
    videoId: 'UPcT-I7D8Ic'
  },
  {
    title: 'Cách làm bánh tráng dừa mè nướng',
    image: '/images/temp/banhtrangduamenuong.jpg',
    duration: '1h',
    category: 'Trung bình',
    ingredients: ['Bánh tráng', 'Dừa nạo', 'Mè đen', 'Đường cát', 'Muối'],
    steps: [
      'Trộn dừa nạo với đường và một chút muối',
      'Rắc hỗn hợp dừa và mè lên bánh tráng',
      'Nướng bánh trên bếp than hoặc bếp gas đến khi giòn'
    ],
    videoId: 'z2jgI0OQcsE'
  },
  {
    title: 'Cách làm bánh xoài đào',
    image: '/images/temp/banhxoaidao.jpg',
    duration: "25'",
    category: 'Trung bình',
    ingredients: [],
    steps: [],
    videoId: 'vtrSVA_6EFY'
  },
  {
    title: 'Cách làm bánh xèo vịt miền Tây',
    image: '/images/temp/banhxeovit.jpg',
    duration: '1h',
    category: 'Trung bình',
    ingredients: [],
    steps: [],
    videoId: 'lJmBwDYY12k'
  }
];

const LayoutCarouselSimple = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<(typeof recipes)[0] | null>(null);
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
      <Card
        mih={500}
        h={{ base: 'max-content', md: 500 }}
        radius={'lg'}
        className='dark:bg-dark-card bg-gray-100'
        p={0}
      >
        <Flex direction={'column'} className='relative' h={'100%'} w={'100%'} p={'lg'}>
          <Flex
            align={'center'}
            justify={'space-between'}
            mb={20}
            direction={{ base: 'column', sm: 'row', md: 'row' }}
            gap={'md'}
          >
            <Title order={1} className='cursor-pointer font-quicksand font-bold hover:text-mainColor'>
              Video hướng dẫn
            </Title>

            <Flex align={'center'} justify={{ base: 'space-between' }}>
              <ActionIcon
                variant='subtle'
                radius={'50%'}
                size={'lg'}
                onClick={scrollPrev}
                disabled={!prevBtnEnabled}
                classNames={{ root: 'text-mainColor' }}
              >
                <IconChevronLeft size={'xs'} />
              </ActionIcon>
              <Space w={'xs'} />
              <ActionIcon
                variant='subtle'
                radius={'50%'}
                onClick={scrollNext}
                disabled={!nextBtnEnabled}
                classNames={{ root: 'text-mainColor' }}
                size={'lg'}
              >
                <IconChevronRight size={'xs'} />
              </ActionIcon>
            </Flex>
          </Flex>
          <Carousel
            w={'100%'}
            slideSize={{ base: '100%', sm: '50%', md: '25%' }}
            slideGap={rem(20)}
            h={320}
            dragFree
            align='start'
            containScroll='trimSnaps'
            withControls={false}
            slidesToScroll={1}
            getEmblaApi={setEmbla}
          >
            {recipes.map((recipe, index) => (
              <Carousel.Slide key={index} h={320}>
                <Card
                  radius={'md'}
                  shadow='sm'
                  padding='xl'
                  onClick={() => setSelectedRecipe(recipe)}
                  className='cursor-pointer'
                  h={320}
                >
                  <CardSection pos={'relative'} className='group/item cursor-pointer'>
                    <Box w={'100%'} h={210} pos={'relative'}>
                      <Image
                        loading='lazy'
                        style={{ objectFit: 'cover' }}
                        fill
                        src={
                          recipe.image ||
                          'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png'
                        }
                        alt='Recipe Image'
                      />
                    </Box>
                    <Box
                      pos={'absolute'}
                      left={0}
                      top={0}
                      h='100%'
                      w='100%'
                      className={clsx(
                        'visible flex items-center justify-center bg-[rgba(0,0,0,0.2)] transition-all duration-200 ease-in-out group-hover/item:invisible'
                      )}
                    >
                      <Center className='group-hover/item:animate-fadeBottom'>
                        <ActionIcon
                          className='duration-100 ease-in-out hover:opacity-70'
                          color='white'
                          radius={'xl'}
                          size={'xl'}
                          variant='outline'
                        >
                          <IconPlayerPlayFilled />
                        </ActionIcon>
                      </Center>
                    </Box>
                  </CardSection>
                  <Text size={'sx'} fw={700} className='text-center hover:text-mainColor' py={'xs'}>
                    {recipe.title}
                  </Text>
                </Card>
              </Carousel.Slide>
            ))}
          </Carousel>
          <Flex align={'center'} justify={'center'} mt={30}>
            <BButton title={'Xem tất cả'} variant='outline' size='sm' />
          </Flex>
        </Flex>
      </Card>
      <RecipeModal
        recipe={selectedRecipe || recipes[0]}
        opened={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </>
  );
};

export default LayoutCarouselSimple;
