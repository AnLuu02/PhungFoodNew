'use client';
import {
  BackgroundImage,
  Box,
  Card,
  Flex,
  Overlay,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  Title
} from '@mantine/core';
import Link from 'next/link';
import BButton from '~/app/_components/Button';
import TabsPanelCarousel from './TabsPenel';
import classes from './TabsStyles.module.css';
const LayoutProductCarouselWithImage = ({
  title,
  content,
  loai,
  imageUrl,
  data,
  reverseGrid
}: {
  title?: string;
  content?: string;
  imageUrl?: string;
  loai: string;
  data: any;
  reverseGrid?: boolean;
}) => {
  const productAnVat = data?.filter((i: any) => i.subCategory.category.tag === 'an-vat-trang-mieng') || [];
  const productMonChinh = data?.filter((i: any) => i.subCategory.category.tag === 'mon-chinh') || [];
  const productMonChay = data?.filter((i: any) => i.subCategory.category.tag === 'mon-chay') || [];

  return (
    <Card h={{ base: 'max-content', md: 500 }} radius={'lg'} bg={'gray.1'} p={0}>
      <Flex h={'100%'} direction={{ base: 'column', md: reverseGrid ? 'row-reverse' : 'row' }}>
        <BackgroundImage
          src={imageUrl || '/images/jpg/best-saller.jpg'}
          className='relative bg-cover bg-no-repeat'
          h={'100%'}
          w={{ base: '100%', md: '25%' }}
          pos={'relative'}
        >
          <Overlay color='#000' opacity={0.5} zIndex={1} radius='md' />
          <Stack pos={'absolute'} className='inset-0 z-10' p={'lg'}>
            <Box pos='absolute' className='z-[-1]' left={0} top={0} h='100%' w='100%' bg='black' opacity={0.2} />
            <Title order={2} className='font-quicksand' c={'white'}>
              {title || 'Bán chạy nhất hàng ngày'}
            </Title>
            <Text td='underline' fs='italic' size='md' c={'white'} fw={700}>
              {content || 'Ưu đãi độc quyền - Giảm giá 20%'}
            </Text>
            <Title order={3} c={'white'} className='font-quicksand'>
              Mua sắm thoải mái chỉ từ 10.000 VNĐ
            </Title>

            <Text size='md' c={'white'} fw={700}>
              Chỉ trong tuần này. Đừng bỏ lỡ...
            </Text>
            <BButton title={'Mua ngay'} radius='xl' size='sm' w={'max-content'} />
          </Stack>
        </BackgroundImage>
        <Tabs
          defaultValue='an-vat-trang-mieng'
          variant='pills'
          classNames={classes}
          className='relative'
          h={'100%'}
          p={'lg'}
          w={{ base: '100%', md: '75%' }}
        >
          <Flex
            align={'center'}
            justify={'flex-end'}
            mb={{ base: 0, md: 20 }}
            direction={{ base: 'column-reverse', sm: 'row', md: 'row' }}
          >
            <Box></Box>
            <TabsList justify='center'>
              <Flex align={'center'}>
                <TabsTab value='an-vat-trang-mieng' size={'xl'}>
                  <Text size='md' fw={700}>
                    Ăn vặt
                  </Text>
                </TabsTab>
                <Text size='xs' p={0} m={0} c={'dimmed'}>
                  //
                </Text>
                <TabsTab value='mon-chinh' size={'xl'}>
                  <Text size='md' fw={700}>
                    Món chính
                  </Text>
                </TabsTab>
                <Text size='xs' p={0} m={0} c={'dimmed'}>
                  //
                </Text>
                <TabsTab value='mon-chay' size={'xl'}>
                  <Text size='md' fw={700}>
                    Món chay
                  </Text>
                </TabsTab>
              </Flex>
            </TabsList>
          </Flex>
          <TabsPanel value={'an-vat-trang-mieng'}>
            <TabsPanelCarousel data={productAnVat} />
          </TabsPanel>
          <TabsPanel value={'mon-chinh'}>
            <TabsPanelCarousel data={productMonChinh} />
          </TabsPanel>
          <TabsPanel value={'mon-chay'}>
            <TabsPanelCarousel data={productMonChay} />
          </TabsPanel>
          <Flex align={'center'} justify={'center'} mt={30}>
            <Link href={`/thuc-don?loai=${loai}`}>
              <BButton title={'Xem tất cả'} variant='outline' size='sm' />
            </Link>
          </Flex>
        </Tabs>
      </Flex>
    </Card>
  );
};

export default LayoutProductCarouselWithImage;
