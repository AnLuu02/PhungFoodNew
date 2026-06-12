import { Box, Flex, Paper, Skeleton } from '@mantine/core';

export const QuickMenuItemSkeleton = () => {
  return (
    <Paper p='sm' className='border border-slate-200 bg-white dark:border-white/10 dark:bg-dark-card'>
      <Flex gap='md' align='center'>
        <Skeleton h={92} w={112} radius='lg' visible />
        <Box className='flex-1'>
          <Skeleton h={18} w='45%' radius='xl' mb={10} visible />
          <Skeleton h={12} w='90%' radius='xl' mb={8} visible />
          <Skeleton h={12} w='70%' radius='xl' mb={12} visible />
          <Skeleton h={18} w={100} radius='xl' visible />
        </Box>
        <Box className='hidden sm:block'>
          <Skeleton h={36} w={150} radius='xl' visible />
        </Box>
      </Flex>
    </Paper>
  );
};
