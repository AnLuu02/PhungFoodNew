'use client';

import { Badge, Box, ScrollAreaAutosize, Text } from '@mantine/core';
import { memo } from 'react';
import LoadingComponent from '~/app/_components/Loading';
import { api } from '~/trpc/react';
import { CommentsForm } from './CommentsForm';
import { CommentsList } from './CommentsList';

function Comments({ product, max_height_scroll }: any) {
  const { data, isLoading } = api.Review.getFilter.useQuery({ query: product?.id });
  const review = data ?? [];
  return (
    <>
      <Badge
        radius={'md'}
        py={10}
        pt={20}
        pr={20}
        bg={'red'}
        color='white'
        pos={'absolute'}
        top={'-10px'}
        right={'-10px'}
        className='z-[10000000]'
      >
        <Text size='xs'>Có {review?.length || 0} đánh giá</Text>
      </Badge>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <>
          <ScrollAreaAutosize
            scrollbarSize={4}
            mah={max_height_scroll || 400}
            className='mb-4 max-h-[60vh] overflow-y-auto'
          >
            <Box mr={'xs'}>
              <CommentsList data={review} />
            </Box>
          </ScrollAreaAutosize>
        </>
      )}
      <CommentsForm product={product} />
    </>
  );
}

export default memo(Comments);
