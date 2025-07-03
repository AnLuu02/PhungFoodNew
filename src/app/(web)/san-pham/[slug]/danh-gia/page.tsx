'use client';

import { Box, Divider, Grid, GridCol, ScrollAreaAutosize } from '@mantine/core';
import { useMemo } from 'react';
import CardSkeleton from '~/components/CardSkeleton';
import { CommentsForm } from '~/components/Comments/CommentsForm';
import { CommentsList } from '~/components/Comments/CommentsList';
import ProductCardCarouselVertical from '~/components/Web/Home/components/ProductCardCarouselVertical';
import { TOP_POSITION_STICKY } from '~/constants';
import { api } from '~/trpc/react';
import RatingStatistics from '../components/RatingStatistics';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const productTag = params.slug;
  const { data, isLoading } = api.Product.getOne.useQuery({ s: productTag, hasReview: true, hasUser: true });
  let ratingCountsDefault = [0, 0, 0, 0, 0];
  const product: any = data ?? [];
  const ratingCounts = useMemo(() => {
    return (
      product?.review?.reduce((acc: any, item: any) => {
        acc[item.rating - 1] += 1;
        return acc;
      }, ratingCountsDefault) || ratingCountsDefault
    );
  }, [product?.review]);

  return (
    <Box py='md'>
      <Grid>
        <GridCol
          pos={{ base: 'relative', md: 'sticky' }}
          top={{ base: 0, md: TOP_POSITION_STICKY }}
          className='h-fit'
          span={{ base: 12, sm: 5, md: 3, lg: 3 }}
        >
          {isLoading ? <CardSkeleton /> : <ProductCardCarouselVertical product={product} />}
        </GridCol>
        <GridCol
          pos={{ base: 'relative', md: 'sticky' }}
          top={{ base: 0, md: 70 }}
          className='h-fit'
          span={{ base: 12, sm: 6, md: 3, lg: 3 }}
        >
          {isLoading ? <CardSkeleton /> : <RatingStatistics ratings={ratingCounts} />}
          <Divider my='xl' />
        </GridCol>
        <GridCol
          className='h-fit'
          span={{ base: 12, sm: 12, md: 6, lg: 6 }}
          mt={{ base: 'md', sm: 'md', md: 0, lg: 0 }}
        >
          {isLoading ? (
            <CardSkeleton />
          ) : (
            <>
              <ScrollAreaAutosize mah={500}>
                <CommentsList data={product?.review || []} />
              </ScrollAreaAutosize>
              <CommentsForm product={product} />
            </>
          )}
        </GridCol>
      </Grid>
    </Box>
  );
}
