'use client';

import { Carousel } from '@mantine/carousel';
import { Box, Card, Flex, Image, Text, rem } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { getTagFromQuery } from '~/app/lib/utils/func-handler/generateTag';
import { api } from '~/trpc/react';
import BreadcrumbsComponent from '../../Breadcrumbs';
export function BreadcrumbClient() {
  const params = useSearchParams();
  const { data } = api.SubCategory.getAll.useQuery();
  const categories = data ?? [];
  return (
    categories?.length > 0 && (
      <Box className='relative min-h-[300px] w-full py-5'>
        <Box className='bg-position-center filter-[brightness(0.7)] absolute inset-0 z-0 w-full bg-[url(/images/jpg/breadcrumb_bg.jpg)] bg-cover bg-no-repeat' />

        <Flex direction={'column'} align={'center'} justify={'center'} className='relative z-10 py-8'>
          <Text size='sm' className='mb-2 text-center text-3xl font-bold text-green-400'>
            {getTagFromQuery(params)}
          </Text>
          <Box className='mb-8'>
            <BreadcrumbsComponent />
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
            dragFree
            nextControlProps={{
              style: { backgroundColor: '#008b4b', color: 'white', transform: 'translate(20px,-40px)' }
            }}
            previousControlProps={{
              style: { backgroundColor: '#008b4b', color: 'white', transform: 'translate(-20px,-40px)' }
            }}
            previousControlIcon={<IconChevronLeft size={30} />}
            nextControlIcon={<IconChevronRight size={30} />}
          >
            {categories.map((category: any) => (
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
                      src={
                        category?.image?.url ||
                        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png'
                      }
                      h={130}
                      w={130}
                      radius={'50%'}
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
      </Box>
    )
  );
}
