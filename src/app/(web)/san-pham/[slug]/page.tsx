import { Stack } from '@mantine/core';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { withRedisCache } from '~/lib/CacheConfig/withRedisCache';
import { GetInitProductDetail } from '~/shared/type-trpc/page.type-trpc';
import { api } from '~/trpc/server';
import DiscountCodes from './components/DiscountCodes';
import { ProductInsights } from './components/ProductInsights';
import { ProductOverview } from './components/ProductOverview';
import RelatedProducts from './components/RelatedProducts';

export const revalidate = 60 * 60;

const getProduct = async (slug: string) => {
  const redisKey = `product:detail:${slug}`;
  return await withRedisCache(
    redisKey,
    async () => {
      return api.Page.getInitProductDetail({ slug });
    },
    60 * 60 * 24
  );
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getProduct(params.slug);
  const product = data?.product;
  if (!product) {
    return {
      title: 'Không tìm thấy sản phẩm - Phụng Food',
      description: 'Sản phẩm bạn tìm kiếm hiện không tồn tại trên hệ thống.'
    };
  }

  const imageUrl = (product?.imageForEntities ?? []).flatMap(
    (item: NonNullable<GetInitProductDetail>['product']['imageForEntities'][number]) =>
      item?.image?.url ? [item?.image?.url] : []
  );

  return {
    title: `${product.name} - Phụng Food`,
    description: product.description || 'Đặc sản miền Tây chính gốc từ Phụng Food.',
    openGraph: {
      title: product.name,
      description: product.description || '',
      images: imageUrl as any
    }
  };
}

async function ProductDetail({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const data = await getProduct(slug);
  const product = data?.product;
  if (!product) notFound();

  return (
    <>
      <ProductOverview product={product} />
      <Stack mt={'md'}>
        <DiscountCodes data={data?.dataVouchers} />
        <ProductInsights
          productId={product?.id ?? ''}
          productDescriptionDetailHtml={product?.descriptionDetailHtml ?? ''}
          hintProducts={data?.dataHintProducts}
        />
        <RelatedProducts relatedProducts={data?.dataRelatedProducts} />
      </Stack>
    </>
  );
}

export default ProductDetail;
