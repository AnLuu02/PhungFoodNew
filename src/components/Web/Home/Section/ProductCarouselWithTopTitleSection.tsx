'use client';
import { Box, Card, Flex, Grid, GridCol, Paper, Tabs, TabsList, TabsPanel, TabsTab, Text, Title } from '@mantine/core';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { api } from '~/trpc/react';
import TabsPanelCarousel from '../components/CarouselSection';

type Props = {
  title?: string;
  data?: any;
  loai?: string;
  image_1?: string;
  image_2?: string;
  imgaePositon?: 'left' | 'right';
  categories: { name: string; tag: string }[];
};

export const ProductCarouselWithTopTitleSection = ({ title, imgaePositon = 'left', categories }: Props) => {
  const [active, setActive] = useState<string>(categories?.[0]?.tag ?? '');

  const { data, isLoading, isFetching } = api.Product.find.useQuery(
    { page: 1, limit: 6, 'nguyen-lieu': [active] },
    { enabled: !!active, placeholderData: previousData => previousData }
  );

  const products = data?.products ?? [];

  const utils = api.useUtils();

  const handlePrefetch = useCallback((material: string) => {
    if (active === material) return;
    void utils.Product.find.prefetch({ page: 1, limit: 6, 'nguyen-lieu': [material] });
  }, []);

  return (
    <Card mih={500} h={{ base: 'max-content', md: 500 }} className='bg-gray-100 dark:bg-dark-background' p={0}>
      <Tabs
        defaultValue='rau-cu'
        value={active}
        onChange={value => setActive(value ?? 'rau-cu')}
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
              <Title
                order={1}
                className='cursor-pointer font-quicksand font-bold text-black hover:text-mainColor dark:text-dark-text'
              >
                {title || 'Thịt nhập khẩu'}
              </Title>

              <Flex align={'center'} justify={'flex-end'} direction={{ base: 'column-reverse', sm: 'row', md: 'row' }}>
                <TabsList justify='center'>
                  <Flex align={'center'}>
                    {categories.map((c, index) => (
                      <TabsTab
                        value={c.tag}
                        size={'xl'}
                        key={index}
                        onMouseEnter={() => handlePrefetch(c.tag)}
                        onPointerDown={() => handlePrefetch(c.tag)}
                      >
                        <Text size='md' fw={700}>
                          {c.name}
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
                className={`${imgaePositon && 'order-2'} hidden overflow-hidden md:block`}
              >
                <Paper mb={'xs'} w={'100%'} h={190} className='cursor-pointer overflow-hidden' pos={'relative'}>
                  <Image
                    style={{ objectFit: 'cover' }}
                    loading='lazy'
                    src='/images/jpg/mon-chay-1.jpg'
                    alt='Restaurant Image 1'
                    fill
                    className='cursor-pointer transition-all duration-500 ease-in-out hover:scale-105'
                  />
                </Paper>
                <Paper mb={'xs'} w={'100%'} h={190} className='cursor-pointer overflow-hidden' pos={'relative'}>
                  <Image
                    style={{ objectFit: 'cover' }}
                    loading='lazy'
                    src='/images/jpg/mon-chay-2.jpg'
                    alt='Restaurant Image 1'
                    fill
                    className='cursor-pointer transition-all duration-500 ease-in-out hover:scale-105'
                  />
                </Paper>
              </Flex>

              <Box w={{ base: '100%', sm: '100%', md: '60%', lg: '75%' }} className='overflow-hidden'>
                <TabsPanel value={active} mih={320}>
                  <TabsPanelCarousel data={products} loading={isLoading} fetching={isFetching} posNav='none' />
                </TabsPanel>
              </Box>
            </Flex>
          </GridCol>
        </Grid>
      </Tabs>
    </Card>
  );
};
