import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { withRedisCache } from '~/lib/CacheConfig/withRedisCache';
import { api } from '~/trpc/server';
import { InitProductDetail } from '~/types/client-type-trpc';
import ProductDetailClient from './pageClient';

export const dynamic = 'force-static';
export const revalidate = 60 * 60;

const getProduct = async (slug: string) => {
  const redisKey = `product-detail:${slug}`;
  return withRedisCache(
    redisKey,
    async () => {
      return await api.Page.getInitProductDetail({ slug });
    },
    60 * 60 * 24
  );
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const productData = await getProduct(params.slug);

  if (!productData?.product) {
    return {
      title: 'Không tìm thấy sản phẩm - Phụng Food',
      description: 'Sản phẩm bạn tìm kiếm hiện không tồn tại trên hệ thống.'
    };
  }

  const { product } = productData;
  const imageUrl = product.images?.[0]?.url || 'https://phungfood.com/default-image.jpg';

  return {
    title: `${product.name} - Phụng Food`,
    description: product.description || 'Đặc sản miền Tây chính gốc từ Phụng Food.',
    openGraph: {
      title: product.name,
      description: product.description || '',
      images: [imageUrl]
    }
  };
}

async function ProductDetail({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const data = await api.Page.getInitProductDetail({ slug });

  if (!data?.product) {
    return notFound();
  }
  return <ProductDetailClient data={data as InitProductDetail} />;
}

export default ProductDetail;
