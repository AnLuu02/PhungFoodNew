'use client';
import { Group, Paper, Progress, Stack, Text } from '@mantine/core';
import { IconStarFilled } from '@tabler/icons-react';
import { api } from '~/trpc/react';
export default function RatingStatistics({ productId }: { productId: string }) {
  const { data: reviews } = api.Review.getFilter.useQuery({ s: productId });
  let ratingCountsDefault = [0, 0, 0, 0, 0];
  let ratings: number[] =
    reviews?.reduce((acc: any, item: any) => {
      acc[item.rating - 1] += 1;
      return acc;
    }, ratingCountsDefault) || ratingCountsDefault;
  let totalRating: number = ratings.reduce((sum, count) => sum + count, 0) || 0;
  let averageRating = totalRating
    ? ratings.reduce((sum, count, index) => sum + count * (index + 1), 0) / totalRating
    : 0;

  return (
    <Paper withBorder p='md'>
      <Stack gap={'xs'}>
        <Group>
          <Text size='xl' fw={700}>
            {averageRating.toFixed(1)}
          </Text>
          <Text size='sm' c='dimmed'>
            {totalRating} đánh giá
          </Text>
        </Group>
        {ratings.map((count, index) => (
          <Group key={index} gap='xs'>
            <Group gap={5}>
              <Text size='md' fw={700}>
                {index + 1}
              </Text>
              <IconStarFilled size={16} color='#FFD700' />
            </Group>
            <Group gap='xs' style={{ flex: 1 }}>
              <Progress value={(count / totalRating) * 100} size='md' radius='xl' style={{ flex: 1 }} />
              <Text size='xs' c='dimmed' style={{ minWidth: '30px', textAlign: 'right' }}>
                {count}
              </Text>
            </Group>
          </Group>
        ))}
      </Stack>
    </Paper>
  );
}
