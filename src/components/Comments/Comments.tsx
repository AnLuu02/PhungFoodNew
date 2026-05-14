'use client';

import { Box, Divider, ScrollAreaAutosize } from '@mantine/core';
import { CommentsForm } from './CommentsForm';
import { CommentsList } from './CommentsList';

function Comments({ productId, max_height_scroll }: { productId: string; max_height_scroll?: number }) {
  return (
    <>
      <ScrollAreaAutosize
        scrollbarSize={4}
        mah={max_height_scroll || 400}
        className='mb-4 max-h-[60vh] overflow-y-auto'
      >
        <Box mr={'xs'}>
          <CommentsList productId={productId} />
        </Box>
      </ScrollAreaAutosize>
      <Divider my={'md'} />
      <CommentsForm productId={productId} />
    </>
  );
}

export default Comments;
