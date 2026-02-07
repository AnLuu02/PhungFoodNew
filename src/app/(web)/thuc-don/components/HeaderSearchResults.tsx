'use client';

import { Flex, Group, Paper, Skeleton, Text, Title } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { ProductFind } from '~/types/client-type-trpc';

export default function HeaderSearchResults({
  products,
  isLoading
}: {
  products: NonNullable<ProductFind>['products'];
  isLoading: boolean;
}) {
  const params = useSearchParams();
  const [historySearch, setHistorySearch] = useLocalStorage<string[]>({ key: 'historySearch', defaultValue: [] });

  useEffect(() => {
    if (!params.get('s')) return;
    const exist = historySearch.find(item => item === decodeURIComponent(params.get('s') as string));
    if (!exist) {
      setHistorySearch((h: any) => [...h, params.get('s')]);
    }
  }, [params]);

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
            {products?.length || 0}
          </Text>
        )}
        <Text c='dimmed' fw={600}>
          Tìm thấy sản phẩm với từ khóa
        </Text>
        {isLoading ? (
          <Skeleton height={16} width='10%' radius='sm' />
        ) : (
          <Text c='dimmed' fw={600}>
            "{params.get('s')}"
          </Text>
        )}
      </Group>
    </Paper>
  );
}
