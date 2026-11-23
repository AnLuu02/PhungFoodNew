import { Box, Divider, ScrollAreaAutosize, Stack } from '@mantine/core';
import { Suspense } from 'react';
import { CommentsForm } from '~/components/comments/comments-form';
import { CommentsList } from '~/components/comments/comments-list';
import { CommentsSkeleton } from '~/components/comments/comments-skeleton';

function Comments({ productId, max_height_scroll }: { productId: string; max_height_scroll?: number }) {
  return (
    <>
      <Suspense
        fallback={
          <Stack gap='md'>
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <CommentsSkeleton key={index} />
              ))}
          </Stack>
        }
      >
        <ScrollAreaAutosize
          scrollbarSize={4}
          mah={max_height_scroll || 400}
          className='mb-4 max-h-[60vh] overflow-y-auto'
        >
          <Box mr={'xs'}>
            <CommentsList productId={productId} />
          </Box>
        </ScrollAreaAutosize>
      </Suspense>
      <Divider my={'md'} />
      <CommentsForm productId={productId} />
    </>
  );
}

export default Comments;
