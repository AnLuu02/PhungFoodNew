import ProductCardCarouselVertical from '~/components/web/cards/card-product-carousel-vertical';
import { CarouselListBase } from '~/components/web/home/components/carousel-list-base';
import { api } from '~/trpc/server';

export default async function RelatedProducts({ productId, subCateTag }: { productId?: string; subCateTag?: string }) {
  const relatedProducts = await api.Product.getFilter({
    keys: subCateTag ? [subCateTag] : [],
    ...(productId ? { excludes: [productId] } : {})
  });

  if (!relatedProducts) return;

  return (
    <CarouselListBase
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
