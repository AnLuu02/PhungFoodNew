import { Card, CardSection, Container, Image, Space } from '@mantine/core';
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
  data: { category: IDataCategory; productDiscount: any; productBestSaler: any; productNew: any; productHot: any };
}) => {
  return (
    <>
      <LayoutBannerOverview />
      <Space h='xl' />
      <Container pl={0} pr={0} size='xl'>
        {data.category && (
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

        <LayoutProductCarouselWithImage2
          title='Chay thanh đạm'
          navbar={[
            {
              label: 'Đậu hủ',
              key: 'dau-hu',
              url: 'dau-hu'
            },
            {
              label: 'Rau củ',
              key: 'rau-cu',
              url: 'rau-cu'
            },
            {
              label: 'Món nước',
              key: 'mon-chay-nuoc',
              url: 'mon-chay-nuoc'
            },
            {
              label: 'Món chay khô',
              key: 'mon-chay-kho',
              url: 'mon-chay-kho'
            }
          ]}
        />
        <Space h='xl' />
        <LayoutProductCarouselWithImage2
          title='Mặn tươi ngon'
          imgaePositon={'right'}
          navbar={[
            {
              label: 'Thịt',
              key: 'thit',
              url: 'thit'
            },
            {
              label: 'Hải sản',
              key: 'hai-san',
              url: 'hai-san'
            },
            {
              label: 'Món nước',
              key: 'mon-nuoc',
              url: 'mon-nuoc'
            },
            {
              label: 'Món khô',
              key: 'mon-kho',
              url: 'mon-kho'
            }
          ]}
        />
        <Space h='xl' />
        <LayoutCarouselSimple />
        <Space h='xl' />
        <Card radius={'lg'} bg={'gray.1'} p={0} mb={50}>
          <CardSection>
            <Image
              loading='lazy'
              className='cursor-pointer rounded-2xl transition-all duration-500 ease-in-out hover:scale-105'
              w={'100%'}
              h={350}
              src='/images/webp/img_banner_index.webp'
            />
          </CardSection>
        </Card>
        <Space h='xl' />

        {data.category.anVat && data.category.thucUong && (
          <FastMenuSection data={{ anVat: data.category.anVat, thucUong: data.category.thucUong }} />
        )}
      </Container>
    </>
  );
};

export default HomeWeb;
