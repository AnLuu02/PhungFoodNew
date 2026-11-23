import { Box, Group, Paper, SimpleGrid, Skeleton, Stack } from '@mantine/core';

const RestaurantInformationSkeleton = () => {
  return (
    <Paper withBorder p='md'>
      <Group justify='space-between' align='center' mb='lg'>
        <Box mb={'md'}>
          <Group gap='xs' mb={8}>
            <Skeleton height={24} width={24} circle />
            <Skeleton height={28} width={200} />
          </Group>
          <Skeleton height={16} width={300} />
        </Box>

        <Group gap='sm'>
          <Skeleton height={42} width={170} />
          <Skeleton height={42} width={140} />
        </Group>
      </Group>

      <Stack gap={'xl'}>
        <Paper className='bg-gray-100 p-1 dark:bg-dark-card'>
          <SimpleGrid cols={4} spacing='xs'>
            <Skeleton height={36} />
            <Skeleton height={36} />
            <Skeleton height={36} />
            <Skeleton height={36} />
          </SimpleGrid>
        </Paper>

        <Paper shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
          <Box mb={'md'}>
            <Group gap='xs' mb={8}>
              <Skeleton height={20} width={20} circle />
              <Skeleton height={24} width={150} />
            </Group>
            <Skeleton height={14} width={250} />
          </Box>

          <Stack gap='lg'>
            <Box>
              <Skeleton height={12} width={80} mb={8} />
              <Skeleton height={40} />
            </Box>

            <Box>
              <Skeleton height={12} width={100} mb={8} />
              <Skeleton height={100} />
            </Box>

            <Box className='space-y-4'>
              <Skeleton height={16} width={120} />
              <Box className='flex items-center gap-4'>
                <Skeleton height={80} width={80} />
                <Box className='space-y-2'>
                  <Skeleton height={36} width={130} />
                  <Skeleton height={10} width={180} />
                </Box>
              </Box>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Paper>
  );
};

export default RestaurantInformationSkeleton;
