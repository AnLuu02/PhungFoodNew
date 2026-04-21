import { Box, Group, Skeleton } from '@mantine/core';

const ActivityItemSkeleton = () => {
  return (
    <Box className='border-l-4 border-gray-200 py-4 pl-4'>
      <Group align='flex-start' justify='space-between'>
        <Box className='flex-1'>
          <Group gap='sm' mb={6}>
            <Skeleton height={24} width={24} radius='xl' />
            <Skeleton height={20} width={60} radius='xl' />
            <Skeleton height={14} width={80} radius='sm' />
          </Group>

          <Box mb={4}>
            <Group gap={4}>
              <Skeleton height={16} width='30%' />
              <Skeleton height={16} width='20%' />
              <Skeleton height={20} width='15%' radius='xs' />
            </Group>
          </Box>

          <Skeleton height={12} width='40%' />

          <Box mt={10}>
            <Skeleton height={8} width='100%' />
          </Box>
        </Box>

        <Skeleton height={28} width={28} radius='sm' />
      </Group>
    </Box>
  );
};

export default ActivityItemSkeleton;
