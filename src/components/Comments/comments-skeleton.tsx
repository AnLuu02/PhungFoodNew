'use client';

import { Box, Flex, Group, Paper, Skeleton, Stack } from '@mantine/core';
export function CommentsSkeleton() {
  return (
    <Paper shadow='sm' p='sm' withBorder pos='relative' className='w-full'>
      <Flex direction='column' gap='md' align='flex-start' justify='flex-start'>
        <Group gap={7} className='w-full'>
          <Skeleton height={30} circle />
          <Box className='hidden sm:block'>
            <Skeleton height={12} width={100} mb={6} radius='xl' />
            <Skeleton height={8} width={150} radius='xl' />
          </Box>

          <Box className='w-[10px]' />

          <Skeleton height={18} width={80} radius='sm' />
        </Group>

        <Stack gap={6} className='w-full'>
          <Skeleton height={14} width='95%' radius='xl' />
          <Skeleton height={14} width='70%' radius='xl' />
        </Stack>
      </Flex>

      <Box className='absolute bottom-2 right-2'>
        <Skeleton height={10} width={60} radius='xl' />
      </Box>
    </Paper>
  );
}
