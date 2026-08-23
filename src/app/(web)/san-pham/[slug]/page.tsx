import { Grid, GridCol, Stack } from '@mantine/core';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache, Suspense } from 'react';
import { AppSkeleton } from '~/components/Skeleton/AppSkeleton';
import { withRedisCache } from '~/lib/CacheConfig/withRedisCache';
import { db } from '~/server/db';
import { PRODUCT_KEY } from '~/shared/constants/redis-keys';
import { ProductBase } from '~/shared/type-trpc/product.type-trpc';
import { api } from '~/trpc/server';
import { ProductInsights } from './components/client-component/ProductInsights';
import DiscountCodes from './components/DiscountCodes';
import { ProductOverview } from './components/ProductOverview';
import RelatedProducts from './components/RelatedProducts';
import SuggestionProducts from './components/SuggestionProducts';

export const revalidate = 60 * 60;

export async function generateStaticParams() {
  const products = await db.product.findMany({ select: { tag: true } });
  return products.map(p => ({ slug: p.tag.toString() }));
}

const getProduct = cache(async (slug: string) => {
  const redisKey = PRODUCT_KEY.detail(slug);
  return await withRedisCache(
    redisKey,
    async () => {
      return api.Product.getBase({ key: slug });
    },
    60 * 60 * 2
  );
});

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) {
    return {
      title: 'Không tìm thấy sản phẩm - Phụng Food',
      description: 'Sản phẩm bạn tìm kiếm hiện không tồn tại trên hệ thống.'
    };
  }

  const imageUrl = (product?.imageForEntities ?? []).flatMap(
    (item: NonNullable<ProductBase>['imageForEntities'][number]) => (item?.image?.url ? [item?.image?.url] : [])
  );

  return {
    title: `${product.name} - Phụng Food`,
    description: product.description || 'Đặc sản miền Tây chính gốc từ Phụng Food.',
    openGraph: {
      title: product.name,
      description: product.description || '',
      images: imageUrl
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

        <Grid>
          <GridCol
            mt={{ base: 'md', sm: 0 }}
            className='h-fit'
            span={{
              base: 12,
              sm: 7,
              md: 8,
              lg: 9
            }}
          >
            <ProductInsights
              productId={productId}
              productDescriptionDetailHtml={product?.descriptionDetailHtml ?? ''}
            />
          </GridCol>

          <GridCol span={{ base: 12, sm: 5, md: 4, lg: 3 }}>
            <Suspense fallback={<AppSkeleton />}>
              <SuggestionProducts productId={productId} categoryId={categoryId} />
            </Suspense>
          </GridCol>
        </Grid>

        <Suspense fallback={<AppSkeleton />}>
          <RelatedProducts productId={productId} subCateTag={subCateTag} />
        </Suspense>
      </Stack>
    </>
  );
}

export default ProductDetail;
