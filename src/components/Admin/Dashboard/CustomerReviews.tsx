import { Box, Card, Center, RingProgress, Text, Title } from '@mantine/core';

interface CustomerReviewsProps {
  rating: number;
  totalReviews: number;
}

export default function CustomerReviews({ rating, totalReviews }: CustomerReviewsProps) {
  const displayRating = Math.min(Math.max(rating, 0), 100);

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder className='h-full'>
      <Title order={4} mb='md' className='font-quicksand text-gray-800 dark:text-dark-text'>
        Đánh giá khách hàng
      </Title>

      <Center className='flex-1'>
        <RingProgress
          size={200}
          thickness={12}
          sections={[
            {
              value: displayRating,
              color: displayRating >= 80 ? '#10b981' : displayRating >= 60 ? '#f59e0b' : '#ef4444'
            }
          ]}
          label={
            <Box className='text-center'>
              <Text size='xl' fw={700} className='text-gray-800 dark:text-dark-text'>
                {displayRating.toFixed(1)}%
              </Text>
              <Text size='sm' c='dimmed'>
                Hài lòng
              </Text>
            </Box>
          }
        />
      </Center>

      <Text ta='center' mt='sm' size='sm' c='dimmed' className='text-gray-600 dark:text-dark-text'>
        Thống kê theo tỉ lệ đánh giá từ 4 sao trở lên.
        <br />
        Dựa trên {totalReviews} đánh giá
      </Text>
    </Card>
  );
}
