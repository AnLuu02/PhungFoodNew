'use client';

import { Flex, Group, Paper, Text, Title } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function HeaderSearchResults({ products }: any) {
  const params = useSearchParams();
  const [historySearch, setHistorySearch] = useLocalStorage<any>({ key: 'historySearch', defaultValue: [] });

  useEffect(() => {
    if (!params.get('s')) return;
    const exist = historySearch.find((item: any) => item === decodeURIComponent(params.get('s') as string));
    if (!exist) {
      setHistorySearch((h: any) => [...h, params.get('s')]);
    }
  }, [params]);

  return (
    <Paper bg={'gray.1'} mb='lg' p={'md'} radius={'lg'}>
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
      <Text c='dimmed'>
        Tìm thấy{' '}
        <Text span fw={500}>
          {products?.length || 0}
        </Text>{' '}
        sản phẩm với từ khóa "
        <Text span fw={500}>
          {params.get('s')}
        </Text>
        "
      </Text>
    </Paper>
  );
}
