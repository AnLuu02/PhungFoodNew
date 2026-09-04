import ProductCardCarouselVertical from '~/components/Web/Card/CardProductCarouselVertical';
import { CarouselListBase } from '~/components/Web/Home/components/CarouselListBase';
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
