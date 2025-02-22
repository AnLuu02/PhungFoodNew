import { Group, Paper, Progress, Stack, Text } from '@mantine/core';
import { IconStarFilled } from '@tabler/icons-react';

interface RatingStatisticsProps {
  ratings: number[];
}

export function RatingStatistics({ ratings }: RatingStatisticsProps) {
  const totalRatings = ratings.reduce((sum, count) => sum + count, 0) || 0;
  const averageRating = ratings.reduce((sum, count, index) => sum + count * (index + 1), 0) / totalRatings || 0;
  return (
    <Paper withBorder p='md'>
      <Stack>
        <Group>
          <Text size='xl' fw={700}>
            {averageRating.toFixed(1)}
          </Text>
          <Text size='sm' color='dimmed'>
            {totalRatings} đánh giá
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
              <Progress value={(count / totalRatings) * 100} size='xl' radius='xl' style={{ flex: 1 }} />
              <Text size='xs' color='dimmed' style={{ minWidth: '30px', textAlign: 'right' }}>
                {count}
              </Text>
            </Group>
          </Group>
        ))}
      </Stack>
    </Paper>
  );
}
