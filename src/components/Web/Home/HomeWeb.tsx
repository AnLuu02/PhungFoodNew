import { Space } from '@mantine/core';
import Reveal from '~/components/Reveal';
import { formatDateViVN } from '~/lib/FuncHandler/Format';

import { Suspense } from 'react';
import { ComingSoonPage } from '~/components/ComingSoon';
import { AppSkeleton } from '~/components/Loading/AppSkeleton';
import { CategoryWithRelationBasic } from '~/shared/type-trpc/category.type-trpc';
import { GetOneBanner } from '~/shared/type-trpc/restaurant.type-trpc';
import { api, HydrateClient } from '~/trpc/server';
import { PartnerCard } from '../Card/CardPartner';
import { CarouselListBase } from './components/CarouselListBase';
import { ReusablePromoBanner } from './components/ReusablePromoBanner';
import { BannerSection } from './Section/BannerSection';
import { CategoryCarouselSection } from './Section/CategoryCarouselSection';
import { MultiCategoryListSection } from './Section/MultiCategoryListSection';
import { ProductCarouselWithSidebarBannerSection } from './Section/ProductCarouselWithSidebarBannerSection';
import { ProductCarouselWithTopTitleSection } from './Section/ProductCarouselWithTopTitleSection';
import { ProductHotSection } from './Section/ProductHotSection';
import { ProductNewSection } from './Section/ProductNewSection';
import { PromotionSection } from './Section/PromotionSection';
import { RecipeInstructionsSection } from './Section/RecipeInstructionsSection';
import { ThreeBannerSection } from './Section/ThreeBannerSection';
const HomeWeb = async ({ banners, categories }: { banners: GetOneBanner; categories: CategoryWithRelationBasic[] }) => {
  const priorityCategories = categories.slice(0, 3);
  const initCategory = priorityCategories?.[0];

  if (!priorityCategories || priorityCategories.length === 0 || !initCategory) return <ComingSoonPage />;

  const categoryProps = {
    init: initCategory,
    priorityCategories
  };

  const initLoai = ['san-pham-moi', 'san-pham-hot', 'san-pham-ban-chay'] as const;

  const initMaterials = ['rau-cu', 'hai-san'];

  await Promise.all([
    ...initLoai.map(loai => api.Product.find.prefetch({ page: 1, limit: 6, loai, 'danh-muc': initCategory.tag })),
    ...initMaterials.map(material => api.Product.find.prefetch({ page: 1, limit: 6, 'nguyen-lieu': [material] })),
    api.Product.find.prefetch({ page: 1, limit: 6, loai: 'san-pham-giam-gia' })
  ]);

  return (
    <HydrateClient>
      {banners && (
        <>
          <BannerSection banner={banners} />
          <Space h='xl' />
        </>
      )}

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
      <Reveal z={50}>
        <CategoryCarouselSection categories={categoryProps} />
        <Space h='xl' />
      </Reveal>

      <Reveal z={50}>
        <ProductCarouselWithSidebarBannerSection
          imageUrl='/images/jpg/best-saller.jpg'
          categories={categoryProps}
          loai='san-pham-ban-chay'
        />
        <Space h='xl' />
      </Reveal>

      <Reveal z={50}>
        <ThreeBannerSection />
        <Space h='xl' />
      </Reveal>

      <Reveal z={50}>
        <PromotionSection />
        <Space h='xl' />
      </Reveal>

      <Reveal z={50}>
        <ProductCarouselWithSidebarBannerSection
          imageUrl='/images/jpg/hot.jpg'
          reverseGrid={true}
          categories={categoryProps}
          title='Sản phẩm nổi bật trong cửa hàng'
          content='Ưu đãi độc quyền - Giảm giá cho hóa đơn trên 100.000 VNĐ'
          loai='san-pham-hot'
        />
        <Space h='xl' />
      </Reveal>

      <Reveal z={50}>
        <Suspense fallback={<AppSkeleton />}>
          <ProductHotSection />
        </Suspense>
        <Space h='xl' />
      </Reveal>

      <Reveal z={50}>
        <Suspense fallback={<AppSkeleton />}>
          <ProductNewSection />
        </Suspense>
        <Space h='xl' />
      </Reveal>

      <Reveal z={50}>
        <ProductCarouselWithTopTitleSection
          title='Thanh đạm'
          categories={[
            { name: 'Rau củ', tag: 'rau-cu' },
            { name: 'Các loại nấm', tag: 'cac-loai-nam' }
          ]}
        />
        <Space h='xl' />
      </Reveal>

      <Reveal z={50}>
        <ProductCarouselWithTopTitleSection
          categories={[
            { name: 'Hải sản', tag: 'hai-san' },
            { name: 'Thịt tươi', tag: 'thit-tuoi' }
          ]}
          title='Tươi ngon'
          imgaePositon={'right'}
        />
        <Space h='xl' />
      </Reveal>

      <Reveal z={50}>
        <Suspense fallback={<AppSkeleton />}>
          <RecipeInstructionsSection />
        </Suspense>
        <Space h='xl' />
      </Reveal>

      <Suspense fallback={<AppSkeleton />}>
        <Reveal z={50}>
          <MultiCategoryListSection categories={categoryProps} />
        </Reveal>
      </Suspense>
      <Reveal z={50}>
        <Space h='xl' />
        <CarouselListBase
          title='Đối tác của chúng tôi'
          data={Array.from({ length: 7 }, (_, i) => `/images/webp/img_brand_${i + 1}.webp`)}
          configs={{
            slideSize: { base: '70%', sm: '50%', md: '16.6666667%' },
            h: 'max-content'
          }}
          minHeight={180}
          CardElement={PartnerCard}
        />
      </Reveal>
    </HydrateClient>
  );
};

export default HomeWeb;
