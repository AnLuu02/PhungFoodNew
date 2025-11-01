import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { authOptions } from '~/app/api/auth/[...nextauth]/options';
import { withRedisCache } from '~/lib/CacheConfig/withRedisCache';
import { api } from '~/trpc/server';
import ProductDetailClient from './pageClient';

export const dynamic = 'force-static';
export const revalidate = 60;

const getProduct = async (slug: string, userId: string) => {
  const redisKey = `product-detail:${slug}`;
  return withRedisCache(
    redisKey,
    async () => {
      return await api.Page.getInitProductDetail({ slug, userId });
    },
    60 * 60 * 24
  );
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const session = await getServerSession(authOptions);
  const productData = await getProduct(params.slug, session?.user?.id || '');

  if (!productData?.product) {
    return {
      title: 'Không tìm thấy sản phẩm - Phụng Food',
      description: 'Sản phẩm bạn tìm kiếm hiện không tồn tại trên hệ thống.'
    };
  }

  const { product } = productData;
  const imageUrl = product.image?.url || 'https://phungfood.com/default-image.jpg';

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
  const user = await getServerSession(authOptions);
  const data = await api.Page.getInitProductDetail({ slug, userId: user?.user?.id || '' });

  if (!data?.product) {
    return notFound();
  }
  return <ProductDetailClient data={data} />;
}

export default ProductDetail;
