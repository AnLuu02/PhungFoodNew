import { Flex, Group, Skeleton, Stack } from '@mantine/core';

export const NewsItemSkeleton = () => {
  return (
    <Flex direction={{ base: 'column', sm: 'row' }} gap='lg' align='flex-start' justify='flex-start' className='w-full'>
      <Skeleton w={{ base: '100%', sm: 190, md: 190, lg: 250 }} h={{ base: 200, sm: 180, md: 180, lg: 158 }} />

      <Stack gap={5} flex={1} className='w-full'>
        <Skeleton h={28} width='90%' />

        <Group gap={5}>
          <Skeleton h={16} circle />
          <Skeleton h={14} width='30%' />
        </Group>

        <Stack gap={8} mt={5}>
          <Skeleton h={12} width='100%' />
          <Skeleton h={12} width='100%' />
          <Skeleton h={12} width='70%' />
        </Stack>

        <Skeleton h={10} width={80} mt={5} />
      </Stack>
    </Flex>
  );
};
