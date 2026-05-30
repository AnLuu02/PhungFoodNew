'use client';

import { Box, Group, Paper, Text, ThemeIcon, Title } from '@mantine/core';
import { IconClockHour4 } from '@tabler/icons-react';
const heatmap = [
  [12, 24, 31, 44, 62, 88],
  [18, 28, 35, 51, 79, 91],
  [22, 32, 48, 66, 84, 96],
  [16, 26, 41, 57, 72, 89],
  [14, 21, 37, 53, 69, 81],
  [20, 34, 52, 74, 92, 98],
  [25, 39, 58, 80, 94, 100]
];
export const PeakHourHeatmap = () => {
  const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const hours = ['8h', '10h', '12h', '14h', '16h', '18h'];

  return (
    <Paper withBorder radius='xl' p='lg' className='shadow-sm'>
      <Group justify='space-between' mb='md'>
        <Box>
          <Title order={4}>Heatmap giờ cao điểm</Title>
          <Text size='sm' c='dimmed'>
            Mật độ đơn hàng theo ngày và khung giờ
          </Text>
        </Box>

        <ThemeIcon radius='xl' color='orange' variant='light'>
          <IconClockHour4 size={20} />
        </ThemeIcon>
      </Group>

      <Box className='grid grid-cols-[40px_repeat(6,1fr)] gap-2'>
        <Box />

        {hours.map(hour => (
          <Text key={hour} size='xs' c='dimmed' ta='center'>
            {hour}
          </Text>
        ))}

        {heatmap.map((row, rowIndex) => (
          <>
            <Text key={days[rowIndex]} size='xs' c='dimmed' pt={8}>
              {days[rowIndex]}
            </Text>

            {row.map((value, colIndex) => (
              <Box
                key={`${rowIndex}-${colIndex}`}
                className='flex h-10 items-center justify-center rounded-lg text-xs font-semibold text-white'
                style={{
                  backgroundColor: `rgba(25, 94, 254, ${Math.max(value / 100, 0.18)})`
                }}
              >
                {value}
              </Box>
            ))}
          </>
        ))}
      </Box>
    </Paper>
  );
};
