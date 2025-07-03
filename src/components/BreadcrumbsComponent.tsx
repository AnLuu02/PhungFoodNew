'use client';
import { Carousel } from '@mantine/carousel';
import { BackgroundImage, Box, Card, Flex, rem, Skeleton, Text } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { getTagFromQuery } from '~/lib/func-handler/generateTag';
import BreadcrumbsBase from './BreadcrumbsBase';
const BreadcrumbsComponent = ({ subCategories }: any) => {
  const pathname = usePathname();
  const params = useSearchParams();
  const subCategoriesData = subCategories || [];
  return pathname === '/' ? (
    ''
  ) : pathname !== '/thuc-don' ? (
    <Flex
      pl={{ base: rem(20), lg: rem(130) }}
      pr={{ base: rem(20), lg: rem(130) }}
      align={'center'}
      justify={'space-between'}
      py={'md'}
      bg={'gray.1'}
    >
      <BreadcrumbsBase />
    </Flex>
  ) : (
    <Flex align={'center'} justify={'space-between'}>
      <BackgroundImage src='/images/jpg/breadcrumb_bg.jpg' h={400} w={'100%'} pos={'relative'} py={'md'}>
        <Flex direction={'column'} align={'center'} justify={'center'} className='relative z-10 py-8'>
          <Text size='sm' className='mb-2 text-center text-3xl font-bold text-green-400'>
            {getTagFromQuery(params)}
          </Text>
          <Box className='mb-8'>
            <BreadcrumbsBase />
          </Box>

          <Carousel
            slideSize={{ base: '33.333333%', sm: '25%', md: '20%', lg: '16.666667%' }}
            slideGap={{ base: rem(8), sm: rem(16) }}
            align='start'
            w={{ base: '72%', sm: '60%', md: '100%', lg: '60%' }}
            slidesToScroll={1}
            className='w-full'
            controlsOffset='xs'
            containScroll='trimSnaps'
            withControls
            nextControlProps={{
              style: { backgroundColor: '#008b4b', color: 'white', transform: 'translate(20px,-40px)' }
            }}
            previousControlProps={{
              style: { backgroundColor: '#008b4b', color: 'white', transform: 'translate(-20px,-40px)' }
            }}
            previousControlIcon={<IconChevronLeft size={30} />}
            nextControlIcon={<IconChevronRight size={30} />}
          >
            {subCategoriesData?.length <= 0
              ? [1, 2, 3, 4, 5, 6].map(item => (
                  <Carousel.Slide key={item}>
                    <Card className='flex flex-col items-center justify-center bg-transparent text-white duration-100 ease-in-out hover:text-[#008b4b]'>
                      <Card.Section>
                        <Skeleton circle height={130} width={130} />
                      </Card.Section>
                      <Skeleton height={8} mt={20} width='70%' />
                    </Card>
                  </Carousel.Slide>
                ))
              : subCategoriesData.map((category: any) => (
                  <Carousel.Slide key={category.id}>
                    <Card
                      className='flex flex-col items-center justify-center bg-transparent text-white duration-100 ease-in-out hover:text-[#008b4b]'
                      component='a'
                      href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'
                      target='_blank'
                    >
                      <Card.Section>
                        <Image
                          loading='lazy'
                          style={{ objectFit: 'cover' }}
                          src={
                            category?.image?.url ||
                            'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png'
                          }
                          height={130}
                          width={130}
                          alt={category.name}
                          className='rounded-full'
                        />
                      </Card.Section>
                      <Text size='md' fw={700} mt={20} className='text-center'>
                        {category.name}
                      </Text>
                    </Card>
                  </Carousel.Slide>
                ))}
          </Carousel>
        </Flex>
      </BackgroundImage>
    </Flex>
  );
};

export default BreadcrumbsComponent;
