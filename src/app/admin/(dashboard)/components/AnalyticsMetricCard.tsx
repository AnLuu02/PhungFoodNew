'use client';

import { Sparkline } from '@mantine/charts';
import { Box, Flex, Group, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconMinus, IconTrendingDown3, IconTrendingUp3 } from '@tabler/icons-react';
import { ChangeRateObj } from '~/shared/types';
export const AnalyticsMetricCard = ({
  title,
  value,
  descObj,
  icon,
  color,
  currentSparkline,
  previousSparkline
}: {
  title: string;
  value: string;
  descObj: ChangeRateObj;
  icon: React.ReactNode;
  color: string;
  currentSparkline: number[];
  previousSparkline: number[];
}) => {
  return (
    <Paper withBorder radius='xl' p='lg' className='relative overflow-hidden shadow-sm'>
      <Box
        className='absolute right-0 top-0 h-24 w-24 rounded-bl-full'
        style={{
          backgroundColor: color,
          opacity: 0.04
        }}
      />

      <Group justify='space-between' align='flex-start'>
        <Stack gap={6}>
          <Text size='sm' c='dimmed'>
            {title}
          </Text>

          <Title order={2}>{value}</Title>

          <Flex align={'center'} gap={'sm'}>
            {descObj.value !== 0 ? (
              descObj.isIncrease ? (
                <IconTrendingUp3 color={descObj.color} size={20} />
              ) : (
                <IconTrendingDown3 color={descObj.color} size={20} />
              )
            ) : (
              <IconMinus color={'gray'} size={20} />
            )}

            <Text size='sm' c={descObj.color}>
              {descObj.message}
            </Text>
          </Flex>
        </Stack>
      </Group>

      <ThemeIcon size={46} radius='xl' color={color} variant='transparent' className='absolute right-3 top-3'>
        {icon}
      </ThemeIcon>

      <Box mt='md'>
        <Box className='relative h-[50px]'>
          <Sparkline
            h={50}
            data={previousSparkline}
            curveType='natural'
            color='gray'
            fillOpacity={0.04}
            strokeWidth={1.5}
            className='absolute inset-0 opacity-70'
          />

          <Sparkline
            h={50}
            data={currentSparkline}
            curveType='natural'
            color={color}
            fillOpacity={0.15}
            strokeWidth={2.5}
            className='absolute inset-0'
          />
        </Box>

        <Group mt='xs' gap='lg'>
          <Group gap={6}>
            <Box w={10} h={10} className='rounded-full' style={{ backgroundColor: color }} />

            <Text size='xs' c='dimmed'>
              Kỳ hiện tại
            </Text>
          </Group>

          <Group gap={6}>
            <Box w={10} h={10} className='rounded-full bg-gray-400' />

            <Text size='xs' c='dimmed'>
              Kỳ trước
            </Text>
          </Group>
        </Group>
      </Box>
    </Paper>
  );
};
