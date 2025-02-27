'use client';

import { Avatar, Box, Button, Center, Flex, Group, Paper, Rating, Space, Spoiler, Text } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { handleDelete } from '~/app/lib/utils/button-handle/ButtonDeleteConfirm';
import { api } from '~/trpc/react';

export const CommentsList = ({ data }: { data: any[] }) => {
  const mutationDel = api.Review.delete.useMutation();
  const utils = api.useUtils();
  const { data: user } = useSession();

  return data?.length > 0 ? (
    data.map((comment: any) => (
      <Paper shadow='sm' p='sm' radius='md' withBorder key={comment.id} className='mb-4' pos={'relative'}>
        <Flex direction={'column'} gap={'md'} align={'flex-start'} justify={'flex-start'}>
          <Group gap={7}>
            <Avatar src={comment?.user?.images?.[0]?.url} alt='User avatar' radius='lg' size={30} />
            <Box className='hidden text-left sm:block'>
              <Text fw={700} size='sm' lh={1} className='text-black'>
                {comment?.user?.name}
              </Text>
              <Text size='xs' fw={700} className='text-gray-500'>
                {comment?.user?.email}
              </Text>
            </Box>
            <Space w={10} />
            <Rating color='yellow.8' size='md' value={comment.rating} readOnly />
          </Group>
          <Spoiler
            maxHeight={60}
            showLabel='Xem thêm'
            hideLabel='Ẩn'
            styles={{
              control: { color: '#008b4b', fontWeight: 700, fontSize: '14px' }
            }}
          >
            <Text size='sm'>{comment.comment || ''}</Text>
          </Spoiler>
        </Flex>
        <Text size='xs' className='absolute bottom-2 right-2 text-gray-500'>
          {new Date(comment.createdAt || '').toLocaleString() || '02:53 ngày 17-01-2024'}
        </Text>
        {comment.userId === user?.user?.id && (
          <Button
            variant='subtle'
            size='xs'
            className='absolute right-2 top-2'
            c={'red.5'}
            onClick={() => {
              if (comment.id && comment.userId === user?.user?.id) {
                handleDelete({ id: comment.id }, mutationDel, 'Bình luận', () => {
                  utils.Review.invalidate();
                  utils.Product.invalidate();
                });
              }
            }}
          >
            Thu hồi
          </Button>
        )}
      </Paper>
    ))
  ) : (
    <Center mb={'lg'} bg={'gray.1'}>
      <Text size='lg' className='text-gray-500'>
        <i>--- Chưa có đánh giá ---</i>
      </Text>
    </Center>
  );
};
