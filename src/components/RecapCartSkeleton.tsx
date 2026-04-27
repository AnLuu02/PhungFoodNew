import { Box, Card, Divider, Flex, Group, Skeleton, Stack } from '@mantine/core';

export function RecapCartSkeleton() {
  return (
    <Card shadow='sm' withBorder>
      <Stack gap='md'>
        <Flex
          align={{ base: 'flex-start', md: 'center' }}
          justify='space-between'
          direction={{ base: 'column-reverse', md: 'row' }}
        >
          <Skeleton height={28} width={180} radius='sm' />

          <Skeleton height={36} width={140} className='mb-2 md:mb-0' />
        </Flex>

        <Box className='bg-gray-100 dark:bg-dark-card' mx='-16px'>
          <Stack gap='md' py='sm' px={16}>
            {[1, 2, 3].map((_, index) => (
              <Group key={index} wrap='nowrap' align='center'>
                <Skeleton height={60} width={60} radius='sm' />
                <Stack gap={4} className='flex-1'>
                  <Skeleton height={14} width='60%' radius='xl' />
                  <Skeleton height={12} width='30%' radius='xl' />
                </Stack>
                <Skeleton height={20} width={80} radius='xl' />
              </Group>
            ))}
          </Stack>
        </Box>

        <Skeleton height={42} width='100%' />

        <Stack gap='xs'>
          {[1, 2, 3, 4].map(i => (
            <Group key={i} justify='space-between'>
              <Skeleton height={16} width={120} radius='xl' />
              <Skeleton height={16} width={80} radius='xl' />
            </Group>
          ))}

          <Divider my={4} />

          <Group justify='space-between'>
            <Skeleton height={20} width={100} radius='xl' />
            <Skeleton height={32} width={120} radius='xl' />
          </Group>
        </Stack>

        <Flex gap={0} justify='space-between' wrap='nowrap'>
          <Skeleton height={42} width='100%' />
        </Flex>
      </Stack>
    </Card>
  );
}
