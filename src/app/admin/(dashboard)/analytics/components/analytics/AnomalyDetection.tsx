'use client';

import { ActionIcon, Alert, Badge, Group, Paper, Text, ThemeIcon, Timeline, Title, Tooltip } from '@mantine/core';
import {
  IconAlertOctagon,
  IconAlertTriangle,
  IconDownload,
  IconInfoCircle as IconInfo,
  IconInfoCircle
} from '@tabler/icons-react';
import { Anomaly } from '~/shared/types/analysis.types';

interface AnomalyDetectionProps {
  anomalies: Anomaly[];
  loading?: boolean;
  error?: string;
}

const severityIcons = {
  critical: <IconAlertOctagon size={18} />,
  warning: <IconAlertTriangle size={18} />,
  info: <IconInfo size={18} />
};

const severityColors = {
  critical: 'red',
  warning: 'orange',
  info: 'blue'
};

export function AnomalyDetection({ anomalies, loading, error }: AnomalyDetectionProps) {
  if (loading)
    return (
      <Paper p='md' withBorder h={300}>
        <Text>Checking anomalies...</Text>
      </Paper>
    );
  if (error)
    return (
      <Paper p='md' withBorder>
        <Text c='red'>Error: {error}</Text>
      </Paper>
    );

  return (
    <Paper p='md' withBorder>
      <Group justify='space-between' mb='md'>
        <Group>
          <IconAlertOctagon size={24} color='#EF4444' />
          <Title order={3}>Phát hiện bất thường</Title>
          <Tooltip label='Phát hiện bất thường trong dữ liệu kinh doanh'>
            <IconInfoCircle size={18} style={{ opacity: 0.6 }} />
          </Tooltip>
        </Group>
        <ActionIcon variant='subtle'>
          <IconDownload size={18} />
        </ActionIcon>
      </Group>

      {anomalies.length === 0 ? (
        <Alert color='green' title='No anomalies detected'>
          Hệ thống hoạt động bình thường.
        </Alert>
      ) : (
        <Timeline active={anomalies.length} bulletSize={30} lineWidth={2}>
          {anomalies.map(anomaly => (
            <Timeline.Item
              key={anomaly.id}
              bullet={
                <ThemeIcon color={severityColors[anomaly.severity]} variant='light' radius='xl'>
                  {severityIcons[anomaly.severity]}
                </ThemeIcon>
              }
              title={
                <Group gap='xs'>
                  <Text fw={500}>{anomaly.type}</Text>
                  <Badge color={severityColors[anomaly.severity]}>{anomaly.severity.toUpperCase()}</Badge>
                  {anomaly.timestamp && (
                    <Text size='xs' c='dimmed'>
                      {anomaly.timestamp}
                    </Text>
                  )}
                </Group>
              }
            >
              <Text size='sm' mt='xs'>
                {anomaly.description}
              </Text>
              <Text size='sm' mt='xs' fw={500}>
                Impact: {anomaly.impact}
              </Text>
              <Text size='sm' mt={4} c='blue'>
                Suggested investigation: {anomaly.suggestedInvestigation}
              </Text>
            </Timeline.Item>
          ))}
        </Timeline>
      )}
    </Paper>
  );
}
