'use client';
import { Flex, Group, Paper, Skeleton, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';

export default function HeaderSearchResults({ s, totalProducts, isLoading }: any) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return s ? (
    <Paper className='bg-gray-100 dark:bg-dark-card' mb='lg' p={'md'}>
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
          <Skeleton height={16} width='20px' />
        ) : (
          <Text c='dimmed' fw={600}>
            {totalProducts || 0}
          </Text>
        )}
        <Text c='dimmed' fw={600}>
          sản phẩm với từ khóa
        </Text>
        {isLoading ? (
          <Skeleton height={16} width='10%' />
        ) : (
          <Text c='dimmed' fw={600} className='italic'>
            "{s}"
          </Text>
        )}
      </Group>
    </Paper>
  ) : null;
}
