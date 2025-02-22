'use client';
import { Carousel } from '@mantine/carousel';
import { Card, Flex, Grid, GridCol, Image, rem, Title } from '@mantine/core';
import clsx from 'clsx';
import BButton from '~/app/_components/Button';
import ProductCardCarouselVertical from '../_Components/ProductCardCarouselVertical';

type ITypeProduct = {
  title?: string;
  navbar?: Array<{ label: string; key: string; url: string }>;
  data?: {};
  image_1?: string;
  image_2?: string;
  imgaePositon?: 'left' | 'right';
};

const LayoutProductCarouselWithImage2 = ({ title, imgaePositon = 'left', navbar }: ITypeProduct) => {
  return (
    <Card h={{ base: 'max-content', md: 500 }} radius={'lg'} bg={'gray.1'} p={0}>
      <Grid className='relative' h={'100%'} w={'100%'} p={'lg'}>
        <GridCol span={12} h={'15%'}>
          <Flex
            align={'center'}
            justify={'space-between'}
            direction={{ base: 'column', sm: 'row', md: 'row' }}
            gap={'md'}
          >
            <Title
              order={1}
              className='cursor-pointer font-quicksand font-bold text-black no-underline hover:text-[#008b4b]'
            >
              {title || 'Thịt nhập khẩu'}
            </Title>

            <Flex align={'center'} gap={'xs'} wrap={'wrap'}>
              {navbar && navbar?.length > 0 ? (
                navbar?.map((item: any, index: number) => {
                  return (
                    <BButton
                      size='sm'
                      radius='xl'
                      variant='outline'
                      key={`${item.label}+${index}`}
                      title={item.label}
                    />
                  );
                })
              ) : (
                <></>
              )}
            </Flex>
          </Flex>
        </GridCol>
        <GridCol span={12} h={'85%'}>
          <Flex h={'100%'} direction={{ base: 'column', sm: 'row', md: 'row' }} gap={'md'}>
            <Flex
              direction={'column'}
              gap={20}
              align={'center'}
              justify={'space-between'}
              h={'100%'}
              w={'25%'}
              className={clsx(imgaePositon && 'order-2', 'hidden md:block')}
            >
              <Image
                loading='lazy'
                src='/images/webp/img_3banner_1.webp'
                alt='Restaurant Image 1'
                w={'100%'}
                h={190}
                className='cursor-pointer rounded-xl transition-all duration-500 ease-in-out hover:scale-105'
              />
              <Image
                loading='lazy'
                src='/images/webp/img_3banner_2.webp'
                alt='Restaurant Image 1'
                h={190}
                w={'100%'}
                className='cursor-pointer rounded-xl transition-all duration-500 ease-in-out hover:scale-105'
              />
            </Flex>
            <Flex
              direction={'column'}
              h={'100%'}
              w={{ base: '100%', md: '75%' }}
              p={{ base: 0, md: 'lg' }}
              pt={0}
              className={clsx('relative', imgaePositon && 'order-1')}
            >
              <Carousel
                w={'100%'}
                slideSize={{ base: '100%', sm: '50%', md: '33.33333%', xl: '25%' }}
                slideGap={rem(20)}
                h={320}
                dragFree
                containScroll='trimSnaps'
                align='start'
                withControls={false}
                slidesToScroll={1}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((testimonial, index) => (
                  <Carousel.Slide key={index} h={320}>
                    <ProductCardCarouselVertical />
                  </Carousel.Slide>
                ))}
              </Carousel>
              <Flex align={'center'} justify={'center'} mt={30}>
                <BButton title={'Xem tất cả'} variant='outline' size='sm' />
              </Flex>
            </Flex>
          </Flex>
        </GridCol>
      </Grid>
    </Card>
  );
};

export default LayoutProductCarouselWithImage2;
