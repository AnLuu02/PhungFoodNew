'use client';

import { Avatar, Box, Button, Center, Flex, Group, Paper, Rating, Space, Spoiler, Text } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { confirmDelete } from '~/lib/button-handle/ButtonDeleteConfirm';
import { formatDateViVN } from '~/lib/func-handler/Format';
import { api } from '~/trpc/react';

export const CommentsList = ({ data }: { data: any[] }) => {
  const { data: user } = useSession();
  const mutationDelete = api.Review.delete.useMutation();
  const utils = api.useUtils();

  if (!data || data.length === 0) {
    return (
      <Center mb={'lg'} className='bg-gray-100 dark:bg-dark-card'>
        <Text size='lg' className='text-gray-500 dark:text-white'>
          <i>--- Chưa có đánh giá ---</i>
        </Text>
      </Center>
    );
  }

  return data.map((comment: any) => (
    <Paper shadow='sm' p='sm' radius='md' withBorder key={comment.id} className='mb-4' pos={'relative'}>
      <Flex direction={'column'} gap={'md'} align={'flex-start'} justify={'flex-start'}>
        <Group gap={7}>
          <Avatar src={comment?.user?.image?.url} alt='User avatar' radius='lg' size={30} />
          <Box className='hidden text-left sm:block'>
            <Text fw={700} size='sm' lh={1} className='text-black dark:text-white'>
              {comment?.user?.name}
            </Text>
            <Text size='xs' fw={700} className='text-gray-500 dark:text-white'>
              {comment?.user?.email}
            </Text>
          </Box>
          <Space w={10} />
          <Rating color={'#FFC522'} size='md' value={comment.rating} readOnly />
        </Group>
        <Spoiler
          maxHeight={60}
          showLabel='Xem thêm'
          hideLabel='Ẩn'
          classNames={{
            control: 'text-sm font-bold text-mainColor'
          }}
        >
          <Text size='sm'>{comment.comment || ''}</Text>
        </Spoiler>
      </Flex>
      <Text size='xs' className='absolute bottom-2 right-2 text-gray-500 dark:text-white'>
        {formatDateViVN(comment.createdAt || new Date())}
      </Text>
      {comment.userId === user?.user?.id && (
        <Button
          variant='subtle'
          size='xs'
          className='absolute right-2 top-2 text-red-500'
          onClick={() => {
            if (comment.id && comment.userId === user?.user?.id) {
              confirmDelete({
                id: { id: comment.id },
                mutationDelete,
                entityName: 'đánh giá',
                callback: () => {
                  utils.Review.invalidate();
                  utils.Product.invalidate();
                }
              });
            }
          }}
        >
          Thu hồi
        </Button>
      )}
    </Paper>
  ));
};
