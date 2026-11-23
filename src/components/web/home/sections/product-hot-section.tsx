import { api } from '~/trpc/server';
import ProductCardCarouselVertical from '~/components/web/cards/card-product-carousel-vertical';
import { CarouselListBase } from '~/components/web/home/components/carousel-list-base';

export const ProductHotSection = async () => {
  const data = await api.Product.find({ page: 1, limit: 6, loai: 'san-pham-hot' });
  const products = data?.products ?? [];
  if (products.length === 0) return null;

  return (
    <>
      <CarouselListBase
        title='Sản phẩm nổi bật'
        data={products}
        navigation={{
          href: '/thuc-don?loai=san-pham-hot',
          label: 'Xem tất cả'
        }}
        CardElement={ProductCardCarouselVertical}
      />
    </>
  );
};
