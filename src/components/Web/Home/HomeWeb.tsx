import { Space } from '@mantine/core';
import Reveal from '~/components/Reveal';
import { formatDateViVN } from '~/lib/FuncHandler/Format';
import { recipes } from '~/lib/HardData/recipe';
import { PartnerCard } from '../Card/CardPartner';
import ProductCardCarouselVertical from '../Card/CardProductCarouselVertical';
import RecipeCard from './components/RecipeCard';
import BannerSection from './Section/Banner-section';
import CategoryCarouselHorizontal, { IDataCategory } from './Section/Category-Carousel-Horizontal';
import ReusablePromoBanner from './Section/Layout-Banner-Promotion';
import LayoutGridCarouselOnly from './Section/Layout-Grid-Carousel-Only';
import FastMenuSection from './Section/Layout-Menu-Quick-Sale-Order';
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
      <Reveal z={50}>
        <ReusablePromoBanner
          title='🎉 Ưu đãi đặc biệt 🎉'
          subtitle={
            <>
              🔊 Từ ngày <b className='text-4xl italic text-yellow-500'>{formatDateViVN(new Date())}</b> đến hết ngày{' '}
              <b className='text-4xl italic text-yellow-500'>
                {formatDateViVN(new Date().setDate(new Date().getDate() + 1))}
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
      </Reveal>
      <Space h='xl' />
      {data.category?.anVat && (
        <Reveal z={50}>
          <CategoryCarouselHorizontal data={data.category} />
          <Space h='xl' />
        </Reveal>
      )}

      {data.productBestSaler?.products?.length > 0 && (
        <Reveal z={50}>
          <LayoutProductCarouselWithImage
            imageUrl='/images/jpg/best-saller.jpg'
            data={data.productBestSaler?.products}
            loai='san-pham-ban-chay'
          />
          <Space h='xl' />
        </Reveal>
      )}

      <Reveal z={50}>
        <LayoutGrid3Col />
        <Space h='xl' />
      </Reveal>

      {data.productDiscount?.products?.length > 0 && (
        <Reveal z={50}>
          <LayoutPromotion data={data.productDiscount?.products} />
          <Space h='xl' />
        </Reveal>
      )}

      {data.productHot?.products?.length > 0 && (
        <Reveal z={50}>
          <LayoutProductCarouselWithImage
            imageUrl='/images/jpg/hot.jpg'
            data={data.productHot?.products}
            reverseGrid={true}
            title='Sản phẩm nổi bật trong cửa hàng'
            content='Ưu đãi độc quyền - Giảm giá cho hóa đơn trên 100.000 VNĐ'
            loai='san-pham-hot'
          />
          <Space h='xl' />
        </Reveal>
      )}

      {data.productHot?.products?.length > 0 && (
        <Reveal z={50}>
          <LayoutGridCarouselOnly
            title='Sản phẩm nổi bật'
            data={data.productHot?.products}
            navigation={{
              href: '/thuc-don?loai=san-pham-hot',
              label: 'Xem tất cả'
            }}
            CardElement={ProductCardCarouselVertical}
          />
          <Space h='xl' />
        </Reveal>
      )}

      {data.productNew?.products?.length > 0 && (
        <Reveal z={50}>
          <LayoutGridCarouselOnly
            title='Sản phẩm mới'
            data={data.productNew?.products}
            navigation={{
              href: '/thuc-don?loai=san-pham-moi',
              label: 'Xem tất cả'
            }}
            CardElement={ProductCardCarouselVertical}
          />
          <Space h='xl' />
        </Reveal>
      )}

      {data.materials?.rauCu?.products?.length > 0 && (
        <Reveal z={50}>
          <LayoutProductCarouselWithImage2
            data={{ 'rau-cu': data.materials.rauCu, 'cac-loai-nam': data.materials.cacLoaiNam }}
            title='Thanh đạm'
            navbar={[
              { label: 'Rau củ', key: 'rau-cu', url: 'rau-cu' },
              { label: 'Các loại nấm', key: 'cac-loai-nam', url: 'cac-loai-nam' }
            ]}
          />
          <Space h='xl' />
        </Reveal>
      )}

      {data.materials?.thitTuoi?.products?.length > 0 && (
        <Reveal z={50}>
          <LayoutProductCarouselWithImage2
            data={{ 'hai-san': data.materials.haiSan, 'thit-tuoi': data.materials.thitTuoi }}
            title='Tươi ngon'
            imgaePositon={'right'}
            navbar={[
              { label: 'Thịt tươi', key: 'thit-tuoi', url: 'thit-tuoi' },
              { label: 'Hải sản', key: 'hai-san', url: 'hai-san' }
            ]}
          />
          <Space h='xl' />
        </Reveal>
      )}

      <Reveal z={50}>
        <LayoutGridCarouselOnly
          title='Video hướng dẫn'
          data={recipes}
          configs={{
            slideSize: { base: '100%', sm: '50%', md: '25%' },
            h: 'max-content'
          }}
          navigation={{
            href: '/',
            label: 'Xem tất cả'
          }}
          CardElement={RecipeCard}
        />
        <Space h='xl' />
      </Reveal>
      {/* <>
          <LayoutGridCarouselOnly
            title='Tin tức tiêu dùng'
            data={data.news?.news}
            configs={{
              slideSize: { base: '100%', sm: '50%', md: '25%' },
              h: 'max-content'
            }}
            navigation={{
              href: '/tin-tuc',
              label: 'Xem tất cả'
            }}
            CardElement={ConsumerCard}
          />
          <Space h='xl' />
        </> */}

      {(data.category.anVat || data.category.thucUong || data.category.monChinh) && (
        <Reveal z={50}>
          <FastMenuSection
            data={{
              anVat: data.category.anVat,
              thucUong: data.category.thucUong,
              monChinh: data.category.monChinh
            }}
          />
        </Reveal>
      )}
      <Reveal z={50}>
        <Space h='xl' />
        <LayoutGridCarouselOnly
          title='Đối tác của chúng tôi'
          data={Array.from({ length: 7 }, (_, i) => `/images/webp/img_brand_${i + 1}.webp`)}
          configs={{
            slideSize: { base: '100%', sm: '50%', md: '16.6666667%' },
            h: 'max-content'
          }}
          minHeight={180}
          CardElement={PartnerCard}
        />
      </Reveal>
    </>
  );
};

export default HomeWeb;
