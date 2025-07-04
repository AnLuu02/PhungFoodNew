import { Metadata } from 'next';
import { api } from '~/trpc/server';
import FoodPromotionPageClient from './pageClient';

export const metadata: Metadata = {
  title: 'Khuyến mãi hấp dẫn - Phụng Food',
  description: 'Cập nhật ưu đãi và giảm giá các món ăn miền Tây tại Phụng Food. Đặt hàng ngay để nhận ưu đãi.'
};
export default async function FoodPromotionPage() {
  const [voucherData, productData] = await Promise.allSettled([
    api.Voucher.getAll(),
    api.Product.find({
      skip: 0,
      take: 10,
      discount: true
    })
  ]);

  return (
    <FoodPromotionPageClient
      voucherData={voucherData.status === 'fulfilled' ? voucherData.value : []}
      productData={productData.status === 'fulfilled' ? productData.value : []}
    />
  );
}
