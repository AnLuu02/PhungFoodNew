import { Center, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconChartPieOff } from '@tabler/icons-react';

export const EmptyChart = () => {
  return (
    <Center h={220}>
      <Stack align='center' gap={8}>
        <ThemeIcon size={56} radius='xl' variant='light' color='gray'>
          <IconChartPieOff size={28} />
        </ThemeIcon>

        <div className='text-center'>
          <Text fw={500}>Chưa có dữ liệu</Text>
          <Text size='sm' c='dimmed'>
            Dữ liệu biểu đồ sẽ hiển thị sau khi phát sinh giao dịch
          </Text>
        </div>
      </Stack>
    </Center>
  );
};
