'use client';
import { Card, Flex, Skeleton, Stack } from '@mantine/core';

const LayoutGridCarouselOnlySkeleton = ({ minHeight }: { minHeight?: string | number }) => {
  return (
    <Card mih={minHeight || 500} className='bg-gray-100 dark:bg-dark-background' p='lg'>
      <Flex direction='column' h='100%' w='100%' gap='md'>
        <Flex align='center' justify='space-between' direction={{ base: 'column', sm: 'row' }}>
          <Skeleton height={30} width='40%' radius='sm' />
          <Flex className='hidden sm:flex' gap='xs'>
            <Skeleton circle w={40} h={40} />
            <Skeleton circle w={40} h={40} />
          </Flex>
        </Flex>

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
    </Card>
  );
};

export default LayoutGridCarouselOnlySkeleton;
