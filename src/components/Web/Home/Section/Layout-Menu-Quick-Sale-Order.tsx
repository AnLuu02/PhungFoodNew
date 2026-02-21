import { Box, Button, Divider, Flex, Grid, GridCol, Title } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import Reveal from '~/components/Reveal';
import ProductCardCarouselHorizontal from '../../Card/CardProductCarouselHorizontal';

const FastMenuSection = ({ data }: { data: { anVat: any; thucUong: any; monChinh: any } }) => {
  const getRandomItems = (arr: any[], count: number) => arr.sort(() => 0.5 - Math.random()).slice(0, count);
  const anVatFilter = getRandomItems(data.anVat?.flatMap((i: any) => i.product) || [], 3);
  const thucUongFilter = getRandomItems(data.thucUong?.flatMap((i: any) => i.product) || [], 3);
  const monChinhFilter = getRandomItems(data.monChinh?.flatMap((i: any) => i.product) || [], 3);
  return (
    <Grid
      mt={{
        base: 'xl',
        xs: 0
      }}
      mih={500}
    >
      {anVatFilter?.length > 0 && (
        <GridCol span={{ base: 12, xs: 6, xl: 4 }}>
          <Grid>
            <GridCol span={12} pos={'relative'}>
              <Flex align={'center'} justify={'space-between'}>
                <Title
                  pos={'relative'}
                  order={1}
                  className='cursor-pointer font-quicksand font-bold hover:text-mainColor'
                >
                  Ăn vặt
                  <Box
                    w={'100%'}
                    h={4}
                    pos={'absolute'}
                    bottom={-5}
                    left={0}
                    className='rounded-full bg-mainColor'
                  ></Box>
                </Title>
                <Link href='/thuc-don?danh-muc=an-vat-trang-mieng'>
                  <Button
                    rightSection={<IconArrowRight size={20} />}
                    size='md'
                    variant='transparent'
                    className='text-mainColor duration-200 hover:text-subColor'
                  >
                    Xem thêm
                  </Button>
                </Link>
              </Flex>
              <Divider />
            </GridCol>
            {anVatFilter.map((item: any, index: number) => {
              return (
                <GridCol span={12} key={index}>
                  <Reveal y={(index + 1) * 2} delay={index * 0.01}>
                    <ProductCardCarouselHorizontal key={index} data={item} />
                  </Reveal>
                </GridCol>
              );
            })}
          </Grid>
        </GridCol>
      )}
      {thucUongFilter?.length > 0 && (
        <GridCol span={{ base: 12, xs: 6, xl: 4 }} mt={{ base: 'md', xs: 0, md: 0, lg: 0, xl: 0 }}>
          <Grid>
            <GridCol span={12} pos={'relative'}>
              <Flex align={'center'} justify={'space-between'}>
                <Title
                  order={1}
                  className='cursor-pointer font-quicksand font-bold hover:text-mainColor'
                  pos={'relative'}
                >
                  Thức uống
                  <Box
                    w={'100%'}
                    h={4}
                    pos={'absolute'}
                    bottom={-4}
                    left={0}
                    className='rounded-full bg-mainColor'
                  ></Box>
                </Title>
                <Link href='/thuc-don?danh-muc=thuc-uong'>
                  <Button
                    rightSection={<IconArrowRight size={20} />}
                    size='md'
                    variant='transparent'
                    className='text-mainColor duration-200 hover:text-subColor'
                  >
                    Xem thêm
                  </Button>
                </Link>
              </Flex>
              <Divider />
            </GridCol>
            {thucUongFilter.map((item: any, index: number) => {
              return (
                <GridCol span={12} key={index}>
                  <Reveal y={(index + 1) * 2} delay={index * 0.01}>
                    <ProductCardCarouselHorizontal data={item} />
                  </Reveal>
                </GridCol>
              );
            })}
          </Grid>
        </GridCol>
      )}

      {monChinhFilter?.length > 0 && (
        <GridCol span={{ base: 12, xs: 6, xl: 4 }} className='hidden lg:block'>
          <Grid>
            <GridCol span={12} pos={'relative'}>
              <Flex align={'center'} justify={'space-between'}>
                <Title
                  order={1}
                  className='cursor-pointer font-quicksand font-bold hover:text-mainColor'
                  pos={'relative'}
                >
                  Tráng miệng
                  <Box
                    w={'100%'}
                    h={4}
                    pos={'absolute'}
                    bottom={-5}
                    left={0}
                    className='rounded-full bg-mainColor'
                  ></Box>
                </Title>
                <Link href='/thuc-don?danh-muc=an-vat-trang-mieng'>
                  <Button
                    rightSection={<IconArrowRight size={20} />}
                    size='md'
                    variant='transparent'
                    className='text-mainColor duration-200 hover:text-subColor'
                  >
                    Xem thêm
                  </Button>
                </Link>
              </Flex>
              <Divider />
            </GridCol>
            {monChinhFilter.map((item: any, index: number) => {
              return (
                <GridCol span={12} key={index}>
                  <Reveal y={(index + 1) * 2} delay={index * 0.01}>
                    <ProductCardCarouselHorizontal key={index} data={item} />
                  </Reveal>
                </GridCol>
              );
            })}
          </Grid>
        </GridCol>
      )}
    </Grid>
  );
};

export default FastMenuSection;
