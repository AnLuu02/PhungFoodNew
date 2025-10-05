'use client';
import { Flex, Text } from '@mantine/core';
import { IconMinus, IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';

interface Props {
  currentValue: number;
  previousValue: number;
  changeRate: number | null;
}

export function ChangeRate({ currentValue, previousValue, changeRate }: Props) {
  if (currentValue === 0 && previousValue === 0) {
    return (
      <Text size='sm' c='dimmed' fw={500}>
        Chưa có dữ liệu
      </Text>
    );
  }

  if (previousValue === 0) {
    return (
      <Text size='sm' c='blue' fw={600}>
        Tất cả số liệu
      </Text>
    );
  }

  if (changeRate === null) {
    return (
      <Text size='sm' c='dimmed' fw={500}>
        Tổng: {currentValue.toLocaleString()}
      </Text>
    );
  }

  return (
    <Flex align='center' gap='xs'>
      {changeRate > 0 ? (
        <IconTrendingUp size={16} color='green' />
      ) : changeRate < 0 ? (
        <IconTrendingDown size={16} color='red' />
      ) : (
        <IconMinus size={16} color='gray' />
      )}
      <Text size='sm' fw={700} c={changeRate > 0 ? 'green' : changeRate < 0 ? 'red' : 'gray'}>
        {changeRate > 0 ? '+' : ''}
        {changeRate.toFixed(2)}%
      </Text>
      <Text size='sm'>so với kỳ trước</Text>
    </Flex>
  );
}
