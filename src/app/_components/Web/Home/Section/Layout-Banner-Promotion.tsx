'use client';
import { Card, CardSection, Flex, Image, Stack, Text } from '@mantine/core';
import BButton from '~/app/_components/Button';

const LayoutBannerPromotion = () => {
  return (
    <Card radius={'lg'} bg={'gray.1'} p={0} className='hidden md:block'>
      <CardSection pos={'relative'}>
        <Image
          className='cursor-pointer rounded-2xl transition-all duration-500 ease-in-out hover:scale-105'
          w={'100%'}
          h={500}
          src='/images/png/banner_food.png'
        />
        <Flex
          justify={'center'}
          align={'center'}
          pos={'absolute'}
          left={0}
          top={0}
          bottom={0}
          right={0}
          className='bg-[rgba(0,0,0,0.5)]'
        >
          <Stack w={{ sm: '80%', md: '80%', lg: '50%' }} gap={'xl'} align='center' justify='center'>
            <Text c={'white'} fw={700} className='text-6xl sm:text-5xl'>
              Ưu đãi đặc biệt
            </Text>
            <Text c={'white'} className='text-center text-4xl sm:text-3xl' fw={700}>
              Giảm <i className='animate-wiggle text-[#008b4b]'>"50%"</i> đối với những khách hàng Bạch kim trở lên
            </Text>
            <BButton w={'max-content'} size='xl' title={'Khám phá ngay'} />
          </Stack>
        </Flex>
      </CardSection>
    </Card>
  );
};

export default LayoutBannerPromotion;
