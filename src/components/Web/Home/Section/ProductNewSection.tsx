import { api } from '~/trpc/server';
import ProductCardCarouselVertical from '../../Card/CardProductCarouselVertical';
import { CarouselListBase } from '../components/CarouselListBase';

export const ProductNewSection = async () => {
  const data = await api.Product.find({ page: 1, limit: 6, loai: 'san-pham-moi' });
  const products = data?.products ?? [];
  if (products.length === 0) return null;
  return (
    <>
      <CarouselListBase
        title='Sản phẩm mới'
        data={products}
        navigation={{
          href: '/thuc-don?loai=san-pham-moi',
          label: 'Xem tất cả'
        }}
        CardElement={ProductCardCarouselVertical}
      />
    </>
  );
};
