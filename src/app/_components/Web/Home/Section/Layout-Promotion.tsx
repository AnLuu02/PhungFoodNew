'use client';

import { Card, Flex, Grid, GridCol, Group, Text, Title } from '@mantine/core';
import { IconBolt } from '@tabler/icons-react';
import ProductCardCarouselHorizontal from '../_Components/ProductCardCarouselHorizontal';

const LayoutPromotion = ({ data }: any) => {
  const productDiscount = data ?? [];
  return (
    <Card
      h={'max-content'}
      radius={'lg'}
      withBorder
      className='border-2 border-dashed border-[#008b4b]'
      p={0}
      bg={'gray.2'}
    >
      <Flex h={'100%'} direction={'column'}>
        <Flex
          align={'center'}
          justify={'space-between'}
          direction={{ base: 'column', sm: 'row', md: 'row' }}
          className='bg-[#008b4b]'
          h={{ base: 'max-content', md: 75 }}
          p={'lg'}
          gap={'md'}
        >
          <Flex direction={'column'}>
            <Group gap={0}>
              <Title
                order={2}
                className='cursor-pointer font-quicksand text-[#f8c144] transition-all duration-300 hover:text-white'
              >
                Khuyến mãi đặc biệt
              </Title>
              <IconBolt size={33} color={'#f8c144'} className='animate-wiggle' />
            </Group>
            <Text size='lg' p={0} className='text-white' fw={500}>
              Đừng bỏ lỡ cơ hội giảm giá đặc biệt!
            </Text>
          </Flex>

          <Flex align={'center'} gap={'lg'}>
            <Group gap={'xs'}>
              <Flex direction={'column'} align={'center'} bg={'white'} className='rounded-lg' w={45} h={45}>
                <Text size='sm' p={0} className='text-[#008b4b]' fw={700}>
                  172
                </Text>
                <Text size='sm' p={0} className='text-black'>
                  Ngày
                </Text>
              </Flex>
              <Flex direction={'column'} align={'center'} bg={'white'} className='rounded-lg' w={45} h={45}>
                <Text size='sm' p={0} className='text-[#008b4b]' fw={700}>
                  21
                </Text>
                <Text size='sm' p={0} className='text-black'>
                  Giờ
                </Text>
              </Flex>
              <Flex direction={'column'} align={'center'} bg={'white'} className='rounded-lg' w={45} h={45}>
                <Text size='sm' p={0} className='text-[#008b4b]' fw={700}>
                  51
                </Text>
                <Text size='sm' p={0} className='text-black'>
                  Phút
                </Text>
              </Flex>
              <Flex direction={'column'} align={'center'} bg={'white'} className='rounded-lg' w={45} h={45}>
                <Text size='sm' p={0} className='text-[#008b4b]' fw={700}>
                  23
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
            <GridCol span={{ base: 12, xs: 6, xl: 4 }} key={index}>
              <ProductCardCarouselHorizontal data={item} key={item.id} />
            </GridCol>
          ))}
          {/* <GridCol span={{ base: 12, xs: 6, xl: 4 }}>
            <ProductCardCarouselHorizontal />
          </GridCol>
          <GridCol span={{ base: 12, xs: 6, xl: 4 }}>
            <ProductCardCarouselHorizontal />
          </GridCol>
          <GridCol span={{ base: 12, xs: 6, xl: 4 }}>
            <ProductCardCarouselHorizontal />
          </GridCol>
          <GridCol span={{ base: 12, xs: 6, xl: 4 }}>
            <ProductCardCarouselHorizontal />
          </GridCol>
          <GridCol span={{ base: 12, xs: 6, xl: 4 }}>
            <ProductCardCarouselHorizontal />
          </GridCol>
          <GridCol span={{ base: 12, xs: 6, xl: 4 }}>
            <ProductCardCarouselHorizontal />
          </GridCol> */}
        </Grid>
      </Flex>
    </Card>
  );
};

export default LayoutPromotion;
