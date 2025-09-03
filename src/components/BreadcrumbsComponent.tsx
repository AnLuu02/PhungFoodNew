'use client';
import { Carousel } from '@mantine/carousel';
import { BackgroundImage, Box, Card, Flex, Skeleton, Text } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
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
      px={{ base: 10, sm: 30, md: 30, lg: 130 }}
      align={'center'}
      justify={'space-between'}
      py={'md'}
      className='bg-gray-100 text-black dark:bg-dark-card dark:text-dark-text'
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
            slideGap={{ base: 8, sm: 16 }}
            align='start'
            w={{ base: '72%', sm: '60%', md: '100%', lg: '60%' }}
            slidesToScroll={1}
            className='w-full'
            controlsOffset='xs'
            containScroll='trimSnaps'
            withControls
            previousControlIcon={<IconChevronLeft size={30} />}
            previousControlProps={{
              style: {
                color: 'white',
                borderRadius: 10,
                width: 40,
                height: 40,
                backgroundColor: '#00BFA6'
              }
            }}
            nextControlIcon={<IconChevronRight size={30} />}
            nextControlProps={{
              style: {
                color: 'white',
                borderRadius: 10,
                width: 40,
                height: 40,
                backgroundColor: '#00BFA6'
              }
            }}
          >
            {subCategoriesData?.length <= 0
              ? [1, 2, 3, 4, 5, 6].map(item => (
                  <Carousel.Slide key={item}>
                    <Card className='flex flex-col items-center justify-center bg-transparent text-white duration-100 ease-in-out hover:text-mainColor'>
                      <Card.Section>
                        <Skeleton circle height={130} width={130} />
                      </Card.Section>
                      <Skeleton height={8} mt={20} width='70%' />
                    </Card>
                  </Carousel.Slide>
                ))
              : subCategoriesData.map((item: any) => (
                  <Carousel.Slide key={item.id}>
                    <Link href={`/thuc-don?danh-muc=${item.category?.tag}&loai-san-pham=${item.tag}`}>
                      <Card className='flex flex-col items-center justify-center bg-transparent text-white duration-100 ease-in-out hover:text-mainColor'>
                        <Card.Section>
                          <Image
                            loading='lazy'
                            style={{ objectFit: 'cover' }}
                            src={
                              item?.image?.url ||
                              'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png'
                            }
                            height={130}
                            width={130}
                            alt={item.name}
                            className='rounded-full'
                          />
                        </Card.Section>
                        <Text size='md' fw={700} mt={20} className='text-center'>
                          {item.name}
                        </Text>
                      </Card>
                    </Link>
                  </Carousel.Slide>
                ))}
          </Carousel>
        </Flex>
      </BackgroundImage>
    </Flex>
  );
};

export default BreadcrumbsComponent;
