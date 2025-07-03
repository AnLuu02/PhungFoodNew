import { Metadata } from 'next';
import { api } from '~/trpc/server';
import FoodPromotionPageClient from './pageClient';
export const metadata: Metadata = {
  title: 'Khuyến mãi',
  description: 'Khuyến mãi'
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
