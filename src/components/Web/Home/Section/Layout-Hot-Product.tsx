'use client';
import { Box, Button, Card, Flex, Tabs, TabsList, TabsPanel, TabsTab, Text, Title } from '@mantine/core';
import BButton from '~/components/Button';
import TabsPanelCarousel from './TabsPenel';
import classes from './TabsStyles.module.css';

const LayoutHotProduct = ({ data }: any) => {
  return (
    <Card h={{ base: 'max-content', md: 900 }} radius={'lg'} className='bg-gray-100' p={0}>
      <Flex h={'100%'} direction={{ base: 'column', md: 'row' }}>
        <Tabs
          defaultValue='an-vat-trang-mieng'
          variant='pills'
          classNames={classes}
          className='relative'
          h={'100%'}
          p={'lg'}
          w={{ base: '100%', md: '75%' }}
        >
          <Flex align={'center'} justify={'flex-end'} mb={20} direction={{ base: 'column-reverse', md: 'row' }}>
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
            <TabsPanelCarousel data={data} />
          </TabsPanel>
          <Flex align={'center'} justify={'center'} mt={30}>
            <BButton title={'Xem tất cả'} variant='outline' size='sm' />
          </Flex>
        </Tabs>

        <Box
          className='relative w-full bg-[url(/images/webp/noi_bat_bg_2.webp)] bg-cover bg-no-repeat'
          h={'100%'}
          w={{ base: '100%', md: '25%' }}
        >
          <Box pos='absolute' left={0} top={0} h='100%' w='100%' bg='black' opacity={0.3} />
          <Box p={'lg'} pos='absolute' left={0} top={0} className='z-10' h='100%' w='100%'>
            <Title order={2} className='font-quicksand text-white' mb={'xs'}>
              Sản phẩm nổi bật trong cửa hàng
            </Title>
            <Text td='underline' fs='italic' size='md' className='text-white' fw={700} mb={'xs'}>
              Ưu đãi độc quyền - Giảm giá 20%
            </Text>
            <Title order={3} className='font-quicksand text-white' mb={'xs'}>
              Mua sắm thoải mái chỉ từ 20.000 VNĐ
            </Title>

            <Text size='md' className='text-white' fw={700} mb={'xs'}>
              Chỉ trong tuần này. Đừng bỏ lỡ...
            </Text>
            <Button
              radius={'xl'}
              mb={'xs'}
              className='bg-white text-black transition-all duration-200 ease-in-out hover:bg-subColor'
            >
              Mua ngay
            </Button>
          </Box>
        </Box>
      </Flex>
    </Card>
  );
};

export default LayoutHotProduct;
