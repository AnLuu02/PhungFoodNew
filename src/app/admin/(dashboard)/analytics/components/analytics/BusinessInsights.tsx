'use client';

import { ActionIcon, Badge, Grid, Group, Paper, Progress, Text, Title, Tooltip } from '@mantine/core';
import { IconBulb, IconDownload, IconInfoCircle, IconTrendingUp } from '@tabler/icons-react';
import { Insight } from '~/shared/types/analysis.types';

interface BusinessInsightsProps {
  insights: Insight[];
  loading?: boolean;
}

const priorityColors = { high: 'red', medium: 'orange', low: 'blue' };
const impactColors = { high: 'red', medium: 'yellow', low: 'gray' };

export function BusinessInsights({ insights, loading }: BusinessInsightsProps) {
  if (loading)
    return (
      <Paper p='md' withBorder>
        <Text>Loading insights...</Text>
      </Paper>
    );

  return (
    <Paper p='md' withBorder>
      <Group justify='space-between' mb='md'>
        <Group>
          <IconBulb size={24} color='#f59e0b' />
          <Title order={3}>Thông tin chi tiết về doanh nghiệp</Title>
          <Tooltip label='AI-driven insights dựa trên phân tích dữ liệu'>
            <IconInfoCircle size={18} style={{ opacity: 0.6, cursor: 'help' }} />
          </Tooltip>
        </Group>
        <ActionIcon variant='subtle'>
          <IconDownload size={18} />
        </ActionIcon>
      </Group>
      <Grid>
        {insights.map(insight => (
          <Grid.Col key={insight.id} span={{ base: 12, md: 6 }}>
            <Paper withBorder p='md' style={{ height: '100%' }}>
              <Group justify='space-between' mb='xs'>
                <Badge color={priorityColors[insight.priority]}>Priority: {insight.priority}</Badge>
                <Badge color={impactColors[insight.impactLevel]}>Impact: {insight.impactLevel}</Badge>
              </Group>
              <Title order={4} size='md' mt='xs'>
                {insight.title}
              </Title>
              <Text size='sm' c='dimmed' mt='xs'>
                {insight.description}
              </Text>
              <Group mt='md' justify='space-between'>
                <Text size='xs' fw={500}>
                  Confidence Score
                </Text>
                <Text size='xs' fw={700}>
                  {insight.confidenceScore}%
                </Text>
              </Group>
              <Progress
                value={insight.confidenceScore}
                size='sm'
                color={insight.confidenceScore > 80 ? 'green' : 'orange'}
                mt={4}
              />
              <Group mt='md' gap='xs'>
                <IconTrendingUp size={16} />
                <Text size='sm' fw={500}>
                  Suggested Action:
                </Text>
                <Text size='sm'>{insight.suggestedAction}</Text>
              </Group>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </Paper>
  );
}
