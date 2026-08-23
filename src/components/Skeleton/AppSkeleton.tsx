import { Box, Flex, Group, MantineSize, Paper, SimpleGrid, Skeleton, Stack } from '@mantine/core';

export function AppSkeleton({ height }: { height?: MantineSize }) {
  return (
    <Paper
      style={{
        ...(height ? { height } : {})
      }}
      p={{ base: 'md', sm: 'xl' }}
      className='relative overflow-hidden border border-slate-200/70 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.10)] dark:border-white/10 dark:bg-dark-card dark:shadow-[0_18px_55px_rgba(0,0,0,0.36)]'
    >
      <Stack gap='lg' className='relative z-10'>
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          justify='space-between'
          align={{ base: 'stretch', lg: 'center' }}
          gap='xl'
        >
          <Group gap='md' align='center' wrap='nowrap'>
            <Box className='min-w-0 flex-1'>
              <Group gap='xs' mb={10}>
                <Skeleton h={34} w={220} radius='md' />
                <Skeleton h={24} w={90} radius='xl' />
              </Group>

              <Skeleton h={14} w='100%' />

              <Box mt='md' maw={430}>
                <Group justify='space-between' mb={6}>
                  <Skeleton h={12} w={170} />
                  <Skeleton h={12} w={45} />
                </Group>

                <Skeleton h={10} radius='xl' w='100%' />

                <Skeleton mt={8} h={12} w={180} />
              </Box>
            </Box>
          </Group>

          <Paper
            radius='xl'
            p={{ base: 'md', sm: 'lg' }}
            className='w-full border border-slate-200/70 bg-white/80 shadow-sm dark:border-white/10 dark:bg-white/[0.03] lg:max-w-2xl'
          >
            <SimpleGrid cols={{ base: 1, xs: 3 }} spacing={0}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Box key={index} className='relative px-1 py-4 xs:px-5'>
                  {index !== 0 && (
                    <>
                      <Box className='absolute left-0 top-3 hidden h-[calc(100%-24px)] w-px bg-slate-200/80 dark:bg-white/10 xs:block' />
                      <Box className='absolute left-0 top-0 h-px w-full bg-slate-200/80 dark:bg-white/10 xs:hidden' />
                    </>
                  )}

                  <Skeleton h={12} w={90} mb={12} />

                  <Group mb={10}>
                    <Skeleton h={32} w={70} />
                    <Skeleton h={18} w={45} radius='xl' />
                  </Group>

                  <Stack gap={6}>
                    <Skeleton h={12} w='100%' />
                    <Skeleton h={12} w='85%' />
                  </Stack>
                </Box>
              ))}
            </SimpleGrid>
          </Paper>
        </Flex>

        <Paper radius='lg' p='lg' className='border border-slate-200/70 dark:border-white/10'>
          <Group justify='space-between' align='flex-start'>
            <Box className='flex-1'>
              <Skeleton h={18} w={220} mb={12} />

              <Stack gap={8}>
                <Skeleton h={14} w='100%' />
                <Skeleton h={14} w='92%' />
                <Skeleton h={14} w='80%' />
              </Stack>
            </Box>

            <Skeleton h={38} w={120} radius='xl' />
          </Group>
        </Paper>
      </Stack>
    </Paper>
  );
}
