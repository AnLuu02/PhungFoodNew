'use client';

import { Card, Flex, Grid, GridCol, Group, Text, Title } from '@mantine/core';
import { IconBolt } from '@tabler/icons-react';
import React, { useEffect } from 'react';
import ProductCardCarouselHorizontal from '../../Card/ProductCardCarouselHorizontal';

const LayoutPromotion = ({ data }: any) => {
  const productDiscount = data ?? [];
  const [timeExpire, setTimeExpire] = React.useState({
    day: 0,
    hour: 0,
    minute: 0,
    second: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const day = 30 - new Date().getDate();
      const hour = 23 - new Date().getHours();
      const minute = 59 - new Date().getMinutes();
      const second = 59 - new Date().getSeconds();
      if (day < 0 && hour < 0 && minute < 0 && second < 0) {
        clearInterval(interval);
        return;
      }
      setTimeExpire({ day, hour, minute, second });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card
      mih={270}
      h={'max-content'}
      radius={'lg'}
      withBorder
      className='border-2 border-dashed border-mainColor bg-gray-200 dark:bg-dark-background'
      p={0}
    >
      <Flex h={'100%'} direction={'column'}>
        <Flex
          align={'center'}
          justify={'space-between'}
          direction={{ base: 'column', sm: 'row', md: 'row' }}
          className='bg-mainColor'
          h={{ base: 'max-content', md: 75 }}
          p={'lg'}
          gap={'md'}
        >
          <Flex direction={'column'}>
            <Group gap={0}>
              <Title
                order={2}
                className='cursor-pointer font-quicksand text-subColor transition-all duration-300 hover:text-white'
              >
                Khuyến mãi đặc biệt
              </Title>
              <IconBolt size={33} className='animate-wiggle text-subColor' />
            </Group>
            <Text size='lg' p={0} className='text-white' fw={500}>
              Đừng bỏ lỡ cơ hội giảm giá đặc biệt!
            </Text>
          </Flex>

          <Flex align={'center'} gap={'lg'}>
            <Group gap={'xs'}>
              <Flex direction={'column'} align={'center'} bg={'white'} className='rounded-md' w={45} h={45}>
                <Text size='sm' p={0} className='text-mainColor' fw={700}>
                  {timeExpire.day < 10 ? `0${timeExpire.day}` : timeExpire.day}
                </Text>
                <Text size='sm' p={0} className='text-black'>
                  Ngày
                </Text>
              </Flex>
              <Flex direction={'column'} align={'center'} bg={'white'} className='rounded-md' w={45} h={45}>
                <Text size='sm' p={0} className='text-mainColor' fw={700}>
                  {timeExpire.hour < 10 ? `0${timeExpire.hour}` : timeExpire.hour}
                </Text>
                <Text size='sm' p={0} className='text-black'>
                  Giờ
                </Text>
              </Flex>
              <Flex direction={'column'} align={'center'} bg={'white'} className='rounded-md' w={45} h={45}>
                <Text size='sm' p={0} className='text-mainColor' fw={700}>
                  {timeExpire.minute < 10 ? `0${timeExpire.minute}` : timeExpire.minute}
                </Text>
                <Text size='sm' p={0} className='text-black'>
                  Phút
                </Text>
              </Flex>
              <Flex direction={'column'} align={'center'} bg={'white'} className='rounded-md' w={45} h={45}>
                <Text size='sm' p={0} className='text-mainColor' fw={700}>
                  {timeExpire.second < 10 ? `0${timeExpire.second}` : timeExpire.second}
                </Text>
                <Text size='sm' p={0} className='text-black'>
                  Giây
                </Text>
              </Flex>
            </Group>
          </Flex>
        </Flex>

        <Grid p={'sm'}>
          {productDiscount.map((item: any, index: number) => (
            <GridCol span={{ base: 12, xs: 6, xl: 4 }} key={index} mih={162}>
              <ProductCardCarouselHorizontal data={item} key={item.id} />
            </GridCol>
          ))}
        </Grid>
      </Flex>
    </Card>
  );
};

export default LayoutPromotion;
