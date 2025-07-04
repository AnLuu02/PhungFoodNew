import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { withRedisCache } from '~/lib/cache/withRedisCache';
import { api } from '~/trpc/server';
import ProductDetailClient from './components/pageClient';

type Props = {
  params: { slug: string };
};

const getProduct = async (slug: string) => {
  const redisKey = `product-detail:${slug}`;

  return withRedisCache(
    redisKey,
    async () => {
      return await api.Layout.getDataProductDetail({ slug });
    },
    60 * 60 * 24
  );
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const productData = await getProduct(params.slug);

  if (!productData?.product) {
    return {
      title: 'Không tìm thấy sản phẩm | Phụng Food',
      description: 'Sản phẩm bạn tìm kiếm hiện không tồn tại trên hệ thống.'
    };
  }

  const { product } = productData;
  const imageUrl = product.image?.url || 'https://phungfood.com/default-image.jpg';

  return {
    title: `${product.name} | Phụng Food`,
    description: product.description || 'Đặc sản miền Tây chính gốc từ Phụng Food.',
    openGraph: {
      title: product.name,
      description: product.description || '',
      images: [imageUrl]
    }
  };
}

async function ProductDetail({ params }: Props) {
  const { slug } = params;
  const data = await getProduct(slug);

  if (!data?.product) {
    return notFound();
  }

  return <ProductDetailClient data={data} />;
}

export default ProductDetail;
