'use client';

import { Box, Flex, Paper, Text, Title } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { useMemo } from 'react';
import { OpeningTabItems } from '../Items/OpeningTabItems';
export function OpeningHourTab({ openingHours }: { openingHours: any }) {
  const hours = useMemo(() => {
    return openingHours?.sort((item1: any, item2: any) => item1?.dayOfWeek - item2?.dayOfWeek) || [];
  }, [openingHours]);
  return (
    <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
      <Flex align={'center'} justify={'space-between'}>
        <Box mb={'xl'}>
          <Title order={4} className='flex items-center gap-2 font-quicksand'>
            <IconClock className='h-5 w-5' />
            Giờ hoạt động
          </Title>
          <Text fw={600} size={'sm'} c={'dimmed'}>
            Đặt thời gian mở và đóng cửa của nhà hàng của bạn cho mỗi ngày
          </Text>
        </Box>
      </Flex>
      <Box className='space-y-4'>
        {hours.map((item: any, index: number) => (
          <OpeningTabItems key={index} item={item} index={index} />
        ))}
      </Box>
    </Paper>
  );
}
