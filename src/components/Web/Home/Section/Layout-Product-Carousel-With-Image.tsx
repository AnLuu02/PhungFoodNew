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
import { useMemo, useState } from 'react';
import BButton from '~/components/Button/Button';
import TabsPanelCarousel from './TabsPanel';
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
  const [active, setActive] = useState<'an-vat-trang-mieng' | 'mon-chinh' | 'mon-chay'>('an-vat-trang-mieng');
  const dataProps = useMemo(() => {
    switch (active) {
      case 'an-vat-trang-mieng':
        return data?.filter((i: any) => i.subCategory.category.tag === 'an-vat-trang-mieng') || [];
      case 'mon-chinh':
        return data?.filter((i: any) => i.subCategory.category.tag === 'mon-chinh') || [];
      case 'mon-chay':
        return data?.filter((i: any) => i.subCategory.category.tag === 'mon-chay') || [];
      default:
        return data?.filter((i: any) => i.subCategory.category.tag === 'an-vat-trang-mieng') || [];
    }
  }, [active]);
  return (
    <Card
      mih={500}
      h={{ base: 'max-content', md: 500 }}
      radius={'lg'}
      className='bg-gray-100 dark:bg-dark-background'
      p={0}
    >
      <Flex h={'100%'} direction={{ base: 'column', md: reverseGrid ? 'row-reverse' : 'row' }}>
        <BackgroundImage
          src={imageUrl || '/images/jpg/best-saller.jpg'}
          className='relative hidden bg-cover bg-no-repeat md:block'
          h={'100%'}
          w={{ base: '100%', md: '25%' }}
          pos={'relative'}
        >
          <Overlay color='#000' opacity={0.5} zIndex={1} radius='md' />
          <Stack pos={'absolute'} className='inset-0 z-10' p={'lg'}>
            <Box pos='absolute' className='z-[-1]' left={0} top={0} h='100%' w='100%' bg='black' opacity={0.2} />
            <Title order={2} className='font-quicksand text-white'>
              {title || 'Bán chạy nhất hàng ngày'}
            </Title>
            <Text td='underline' fs='italic' size='md' className='text-white' fw={700}>
              {content || 'Ưu đãi độc quyền - Giảm giá 20%'}
            </Text>
            <Title order={3} className='font-quicksand text-white'>
              Mua sắm thoải mái chỉ từ 10.000 VNĐ
            </Title>

            <Text size='md' className='text-white' fw={700}>
              Chỉ trong tuần này. Đừng bỏ lỡ...
            </Text>
            <BButton children={'Mua ngay'} radius='xl' size='sm' w={'max-content'} />
          </Stack>
        </BackgroundImage>
        <Tabs
          defaultValue='an-vat-trang-mieng'
          value={active}
          onChange={(value: any) => setActive(value)}
          variant='pills'
          classNames={{
            tab: `hover:bg-transparent hover:text-subColor data-[active=true]:bg-transparent data-[active=true]:text-subColor`
          }}
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
          <TabsPanel value={active} mih={320}>
            <TabsPanelCarousel data={dataProps} />
          </TabsPanel>

          <Flex align={'center'} justify={'center'} mt={30}>
            <Link href={`/thuc-don?loai=${loai}`}>
              <BButton children={'Xem tất cả'} variant='outline' size='sm' />
            </Link>
          </Flex>
        </Tabs>
      </Flex>
    </Card>
  );
};

export default LayoutProductCarouselWithImage;
