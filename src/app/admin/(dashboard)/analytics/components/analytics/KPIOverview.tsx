'use client';

import { Badge, Grid, Group, Tooltip as MantineTooltip, Paper, Text, ThemeIcon } from '@mantine/core';
import { IconInfoCircle, IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { Area, AreaChart, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { KPI } from '~/shared/types/analysis.types';

const iconMap: Record<string, any> = {
  CurrencyDollar: require('@tabler/icons-react').IconCurrencyDollar,
  ChartBar: require('@tabler/icons-react').IconChartBar,
  ShoppingBag: require('@tabler/icons-react').IconShoppingBag,
  Receipt: require('@tabler/icons-react').IconReceipt,
  Users: require('@tabler/icons-react').IconUsers,
  UserPlus: require('@tabler/icons-react').IconUserPlus,
  UserCheck: require('@tabler/icons-react').IconUserCheck,
  TrendingUp: require('@tabler/icons-react').IconTrendingUp
};

interface KPIOverviewProps {
  data: KPI[];
  loading?: boolean;
}

export function KPIOverview({ data, loading }: KPIOverviewProps) {
  const formatValue = (value: number, unit: string) => {
    if (unit === 'currency')
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    if (unit === 'percent') return `${value.toFixed(1)}%`;
    if (unit === 'number') return value.toLocaleString();
    return value.toString();
  };

  if (loading) {
    return (
      <Grid>
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <Grid.Col key={i} span={{ base: 12, sm: 6, md: 3 }}>
            <Paper p='md' withBorder h={140} />
          </Grid.Col>
        ))}
      </Grid>
    );
  }

  return (
    <Grid>
      {data.map(kpi => {
        const IconComponent = iconMap[kpi.icon] || require('@tabler/icons-react').IconReport;
        const percentChange = kpi.previousValue ? ((kpi.value - kpi.previousValue) / kpi.previousValue) * 100 : 0;
        const isPositive = percentChange >= 0;

        return (
          <Grid.Col key={kpi.id} span={{ base: 12, sm: 6, md: 3 }}>
            <Paper withBorder p='md' style={{ transition: 'all 0.2s', height: '100%' }}>
              <Group justify='space-between' mb='xs'>
                <Group gap='xs'>
                  <ThemeIcon variant='light' color={kpi.statusColor} size='lg'>
                    <IconComponent size={20} />
                  </ThemeIcon>
                  <Text size='sm' c='dimmed' fw={500}>
                    {kpi.title}
                  </Text>
                  <MantineTooltip label='Compared to previous period'>
                    <IconInfoCircle size={14} style={{ cursor: 'help', opacity: 0.6 }} />
                  </MantineTooltip>
                </Group>
                <Badge color={isPositive ? 'teal' : 'red'} variant='light'>
                  {isPositive ? '+' : ''}
                  {percentChange.toFixed(1)}%
                </Badge>
              </Group>
              <Text size='h2' fw={700} lh={1.2}>
                {formatValue(kpi.value, kpi.unit)}
              </Text>
              <Group gap='xs' mt='xs'>
                {kpi.trend === 'up' ? (
                  <IconTrendingUp size={16} color='green' />
                ) : (
                  <IconTrendingDown size={16} color='red' />
                )}
                <Text size='xs' c='dimmed'>
                  so với kỳ trước
                </Text>
              </Group>
              {kpi.sparklineData.length > 0 && (
                <div style={{ height: 40, marginTop: 12 }}>
                  <ResponsiveContainer width='100%' height='100%'>
                    <AreaChart data={kpi.sparklineData.map((v, i) => ({ idx: i, value: v }))}>
                      <Area
                        type='monotone'
                        dataKey='value'
                        stroke={kpi.statusColor === 'green' ? '#22c55e' : '#3b82f6'}
                        fill={`url(#sparkline-${kpi.id})`}
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient id={`sparkline-${kpi.id}`} x1='0' y1='0' x2='0' y2='1'>
                          <stop
                            offset='0%'
                            stopColor={kpi.statusColor === 'green' ? '#22c55e' : '#3b82f6'}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset='100%'
                            stopColor={kpi.statusColor === 'green' ? '#22c55e' : '#3b82f6'}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <RechartsTooltip />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Paper>
          </Grid.Col>
        );
      })}
    </Grid>
  );
}
