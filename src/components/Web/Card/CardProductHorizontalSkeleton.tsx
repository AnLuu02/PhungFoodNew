import { Badge, Box, Card, Flex, Group, Skeleton } from '@mantine/core';

export function CardProductHorizontalSkeleton() {
  return (
    <Card withBorder padding={0} className='overflow-hidden bg-white dark:bg-dark-card'>
      <Flex h={162} gap='xs'>
        {/* IMAGE */}
        <Box w='36%' pos='relative'>
          <Skeleton h='100%' radius={0} />
        </Box>

        {/* CONTENT */}
        <Flex direction='column' justify='center' gap='xs' w='64%' pr='md'>
          {/* TITLE */}
          <Skeleton h={18} w='85%' radius='sm' />

          {/* PROGRESS */}
          <Flex direction='column' w='100%'>
            <Skeleton h={8} radius='xl' />

            <Flex justify='space-between' mt={4}>
              <Skeleton h={12} w={70} />
              <Skeleton h={12} w={40} />
            </Flex>
          </Flex>

          {/* PRICE */}
          <Group gap='xs'>
            <Skeleton h={14} w={70} />
            <Skeleton h={18} w={100} />
          </Group>

          {/* ACTION */}
          <Flex align='center' justify='space-between' w='100%'>
            <Skeleton h={36} w={120} radius='md' />

            <Skeleton h={12} w={80} />
          </Flex>
        </Flex>
      </Flex>

      {/* DISCOUNT BADGE */}
      <Badge pos='absolute' top={10} left={8} variant='light'>
        <Skeleton h={10} w={40} />
      </Badge>

      {/* RATING */}
      <Badge pos='absolute' top={0} right={0} variant='light'>
        <Skeleton h={10} w={35} />
      </Badge>
    </Card>
  );
}
