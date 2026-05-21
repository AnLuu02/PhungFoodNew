'use client';

import { Box, Button, Center, Flex, Group, Paper, Rating, Space, Spoiler, Stack, Text } from '@mantine/core';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { onHandleModalAction } from '~/lib/ButtonHandler/ButtonHandleAction';
import { formatDateViVN } from '~/lib/FuncHandler/Format';
import { FindReview } from '~/shared/type-trpc/review.type-trpc';
import { api } from '~/trpc/react';
import { CommentsSkeleton } from './CommentsSkeleton';

export const CommentsList = ({ productId }: { productId: string }) => {
  const { data, isLoading } = api.Review.find.useQuery({
    page: 1,
    limit: 100,
    ...(productId ? { relationId: productId } : {})
  });
  const reviews = data?.reviews || [];
  const { data: user } = useSession();
  const utils = api.useUtils();
  const mutationDelete = api.Review.delete.useMutation({
    onSuccess: () => {
      utils.Review.invalidate();
      utils.Product.invalidate();
    }
  });

  if (!reviews || reviews.length === 0) {
    return (
      <Paper className='bg-gray-100 dark:bg-dark-card'>
        <Center mb={'lg'}>
          <Text size='lg' className='text-gray-500 dark:text-dark-text'>
            <i>--- Chưa có đánh giá ---</i>
          </Text>
        </Center>
      </Paper>
    );
  }

  return isLoading ? (
    <Stack gap='md'>
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <CommentsSkeleton key={index} />
        ))}
    </Stack>
  ) : (
    <>
      <Stack>
        {reviews.map((comment: FindReview['reviews'][number]) => (
          <Paper shadow='sm' p='sm' withBorder key={comment.id} pos={'relative'}>
            <Flex direction={'column'} gap={'md'} align={'flex-start'} justify={'flex-start'}>
              <Group gap={7}>
                <Image
                  className='rounded-full object-cover'
                  width={30}
                  height={30}
                  src={comment?.user?.imageForEntity?.image?.url || '/images/webp/user-default.webp'}
                  alt='User avatar'
                />
                <Box className='hidden text-left sm:block'>
                  <Text fw={700} size='sm' lh={1} className='text-black dark:text-dark-text'>
                    {comment?.user?.name}
                  </Text>
                  <Text size='xs' fw={700} className='text-gray-500 dark:text-dark-text'>
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
            <Text size='xs' className='absolute bottom-2 right-2 text-gray-500 dark:text-dark-text'>
              {formatDateViVN(comment.createdAt || new Date())}
            </Text>
            {comment.user.id === user?.user?.id && (
              <Box className='absolute right-2 top-2'>
                <Button
                  variant='transparent'
                  size='xs'
                  className='text-red-600'
                  onClick={() => {
                    if (comment.id && comment.user.id === user?.user?.id) {
                      onHandleModalAction({
                        type: 'delete',
                        customProps: {
                          onConfirm: async () => {
                            await mutationDelete.mutateAsync({ id: comment.id });
                          }
                        }
                      });
                    }
                  }}
                >
                  Thu hồi
                </Button>
              </Box>
            )}
          </Paper>
        ))}
      </Stack>
    </>
  );
};
