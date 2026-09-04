import { Box, Flex, Skeleton, Stack } from '@mantine/core';

export const CarouselSkeleton = ({ minHeight }: { minHeight?: string | number }) => {
  return (
    <Box mih={minHeight || 400} className='bg-transparent' p={0}>
      <Flex direction='column' h='100%' w='100%' gap='md'>
        <Flex w='100%' gap='md' mt='md'>
          {[1, 2, 3, 4].map(item => (
            <Stack key={item} w='25%' gap='sm'>
              <Skeleton height={200} radius='md' />
              <Skeleton height={20} width='80%' radius='sm' />
              <Skeleton height={15} width='60%' radius='sm' />
              <Skeleton height={30} width='100%' radius='xl' />
            </Stack>
          ))}
        </Flex>

        <Flex justify='center' mt='auto' pt='xl'>
          <Skeleton height={40} width={150} radius='xl' />
        </Flex>
      </Flex>
    </Box>
  );
};
