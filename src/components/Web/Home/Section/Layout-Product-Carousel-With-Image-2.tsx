'use client';
import { Carousel } from '@mantine/carousel';
import { Box, Card, Flex, Grid, GridCol, rem, Tabs, TabsList, TabsPanel, TabsTab, Text, Title } from '@mantine/core';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import BButton from '~/components/Button';
import Empty from '~/components/Empty';
import ProductCardCarouselVertical from '../../Card/ProductCardCarouselVertical';

type ITypeProduct = {
  title?: string;
  navbar?: Array<{ label: string; key: string; url: string }>;
  data?: any;
  loai?: string;
  image_1?: string;
  image_2?: string;
  imgaePositon?: 'left' | 'right';
};

const LayoutProductCarouselWithImage2 = ({ data, title, imgaePositon = 'left', navbar }: ITypeProduct) => {
  const [tab, setTab] = useState<string>(navbar?.[0]?.key || 'rau-cu');
  const products = data[tab]?.products || [];

  return (
    <Card mih={500} h={{ base: 'max-content', md: 500 }} radius={'lg'} className='bg-gray-100' p={0}>
      <Tabs
        defaultValue='rau-cu'
        value={tab}
        onChange={value => setTab(value ?? 'rau-cu')}
        variant='pills'
        classNames={{
          tab: `mx-1 rounded-[30px] border border-mainColor px-4 py-[6px] text-mainColor transition-all duration-100 hover:bg-mainColor hover:text-subColor data-[active=true]:bg-mainColor data-[active=true]:text-subColor`
        }}
        className='relative'
        h={'100%'}
        p={'lg'}
        w={{ base: '100%', md: '100%' }}
      >
        <Grid className='relative' h={'100%'} w={'100%'}>
          <GridCol span={12}>
            <Flex
              align={'center'}
              justify={'space-between'}
              direction={{ base: 'column', sm: 'row', md: 'row' }}
              gap={'md'}
            >
              <Title order={1} className='cursor-pointer font-quicksand font-bold text-black hover:text-mainColor'>
                {title || 'Thịt nhập khẩu'}
              </Title>

              <Flex align={'center'} justify={'flex-end'} direction={{ base: 'column-reverse', sm: 'row', md: 'row' }}>
                <TabsList justify='center'>
                  <Flex align={'center'}>
                    {navbar?.map((item, index) => (
                      <TabsTab value={item.key} size={'xl'} key={index}>
                        <Text size='md' fw={700}>
                          {item.label}
                        </Text>
                      </TabsTab>
                    ))}
                  </Flex>
                </TabsList>
              </Flex>
            </Flex>
          </GridCol>
          <GridCol span={12} h={'85%'}>
            <Flex direction={{ base: 'column', sm: 'row', md: 'row' }} gap={'md'} justify={'space-between'}>
              <Flex
                direction={'column'}
                align={'center'}
                justify={'space-between'}
                h={'100%'}
                w={{ base: 0, sm: 0, md: '40%', lg: '25%' }}
                className={clsx(imgaePositon && 'order-2', 'hidden md:block', 'overflow-hidden')}
              >
                <Box
                  mb={'xs'}
                  w={'100%'}
                  h={190}
                  className='cursor-pointer overflow-hidden rounded-xl'
                  pos={'relative'}
                >
                  <Image
                    style={{ objectFit: 'cover' }}
                    loading='lazy'
                    src='/images/webp/img_3banner_1.webp'
                    alt='Restaurant Image 1'
                    fill
                    className='cursor-pointer transition-all duration-500 ease-in-out hover:scale-105'
                  />
                </Box>
                <Box
                  mb={'xs'}
                  w={'100%'}
                  h={190}
                  className='cursor-pointer overflow-hidden rounded-xl'
                  pos={'relative'}
                >
                  <Image
                    style={{ objectFit: 'cover' }}
                    loading='lazy'
                    src='/images/webp/img_3banner_2.webp'
                    alt='Restaurant Image 1'
                    fill
                    className='cursor-pointer transition-all duration-500 ease-in-out hover:scale-105'
                  />
                </Box>
              </Flex>

              <Box w={{ base: '100%', sm: '100%', md: '60%', lg: '75%' }} className='overflow-hidden'>
                {navbar?.map((item, index) => (
                  <TabsPanel value={item.key} key={index}>
                    <Flex
                      direction={'column'}
                      h={'100%'}
                      w={{ base: '100%', md: '100%' }}
                      className={clsx('relative', imgaePositon && 'order-1')}
                    >
                      <Carousel
                        w={'100%'}
                        slideSize={{ base: '100%', sm: '33.33333%', md: '50%', lg: '25%' }}
                        slideGap={rem(20)}
                        h={320}
                        containScroll='trimSnaps'
                        align='center'
                        withControls={false}
                        slidesToScroll={1}
                      >
                        {products?.length ? (
                          products?.map((item: any, index: number) => (
                            <Carousel.Slide key={index} h={320}>
                              <ProductCardCarouselVertical product={item} />
                            </Carousel.Slide>
                          ))
                        ) : (
                          <Empty
                            hasButton={false}
                            size='md'
                            title='Không có sản phẩm phù hợp'
                            content='Vuiید quay lại sau'
                          />
                        )}
                      </Carousel>
                      <Flex align={'center'} justify={'center'} mt={30}>
                        <Link href={`/thuc-don?loai=${tab}`}>
                          <BButton title={'Xem tất cả'} variant='outline' size='sm' />
                        </Link>
                      </Flex>
                    </Flex>
                  </TabsPanel>
                ))}
              </Box>
            </Flex>
          </GridCol>
        </Grid>
      </Tabs>
    </Card>
  );
};

export default LayoutProductCarouselWithImage2;
