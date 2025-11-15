import { Box, Card, Flex, Skeleton } from '@mantine/core';

export function PaymentStatusCardSkeleton() {
  return (
    <Card
      radius='lg'
      shadow='lg'
      className='mx-auto w-full max-w-md border-0 bg-white shadow-xl dark:bg-dark-background'
    >
      <Box className='space-y-6 p-8 text-center'>
        <Box className='flex justify-center'>
          <Skeleton circle height={80} width={80} />
        </Box>

        <Box className='space-y-2'>
          <Skeleton height={28} width='60%' className='mx-auto' />
          <Skeleton height={20} width='40%' className='mx-auto' />
        </Box>

        <Box className='flex justify-center'>
          <Skeleton height={32} width={120} radius='xl' />
        </Box>

        <Box className='space-y-3 text-gray-600'>
          <Skeleton height={20} width='80%' className='mx-auto' />
          <Skeleton height={16} width='70%' className='mx-auto' />
          <Skeleton height={16} width='60%' className='mx-auto' />
        </Box>

        <Box className='space-y-2 rounded-lg bg-gray-50 p-3 dark:bg-dark-card'>
          <Skeleton height={16} width='30%' />
          <Skeleton height={20} width='50%' />
          <Flex justify='center' gap='xs'>
            <Skeleton height={16} width='20%' />
            <Skeleton height={20} width='40%' />
          </Flex>
        </Box>

        <Box className='space-y-3'>
          <Skeleton height={44} radius='lg' />
          <Skeleton height={44} radius='lg' />
        </Box>
      </Box>
    </Card>
  );
}
