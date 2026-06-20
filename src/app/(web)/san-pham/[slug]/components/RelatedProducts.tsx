'use client';
import ProductCardCarouselVertical from '~/components/Web/Card/CardProductCarouselVertical';
import LayoutGridCarouselOnly from '~/components/Web/Home/Section/Layout-Grid-Carousel-Only';
import { GetInitProductDetail } from '~/shared/type-trpc/page.type-trpc';

export default function RelatedProducts({
  relatedProducts
}: {
  relatedProducts: NonNullable<GetInitProductDetail>['dataRelatedProducts'];
}) {
  return (
    <LayoutGridCarouselOnly
      title='Sản phẩm liên quan'
      data={relatedProducts}
      navigation={{
        href: '/thuc-don?loai=san-pham-hot',
        label: 'Xem tất cả'
      }}
      CardElement={ProductCardCarouselVertical}
    />
  );
}
