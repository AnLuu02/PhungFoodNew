'use client';

import { Flex, Group, Paper, Skeleton, Text, Title } from '@mantine/core';
import { useSearchParams } from 'next/navigation';

export default function HeaderSearchResults({ totalProducts, isLoading }: any) {
  const params = useSearchParams();
  return (
    <Paper className='bg-gray-100 dark:bg-dark-card' mb='lg' p={'md'} radius={'lg'}>
      <Group mb='xs'>
        <Flex align='center' justify='center' w={24} h={24} style={{ borderRadius: '50%' }} bg='blue'>
          <Text c='white' size='sm'>
            ✓
          </Text>
        </Flex>
        <Title className='font-quicksand' order={4}>
          Sản phẩm
        </Title>
      </Group>
      <Group align='center' gap={4} p={0} m={0}>
        <Text c='dimmed' fw={600}>
          Tìm thấy
        </Text>
        {isLoading ? (
          <Skeleton height={16} width='10px' radius='sm' />
        ) : (
          <Text c='dimmed' fw={600}>
            {totalProducts || 0}
          </Text>
        )}
        <Text c='dimmed' fw={600}>
          sản phẩm với từ khóa
        </Text>
        {isLoading ? (
          <Skeleton height={16} width='10%' radius='sm' />
        ) : (
          <Text c='dimmed' fw={600} className='italic'>
            "{params.get('s')}"
          </Text>
        )}
      </Group>
    </Paper>
  );
}
