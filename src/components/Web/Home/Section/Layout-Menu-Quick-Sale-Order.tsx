import { Button, Divider, Flex, Grid, GridCol, Title } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import ProductCardCarouselHorizontal from '../components/ProductCardCarouselHorizontal';

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
                <Title order={1} className='cursor-pointer font-quicksand font-bold hover:text-[#008b4b]'>
                  Ăn vặt
                </Title>
                <Link href='/thuc-don?danh-muc=an-vat-trang-mieng'>
                  <Button
                    rightSection={<IconArrowRight size={20} />}
                    radius={'xl'}
                    size='md'
                    variant='transparent'
                    className='text-[#008b4b] transition-all duration-200 ease-in-out hover:text-[#f8c144]'
                  >
                    Xem thêm
                  </Button>
                </Link>
              </Flex>
              <Divider />
              <Divider
                w={'20%'}
                size={'xl'}
                color={'green.9'}
                pos={'absolute'}
                bottom={7}
                left={10}
                className='rounded-full'
              />
            </GridCol>
            {anVatFilter.map((item: any, index: number) => {
              return (
                <GridCol span={12} key={index}>
                  <ProductCardCarouselHorizontal data={item} />
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
                <Title order={1} className='cursor-pointer font-quicksand font-bold hover:text-[#008b4b]'>
                  Thức uống
                </Title>
                <Link href='/thuc-don?danh-muc=thuc-uong'>
                  <Button
                    rightSection={<IconArrowRight size={20} />}
                    radius={'xl'}
                    size='md'
                    variant='transparent'
                    className='text-[#008b4b] transition-all duration-200 ease-in-out hover:text-[#f8c144]'
                  >
                    Xem thêm
                  </Button>
                </Link>
              </Flex>
              <Divider />
              <Divider
                w={'20%'}
                size={'xl'}
                color={'green.9'}
                pos={'absolute'}
                bottom={7}
                left={10}
                className='rounded-full'
              />
            </GridCol>
            {thucUongFilter.map((item: any, index: number) => {
              return (
                <GridCol span={12} key={index}>
                  <ProductCardCarouselHorizontal data={item} />
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
                <Title order={1} className='cursor-pointer font-quicksand font-bold hover:text-[#008b4b]'>
                  Tráng miệng
                </Title>
                <Link href='/thuc-don?danh-muc=an-vat-trang-mieng'>
                  <Button
                    rightSection={<IconArrowRight size={20} />}
                    radius={'xl'}
                    size='md'
                    variant='transparent'
                    className='text-[#008b4b] transition-all duration-200 ease-in-out hover:text-[#f8c144]'
                  >
                    Xem thêm
                  </Button>
                </Link>
              </Flex>
              <Divider />
              <Divider
                w={'20%'}
                size={'xl'}
                color={'green.9'}
                pos={'absolute'}
                bottom={7}
                left={10}
                className='rounded-full'
              />
            </GridCol>
            {monChinhFilter.map((item: any, index: number) => {
              return (
                <GridCol span={12} key={index}>
                  <ProductCardCarouselHorizontal key={index} data={item} />
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
