'use client';

import { Box, Divider, Grid, GridCol, ScrollAreaAutosize } from '@mantine/core';
import { CommentsForm } from '~/app/_components/Comments/CommentsForm';
import { CommentsList } from '~/app/_components/Comments/CommentsList';
import CardSkeleton from '~/app/_components/Web/_components/CardSkeleton';
import ProductCardCarouselVertical from '~/app/_components/Web/Home/_Components/ProductCardCarouselVertical';
import { TOP_POSITION_STICKY } from '~/app/lib/utils/constants/constant';
import { api } from '~/trpc/react';
import RatingStatistics from '../_components/RatingStatistics';
export default function ProductPage({ params }: { params: { slug: string } }) {
  let ratingCountsDefault = [0, 0, 0, 0, 0];
  const productTag = params.slug;
  const { data, isLoading } = api.Product.getOne.useQuery({ s: productTag, hasReview: true, hasUser: true });
  const product: any = data ?? [];
  const ratingCounts =
    product?.review?.reduce((acc: any, item: any) => {
      acc[item.rating - 1] += 1;
      return acc;
    }, ratingCountsDefault) || ratingCountsDefault;
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
