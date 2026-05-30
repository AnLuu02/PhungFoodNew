'use client';

import { ActionIcon, Badge, Group, Paper, RingProgress, SimpleGrid, Text, Title, Tooltip } from '@mantine/core';
import { IconApi, IconCheck, IconDatabase, IconDownload, IconInfoCircle, IconRefresh } from '@tabler/icons-react';

interface SystemHealth {
  dataFreshness: string;
  lastSync: string;
  apiHealth: number;
  dbHealth: number;
  analyticsProcessingStatus: 'operational' | 'degraded' | 'down';
}

interface MonitoringSectionProps {
  health: SystemHealth;
  loading?: boolean;
  error?: string;
}

export function MonitoringSection({ health, loading, error }: MonitoringSectionProps) {
  if (loading)
    return (
      <Paper p='md' withBorder h={200}>
        <Text>Loading system health...</Text>
      </Paper>
    );
  if (error)
    return (
      <Paper p='md' withBorder>
        <Text c='red'>Error: {error}</Text>
      </Paper>
    );

  const statusColor = (value: number) => {
    if (value >= 99) return 'green';
    if (value >= 95) return 'yellow';
    return 'red';
  };

  const processStatusColor = {
    operational: 'green',
    degraded: 'orange',
    down: 'red'
  };

  return (
    <Paper p='md' withBorder>
      <Group justify='space-between' mb='md'>
        <Group>
          <IconDatabase size={24} />
          <Title order={3}>Giám sát doanh nghiệp</Title>
          <Tooltip label='Trạng thái hệ thống và độ tươi của dữ liệu'>
            <IconInfoCircle size={18} style={{ opacity: 0.6 }} />
          </Tooltip>
        </Group>
        <ActionIcon variant='subtle'>
          <IconDownload size={18} />
        </ActionIcon>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing='md'>
        <Paper withBorder p='sm'>
          <Group gap='xs'>
            <IconRefresh size={16} />
            <Text size='sm' fw={500}>
              Data Freshness
            </Text>
          </Group>
          <Text size='h4'>{health.dataFreshness}</Text>
          <Text size='xs' c='dimmed'>
            Last sync: {new Date(health.lastSync).toLocaleString()}
          </Text>
        </Paper>

        <Paper withBorder p='sm'>
          <Group gap='xs'>
            <IconApi size={16} />
            <Text size='sm' fw={500}>
              API Health
            </Text>
          </Group>
          <RingProgress
            size={60}
            thickness={4}
            sections={[{ value: health.apiHealth, color: statusColor(health.apiHealth) }]}
            label={
              <Text size='sm' ta='center'>
                {health.apiHealth}%
              </Text>
            }
          />
        </Paper>

        <Paper withBorder p='sm'>
          <Group gap='xs'>
            <IconDatabase size={16} />
            <Text size='sm' fw={500}>
              Database Health
            </Text>
          </Group>
          <RingProgress
            size={60}
            thickness={4}
            sections={[{ value: health.dbHealth, color: statusColor(health.dbHealth) }]}
            label={
              <Text size='sm' ta='center'>
                {health.dbHealth}%
              </Text>
            }
          />
        </Paper>

        <Paper withBorder p='sm'>
          <Group gap='xs'>
            <IconCheck size={16} />
            <Text size='sm' fw={500}>
              Analytics Processing
            </Text>
          </Group>
          <Badge size='lg' color={processStatusColor[health.analyticsProcessingStatus]} variant='light'>
            {health.analyticsProcessingStatus}
          </Badge>
        </Paper>
      </SimpleGrid>
    </Paper>
  );
}
