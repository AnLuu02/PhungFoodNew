'use client';

import { Badge, Box, Button, Group, Paper, RingProgress, Stack, Text, Title } from '@mantine/core';
import { IconEye, IconRobot, IconSparkles } from '@tabler/icons-react';
export const AIInsightHero = ({
  onOpenRecommendations,
  onOpenRawData
}: {
  onOpenRecommendations: () => void;
  onOpenRawData: () => void;
}) => {
  return (
    <Paper
      radius='xl'
      p='xl'
      className='light:bg-gradient-to-br light:from-blue-50 light:via-white light:to-indigo-50 relative overflow-hidden border border-blue-200 shadow-sm dark:bg-dark-card'
    >
      <Box className='absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl' />

      <Group justify='space-between' align='flex-start'>
        <Stack gap='md' maw={760}>
          <Badge size='lg' radius='xl' variant='light' color='blue' leftSection={<IconSparkles size={14} />}>
            AI Analytics Insight
          </Badge>

          <Title order={1} className='font-quicksand'>
            Doanh thu trưa nay đang tăng bất thường
          </Title>

          <Text c='dimmed' size='md'>
            Hệ thống phát hiện lượng đơn trong khung 11:00 - 13:00 tăng 34%, chủ yếu đến từ Combo Gia Đình và Cơm gà sốt
            tiêu. Nên ưu tiên hiển thị 2 sản phẩm này ở homepage trong 3 giờ tới.
          </Text>

          <Group>
            <Button leftSection={<IconRobot size={18} />} onClick={onOpenRecommendations}>
              Xem đề xuất hành động
            </Button>

            <Button variant='default' leftSection={<IconEye size={18} />} onClick={onOpenRawData}>
              Xem dữ liệu gốc
            </Button>
          </Group>
        </Stack>

        <RingProgress
          size={160}
          thickness={16}
          roundCaps
          sections={[{ value: 84, color: 'blue' }]}
          label={
            <Stack gap={0} align='center'>
              <Title order={2}>84%</Title>
              <Text size='xs' c='dimmed'>
                Confidence
              </Text>
            </Stack>
          }
        />
      </Group>
    </Paper>
  );
};
