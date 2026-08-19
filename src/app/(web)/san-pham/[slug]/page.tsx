import { Stack } from '@mantine/core';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { AppSkeleton } from '~/components/Skeleton/AppSkeleton';
import { withRedisCache } from '~/lib/CacheConfig/withRedisCache';
import { db } from '~/server/db';
import { getUniqueKeyProductService } from '~/server/services/product.service';
import { PRODUCT_KEY } from '~/shared/constants/redis-keys';
import { GetInitProductDetail } from '~/shared/type-trpc/page.type-trpc';
import { api } from '~/trpc/server';
import DiscountCodes from './components/DiscountCodes';
import { ProductInsights } from './components/ProductInsights';
import { ProductOverview } from './components/ProductOverview';
import RelatedProducts from './components/RelatedProducts';

export const revalidate = 60 * 60;

export async function generateStaticParams() {
  const products = await getUniqueKeyProductService(db, { select: { tag: true } });
  return products.map(p => ({ slug: p.tag.toString() }));
}

const getProduct = async (slug: string) => {
  const redisKey = PRODUCT_KEY.detail(slug);
  return await withRedisCache(
    redisKey,
    async () => {
      return api.Product.getOne({ key: slug });
    },
    60 * 60 * 2
  );
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);
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
  const product = await getProduct(slug);
  if (!product) notFound();

  const productId = product?.id;
  const subCateTag = product?.subCategory?.tag;
  const categoryId = product?.subCategory?.categoryId;

  return (
    <>
      <ProductOverview product={product} />
      <Stack mt={'md'}>
        <Suspense fallback={<AppSkeleton />}>
          <DiscountCodes />
        </Suspense>
        <Suspense fallback={<AppSkeleton />}>
          <ProductInsights
            productId={productId}
            categoryId={categoryId}
            productDescriptionDetailHtml={product?.descriptionDetailHtml ?? ''}
          />
        </Suspense>
        <Suspense fallback={<AppSkeleton />}>
          <RelatedProducts productId={productId} subCateTag={subCateTag} />
        </Suspense>
      </Stack>
    </>
  );
}

export default ProductDetail;
