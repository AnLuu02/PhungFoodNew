import { Container, Space } from '@mantine/core';
import { formatDate } from '~/lib/func-handler/Format';
import BannerSection from './Section/Banner-section';
import CategoryCarouselHorizontal, { IDataCategory } from './Section/Category-Carousel-Horizontal';
import ReusablePromoBanner from './Section/Layout-Banner-Promotion';
import LayoutCarouselSimple from './Section/Layout-Carousel-Simple';
import FastMenuSection from './Section/Layout-Menu-Quick-Sale-Order';
import LayoutProductCarouselOnly from './Section/Layout-Product-Carousel-Only';
import LayoutProductCarouselWithImage from './Section/Layout-Product-Carousel-With-Image';
import LayoutProductCarouselWithImage2 from './Section/Layout-Product-Carousel-With-Image-2';
import LayoutPromotion from './Section/Layout-Promotion';
import LayoutGrid3Col from './Section/LayoutGrid3Col';

const HomeWeb = ({
  data
}: {
  data: {
    banner: any;
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
      {data.banner?.id && <BannerSection banner={data.banner} />}
      <Space h='xl' />
      <ReusablePromoBanner
        title='🎉 Ưu đãi đặc biệt 🎉'
        subtitle={
          <>
            🔊 Từ ngày <b className='text-4xl italic text-yellow-500'>{formatDate(new Date())}</b> đến hết ngày{' '}
            <b className='text-4xl italic text-yellow-500'>
              {formatDate(new Date().setDate(new Date().getDate() + 1))}
            </b>{' '}
            giảm giá <b className='text-4xl italic text-yellow-500'> 15%</b> tất cả món ăn có trong cửa hàng.
          </>
        }
        buttonText='Đặt ngay'
        buttonLink='/thuc-don'
        layout='center'
        backgroundImage='/images/jpg/banner_food1.jpg'
        height={400}
        overlayColor='rgba(0,0,0,0.4)'
      />
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
            <LayoutProductCarouselWithImage
              imageUrl='/images/jpg/best-saller.jpg'
              data={data.productBestSaler?.products}
              loai='san-pham-ban-chay'
            />
            <Space h='xl' />
          </>
        )}

        <>
          <LayoutGrid3Col />
          <Space h='xl' />
        </>

        {data.productDiscount?.products?.length > 0 && (
          <>
            <LayoutPromotion data={data.productDiscount?.products} />
            <Space h='xl' />
          </>
        )}

        {data.productHot?.products?.length > 0 && (
          <>
            <LayoutProductCarouselWithImage
              imageUrl='/images/jpg/hot.jpg'
              data={data.productHot?.products}
              reverseGrid={true}
              title='Sản phẩm nổi bật trong cửa hàng'
              content='Ưu đãi độc quyền - Giảm giá cho hóa đơn trên 100.000 VNĐ'
              loai='san-pham-hot'
            />
            <Space h='xl' />
          </>
        )}

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
                { label: 'Rau củ', key: 'rau-cu', url: 'rau-cu' },
                { label: 'Các loại nấm', key: 'cac-loai-nam', url: 'cac-loai-nam' }
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
                { label: 'Thịt tươi', key: 'thit-tuoi', url: 'thit-tuoi' },
                { label: 'Hải sản', key: 'hai-san', url: 'hai-san' }
              ]}
            />
            <Space h='xl' />
          </>
        )}

        <>
          <LayoutCarouselSimple />
          <Space h='xl' className='hidden sm:block' />
        </>

        {(data.category.anVat || data.category.thucUong || data.category.monChinh) && (
          <>
            <FastMenuSection
              data={{
                anVat: data.category.anVat,
                thucUong: data.category.thucUong,
                monChinh: data.category.monChinh
              }}
            />
          </>
        )}
      </Container>
    </>
  );
};

export default HomeWeb;
