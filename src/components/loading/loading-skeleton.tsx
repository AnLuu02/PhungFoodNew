import {
  Box,
  Card,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  SkeletonProps,
  Stack
} from '@mantine/core';

interface BaseSkeletonProps extends SkeletonProps {
  count?: number;
  cols?: number;
}

export function CommonSkeleton() {
  return null;
}

CommonSkeleton.ProfileCard = ({ count = 3 }: BaseSkeletonProps) => (
  <Card shadow='lg' withBorder className='h-full pt-10 sm:p-7'>
    <Box pos='absolute' top={10} right={4}>
      <Skeleton height={28} width={28} radius='xl' />
    </Box>

    <Group mb='md' align='flex-start'>
      <Skeleton height={90} width={90} radius='xl' />

      <Stack gap={6} className='flex-1'>
        <Skeleton height={24} width='50%' radius='sm' />
        <Flex align='center' gap={10}>
          <Skeleton height={35} width={120} radius='sm' />
          <Skeleton height={24} width={80} radius='xl' />
        </Flex>
      </Stack>
    </Group>

    <Divider mb={16} />

    <Grid mb='md'>
      {[...Array(4)].map((_, idx) => (
        <GridCol span={6} key={idx}>
          <Skeleton height={14} width='40%' mb={6} radius='sm' />
          <Skeleton height={16} width='80%' radius='sm' />
        </GridCol>
      ))}
      <GridCol span={12}>
        <Skeleton height={14} width='20%' mb={6} radius='sm' />
        <Skeleton height={16} width='95%' radius='sm' />
      </GridCol>
    </Grid>

    <Grid mt='auto'>
      <GridCol span={12}>
        <Paper withBorder p='md' shadow='xs'>
          <Skeleton height={16} width='60%' mb={12} radius='sm' />
          <Stack gap='xs'>
            <Skeleton height={14} width='90%' radius='sm' />
            <Skeleton height={14} width='85%' radius='sm' />
            <Skeleton height={14} width='40%' radius='sm' />
          </Stack>
        </Paper>
      </GridCol>
    </Grid>
  </Card>
);

CommonSkeleton.InfoGrid = ({ count = 4 }: BaseSkeletonProps) => (
  <Card shadow='sm' withBorder className='sm:p-7'>
    <GridSimple count={count} />
  </Card>
);

CommonSkeleton.StatsGrid = ({ count = 8, cols = 2 }: BaseSkeletonProps) => (
  <Card shadow='sm' className='sm:p-7' withBorder>
    <Stack gap='md'>
      <Flex align='center' justify='space-between'>
        <Skeleton height={20} width='50%' radius='sm' />
        <Skeleton height={24} width={60} radius='sm' />
      </Flex>

      <SimpleGrid cols={cols}>
        {[...Array(count)].map((_, idx) => (
          <Paper key={idx} className='flex min-w-[120px] items-center gap-[10px] px-4 py-3 shadow-md'>
            <Skeleton height={32} width={32} radius='xl' />
            <Box className='flex-1'>
              <Skeleton height={18} width='30%' mb={6} radius='sm' />
              <Skeleton height={12} width='60%' radius='sm' />
            </Box>
          </Paper>
        ))}
      </SimpleGrid>

      <Divider my={12} />

      <Box>
        <Skeleton height={18} width='60%' mb='xs' radius='sm' />
        <Skeleton height={8} radius='xl' mb='xs' />
        <Skeleton height={14} width='80%' radius='sm' />
      </Box>
    </Stack>
  </Card>
);

CommonSkeleton.ProgressBlock = () => (
  <Card shadow='sm' withBorder className='sm:p-7'>
    <Skeleton height={20} width='50%' mb='md' radius='sm' />
    <Stack gap='xs'>
      <Flex justify='space-between'>
        <Skeleton height={14} width='30%' radius='sm' />
        <Skeleton height={14} width='15%' radius='sm' />
      </Flex>
      <Skeleton height={10} radius='xl' />
      <Skeleton height={12} width='80%' radius='sm' mt={4} />
    </Stack>
  </Card>
);

CommonSkeleton.Table = ({ count = 5 }: BaseSkeletonProps) => (
  <Card shadow='sm' withBorder className='overflow-hidden'>
    <Flex justify='space-between' align='center' mb='md'>
      <Skeleton height={36} width={200} radius='sm' />
      <Skeleton height={36} width={100} radius='sm' />
    </Flex>
    <Box className='rounded-sm bg-gray-50 p-3 dark:bg-neutral-800'>
      <Flex gap='md'>
        <Skeleton height={16} width='5%' radius='sm' />
        <Skeleton height={16} width='35%' radius='sm' />
        <Skeleton height={16} width='20%' radius='sm' />
        <Skeleton height={16} width='20%' radius='sm' />
        <Skeleton height={16} width='20%' radius='sm' />
      </Flex>
    </Box>
    <Stack gap='xs' mt='sm'>
      {[...Array(count)].map((_, idx) => (
        <Flex gap='md' p='sm' key={idx} className='border-b border-gray-100 last:border-none dark:border-neutral-800'>
          <Skeleton height={16} width='5%' radius='sm' />
          <Skeleton height={16} width='35%' radius='sm' />
          <Skeleton height={16} width='20%' radius='sm' />
          <Skeleton height={16} width='20%' radius='sm' />
          <Skeleton height={16} width='20%' radius='sm' />
        </Flex>
      ))}
    </Stack>
  </Card>
);

CommonSkeleton.Chart = ({ items = 10 }) => (
  <Card shadow='sm' withBorder className='sm:p-7'>
    <Flex justify='space-between' align='center' mb='xl'>
      <Stack gap={6}>
        <Skeleton height={20} width={150} radius='sm' />
        <Skeleton height={14} width={220} radius='sm' />
      </Stack>
      <Group gap='xs'>
        <Skeleton height={24} width={60} radius='sm' />
        <Skeleton height={24} width={60} radius='sm' />
      </Group>
    </Flex>
    <Flex
      align='flex-end'
      justify='space-between'
      h={200}
      className='border-b border-l border-gray-200 px-4 dark:border-neutral-700'
    >
      {[...Array(items)].map((_, idx) => (
        <Skeleton height={`${Math.floor(Math.random() * 101)}%`} width='8%' radius='top-sm' />
      ))}
    </Flex>
  </Card>
);

CommonSkeleton.FeedList = ({ count = 3 }: BaseSkeletonProps) => (
  <Card shadow='sm' withBorder className='sm:p-7'>
    <Skeleton height={20} width={120} mb='xl' radius='sm' />
    <Stack gap='lg'>
      {[...Array(count)].map((_, idx) => (
        <Group key={idx} align='flex-start' wrap='nowrap'>
          <Skeleton height={40} width={40} radius='xl' className='shrink-0' />
          <Stack gap={6} className='flex-1'>
            <Flex justify='space-between' align='center'>
              <Skeleton height={16} width={120} radius='sm' />
              <Skeleton height={12} width={60} radius='sm' />
            </Flex>
            <Skeleton height={14} width='95%' radius='sm' />
            <Skeleton height={14} width='70%' radius='sm' />
          </Stack>
        </Group>
      ))}
    </Stack>
  </Card>
);

CommonSkeleton.Form = ({ count = 4 }: BaseSkeletonProps) => (
  <Card shadow='sm' withBorder className='sm:p-7'>
    <Skeleton height={24} width={180} mb='xl' radius='sm' />
    <Grid>
      {[...Array(count)].map((_, idx) => (
        <GridCol span={{ base: 12, sm: 6 }} key={idx}>
          <Skeleton height={14} width={80} mb={8} radius='sm' />
          <Skeleton height={40} width='100%' radius='sm' />
        </GridCol>
      ))}
      <GridCol span={12}>
        <Skeleton height={14} width={100} mb={8} radius='sm' />
        <Skeleton height={100} width='100%' radius='sm' />
      </GridCol>
    </Grid>
    <Flex justify='flex-end' gap='sm' mt='xl'>
      <Skeleton height={36} width={90} radius='sm' />
      <Skeleton height={36} width={120} radius='sm' />
    </Flex>
  </Card>
);

const GridSimple = ({ count }: { count: number }) => (
  <SimpleGrid cols={2} spacing='md'>
    {[...Array(count)].map((_, idx) => (
      <Box key={idx}>
        <Skeleton height={12} width='40%' mb={8} radius='sm' />
        <Skeleton height={16} width='85%' radius='sm' />
      </Box>
    ))}
  </SimpleGrid>
);
