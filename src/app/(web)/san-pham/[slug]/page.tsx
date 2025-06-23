import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { withRedisCache } from '~/app/lib/utils/func-handler/withRedisCache';
import { api } from '~/trpc/server';
import ProductDetailClient from './_components/pageClient';
export const metadata: Metadata = {
  title: 'Chi tiết sản phẩm',
  description: 'Chi tiết sản phẩm'
};
const getProduct = async (slug: string) => {
  const redisKey = `product-detail:${slug}`;

  return withRedisCache(
    redisKey,
    async () => {
      return await api.Layout.getDataProductDetail({
        slug
      });
    },
    60 * 60 * 24
  );
};
async function ProductDetail({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const data = await getProduct(slug);

  if (!data?.product) {
    return notFound();
  }

  return <ProductDetailClient data={data} />;
}

export default ProductDetail;
