import { Card, CardSection, Container, Flex, Image, Space, Stack, Text } from '@mantine/core';
import BButton from '../../Button';
import CategoryCarouselHorizontal, { IDataCategory } from './Section/Category-Carousel-Horizontal';
import LayoutAds from './Section/Layout-Ads';
import LayoutBannerOverview from './Section/Layout-Banner-Overview';
import LayoutCarouselSimple from './Section/Layout-Carousel-Simple';
import FastMenuSection from './Section/Layout-Menu-Quick-Sale-Order';
import LayoutProductCarouselOnly from './Section/Layout-Product-Carousel-Only';
import LayoutProductCarouselWithImage from './Section/Layout-Product-Carousel-With-Image';
import LayoutProductCarouselWithImage2 from './Section/Layout-Product-Carousel-With-Image-2';
import LayoutPromotion from './Section/Layout-Promotion';

const HomeWeb = ({
  data
}: {
  data: {
    category: IDataCategory;
    materials: any;
    productDiscount: any;
    productBestSaler: any;
    productNew: any;
    productHot: any;
  };
}) => {
  return (
    <>
      <LayoutBannerOverview />
      <Space h='xl' />
      <Container pl={0} pr={0} size='xl'>
        {data.category?.anVat && (
          <>
            <CategoryCarouselHorizontal data={data.category} />
            <Space h='xl' />
          </>
        )}

        {data.productBestSaler?.products?.length > 0 && (
          <>
            <LayoutProductCarouselWithImage data={data.productBestSaler?.products} loai='san-pham-ban-chay' />
            <Space h='xl' />
          </>
        )}
        <LayoutAds />
        <Space h='xl' />

        {data.productDiscount?.products?.length > 0 && (
          <>
            <LayoutPromotion data={data.productDiscount?.products} />
            <Space h='xl' />
          </>
        )}

        {data.productHot?.products?.length > 0 && (
          <>
            <LayoutProductCarouselWithImage
              data={data.productHot?.products}
              reverseGrid={true}
              title='Sản phẩm nổi bật trong cửa hàng'
              content='Ưu đãi độc quyền - Giảm giá cho hóa đơn trên 100.000 VNĐ'
              loai='san-pham-hot'
            />
            <Space h='xl' />
          </>
        )}

        {/* {data.productHot?.products?.length > 0 && <LayoutHotProduct data={data.productHot?.products} />} */}

        {data.productHot?.products?.length > 0 && (
          <>
            <LayoutProductCarouselOnly title='Sản phẩm nổi bật' data={data.productHot?.products} />
            <Space h='xl' />
          </>
        )}
        {data.productNew?.products?.length > 0 && (
          <>
            <LayoutProductCarouselOnly title='Sản phẩm mới' data={data.productNew?.products} />
            <Space h='xl' />
          </>
        )}

        {data.materials?.rauCu?.products?.length > 0 && (
          <>
            <LayoutProductCarouselWithImage2
              data={{ 'rau-cu': data.materials.rauCu, 'cac-loai-nam': data.materials.cacLoaiNam }}
              title='Chay thanh đạm'
              navbar={[
                {
                  label: 'Rau củ',
                  key: 'rau-cu',
                  url: 'rau-cu'
                },
                {
                  label: 'Các loại nấm',
                  key: 'cac-loai-nam',
                  url: 'cac-loai-nam'
                }
              ]}
            />
            <Space h='xl' />
          </>
        )}

        {data.materials?.thitTuoi?.products?.length > 0 && (
          <>
            <LayoutProductCarouselWithImage2
              data={{ 'hai-san': data.materials.haiSan, 'thit-tuoi': data.materials.thitTuoi }}
              title='Mặn tươi ngon'
              imgaePositon={'right'}
              navbar={[
                {
                  label: 'Thịt tươi',
                  key: 'thit-tuoi',
                  url: 'thit-tuoi'
                },
                {
                  label: 'Hải sản',
                  key: 'hai-san',
                  url: 'hai-san'
                }
              ]}
            />
            <Space h='xl' />
          </>
        )}
        <LayoutCarouselSimple />
        <Space h='xl' />
        <Card radius={'lg'} bg={'gray.1'} p={0} className='hidden md:block'>
          <CardSection pos={'relative'}>
            <Image
              loading='lazy'
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
        <Space h='xl' className='hidden md:block' />

        {data.category.anVat && data.category.thucUong && (
          <FastMenuSection data={{ anVat: data.category.anVat, thucUong: data.category.thucUong }} />
        )}
      </Container>
    </>
  );
};

export default HomeWeb;
