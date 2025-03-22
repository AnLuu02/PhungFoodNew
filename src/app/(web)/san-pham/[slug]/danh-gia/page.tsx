'use client';

import { Container, Divider, Grid, GridCol, ScrollAreaAutosize, Stack } from '@mantine/core';
import { CommentsForm } from '~/app/_components/Comments/CommentsForm';
import { CommentsList } from '~/app/_components/Comments/CommentsList';
import CardSkeleton from '~/app/_components/Web/_components/CardSkeleton';
import ProductCardCarouselVertical from '~/app/_components/Web/Home/_Components/ProductCardCarouselVertical';
import { api } from '~/trpc/react';
import { RatingStatistics } from '../_components/RatingStatistics';
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
    <Container size='xl' py='xl'>
      <Grid gutter='xl'>
        <GridCol span={12}>
          <Stack gap='xl'>
            <Grid>
              <GridCol span={3}>
                {isLoading ? <CardSkeleton /> : <ProductCardCarouselVertical product={product} />}
              </GridCol>
              <GridCol span={4}>
                {isLoading ? <CardSkeleton /> : <RatingStatistics ratings={ratingCounts} />}
                <Divider my='xl' />
              </GridCol>
              <GridCol span={5}>
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
          </Stack>
        </GridCol>
      </Grid>
    </Container>
  );
}
