'use client';

import { Container, Space } from '@mantine/core';
import dynamic from 'next/dynamic';
import BannerSection from './Section/Banner-section';
import { IDataCategory } from './Section/Category-Carousel-Horizontal';

// ✅ Dynamic imports (tách khỏi bundle ban đầu)
const CategoryCarouselHorizontal = dynamic(() => import('./Section/Category-Carousel-Horizontal'), { ssr: false });
const LayoutBannerPromotion = dynamic(() => import('./Section/Layout-Banner-Promotion'), { ssr: false });
const LayoutCarouselSimple = dynamic(() => import('./Section/Layout-Carousel-Simple'), { ssr: false });
const FastMenuSection = dynamic(() => import('./Section/Layout-Menu-Quick-Sale-Order'), { ssr: false });
const LayoutProductCarouselOnly = dynamic(() => import('./Section/Layout-Product-Carousel-Only'), { ssr: false });
const LayoutProductCarouselWithImage = dynamic(() => import('./Section/Layout-Product-Carousel-With-Image'), {
  ssr: false
});
const LayoutProductCarouselWithImage2 = dynamic(() => import('./Section/Layout-Product-Carousel-With-Image-2'), {
  ssr: false
});
const LayoutPromotion = dynamic(() => import('./Section/Layout-Promotion'), { ssr: false });
const LayoutGrid3Col = dynamic(() => import('./Section/LayoutGrid3Col'), { ssr: false });

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
      <LayoutBannerPromotion />
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
          <Space h='xl' className='hidden md:block' />
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
