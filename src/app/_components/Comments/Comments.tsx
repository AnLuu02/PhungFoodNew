'use client';

import { Box, ScrollAreaAutosize } from '@mantine/core';
import { memo } from 'react';
import LoadingComponent from '~/app/_components/Loading/Loading';
import { api } from '~/trpc/react';
import { CommentsForm } from './CommentsForm';
import { CommentsList } from './CommentsList';

function Comments({ product, max_height_scroll }: any) {
  const { data, isLoading } = api.Review.getFilter.useQuery({ s: product?.id });
  const review = data ?? [];
  return (
    <>
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
