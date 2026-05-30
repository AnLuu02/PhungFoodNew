import { Badge, Box, Group, Paper, Progress, Stack, Text, Title } from '@mantine/core';

export const ConversionFunnel = () => {
  const steps = [
    { label: 'Truy cập', value: 12840, percent: 100 },
    { label: 'Xem sản phẩm', value: 8420, percent: 66 },
    { label: 'Thêm vào giỏ', value: 4630, percent: 36 },
    { label: 'Checkout', value: 2310, percent: 18 },
    { label: 'Hoàn tất', value: 1486, percent: 12 }
  ];

  return (
    <Paper withBorder radius='xl' p='lg' className='shadow-sm'>
      <Title order={4}>Kênh hành vi</Title>
      <Text size='sm' c='dimmed' mb='lg'>
        Phân tích hành vi khách từ truy cập đến mua hàng
      </Text>

      <Stack gap='md'>
        {steps.map(item => (
          <Box key={item.label}>
            <Group justify='space-between' mb={6}>
              <Text size='sm' fw={600}>
                {item.label}
              </Text>

              <Group gap={8}>
                <Text size='sm' c='dimmed'>
                  {item.value.toLocaleString('vi-VN')}
                </Text>
                <Badge variant='light'>{item.percent}%</Badge>
              </Group>
            </Group>

            <Progress value={item.percent} radius='xl' size='lg' />
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};
