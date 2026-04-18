'use client';

import { Grid } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useMemo } from 'react';
import { breakpoints, TOP_POSITION_STICKY } from '~/constants';
import { getImageProduct } from '~/lib/FuncHandler/getImageProduct';
import DiscountCodes from './components/DiscountCodes';
import ProductImage from './components/ProductImage';
import RelatedProducts from './components/RelatedProducts';

import { ImageType } from '@prisma/client';
import ProductCardCarouselVertical from '~/components/Web/Card/CardProductCarouselVertical';
import LayoutGridCarouselOnly from '~/components/Web/Home/Section/Layout-Grid-Carousel-Only';
import { ProductInsights } from './components/ProductInsights';
import { ProductOverview } from './components/ProductOverview';

export default function ProductDetailClient(data: any) {
  const { product, dataRelatedProducts, dataHintProducts, dataVouchers }: any = data?.data || {
    product: {},
    dataRelatedProducts: [],
    dataHintProducts: [],
    dataVouchers: []
  };
  const discount = product?.discount || 0;
  const [relatedProducts, hintProducts, inStock, gallery] = useMemo(() => {
    return [
      dataRelatedProducts?.filter((item: any) => item.id !== product?.id) || [],
      dataHintProducts?.filter((item: any) => item.id !== product?.id) || [],
      product?.availableQuantity > 0,
      product?.imageForEntities?.filter((item: any) => item?.type !== ImageType.THUMBNAIL && item?.image?.url) || []
    ];
  }, [product]);

  const isMobile = useMediaQuery(`(max-width: ${breakpoints.xs}px)`);

  return (
    <>
      <Grid>
        <Grid.Col
          span={{ base: 12, sm: 6, md: 6 }}
          pos={isMobile ? 'relative' : 'sticky'}
          top={isMobile ? 0 : TOP_POSITION_STICKY}
          className='h-fit'
        >
          <ProductImage
            thumbnail={
              getImageProduct(product?.imageForEntities || [], ImageType.THUMBNAIL) || '/images/jpg/empty-300x240.jpg'
            }
            gallery={gallery?.length > 0 ? gallery : []}
            discount={discount}
            tag={product?.tag || ''}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 6 }} className='h-fit'>
          <ProductOverview product={product} />
        </Grid.Col>
      </Grid>
      <Grid mt={'md'}>
        {dataVouchers?.length > 0 && !isMobile ? (
          <Grid.Col span={12}>
            <DiscountCodes data={dataVouchers || []} />
          </Grid.Col>
        ) : null}

        <Grid.Col
          mt={{ base: 'md', sm: 0 }}
          className='h-fit'
          span={{
            base: 12,
            sm: hintProducts?.length > 0 ? 7 : 12,
            md: hintProducts?.length > 0 ? 8 : 12,
            lg: hintProducts?.length > 0 ? 9 : 12
          }}
        >
          <ProductInsights product={product} />
        </Grid.Col>

        {hintProducts?.length > 0 && (
          <Grid.Col span={{ base: 12, sm: 5, md: 4, lg: 3 }}>
            <RelatedProducts data={hintProducts} />
          </Grid.Col>
        )}

        {relatedProducts?.length > 0 && (
          <Grid.Col span={12}>
            <LayoutGridCarouselOnly
              title='Sản phẩm liên quan'
              data={relatedProducts}
              navigation={{
                href: '/thuc-don?loai=san-pham-hot',
                label: 'Xem tất cả'
              }}
              CardElement={ProductCardCarouselVertical}
            />
          </Grid.Col>
        )}
      </Grid>
    </>
  );
}
