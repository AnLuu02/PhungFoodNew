'use client';

import { Box, Divider, Grid, GridCol } from '@mantine/core';
import { notFound } from 'next/navigation';
import Comments from '~/components/Comments/Comments';
import ProductCardCarouselVertical from '~/components/Web/Card/CardProductCarouselVertical';
import { CardSkeleton } from '~/components/Web/Card/CardSkeleton';
import { TOP_POSITION_STICKY } from '~/constants';
import { api } from '~/trpc/react';
import RatingStatistics from '../components/client-component/RatingStatistics';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const productTag = params.slug;
  const { data: product, isLoading } = api.Product.getBase.useQuery({
    key: productTag
  });

  if (isLoading)
    return (
      <Box py='md'>
        <Grid>
          <GridCol
            pos={{ base: 'relative', md: 'sticky' }}
            top={{ base: 0, md: TOP_POSITION_STICKY }}
            className='h-fit'
            span={{ base: 12, sm: 5, md: 3, lg: 3 }}
          >
            <CardSkeleton />
          </GridCol>
          <GridCol
            pos={{ base: 'relative', md: 'sticky' }}
            top={{ base: 0, md: 70 }}
            className='h-fit'
            span={{ base: 12, sm: 6, md: 3, lg: 3 }}
          >
            <CardSkeleton />
            <Divider my='xl' />
          </GridCol>
          <GridCol
            className='h-fit'
            span={{ base: 12, sm: 12, md: 6, lg: 6 }}
            mt={{ base: 'md', sm: 'md', md: 0, lg: 0 }}
          >
            <CardSkeleton />
          </GridCol>
        </Grid>
      </Box>
    );
  if (!product) return notFound();
  return (
    <Box py='md'>
      <Grid>
        <GridCol
          pos={{ base: 'relative', md: 'sticky' }}
          top={{ base: 0, md: TOP_POSITION_STICKY }}
          className='h-fit'
          span={{ base: 12, sm: 5, md: 3, lg: 3 }}
        >
          <ProductCardCarouselVertical data={product} />
        </GridCol>
        <GridCol
          pos={{ base: 'relative', md: 'sticky' }}
          top={{ base: 0, md: 70 }}
          className='h-fit'
          span={{ base: 12, sm: 6, md: 3, lg: 3 }}
        >
          <RatingStatistics productId={product.id} />
          <Divider my='xl' />
        </GridCol>
        <GridCol
          className='h-fit'
          span={{ base: 12, sm: 12, md: 6, lg: 6 }}
          mt={{ base: 'md', sm: 'md', md: 0, lg: 0 }}
        >
          <Comments productId={product?.id} max_height_scroll={500} />

          {/* <>
            <ScrollAreaAutosize mah={500} scrollbarSize={5}>
              <Box pr={'xs'}>
                <CommentsList productId={product?.id} />
              </Box>
            </ScrollAreaAutosize>
            <CommentsForm productId={product?.id} />
          </> */}
        </GridCol>
      </Grid>
    </Box>
  );
}
