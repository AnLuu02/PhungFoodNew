'use client';

import { ActionIcon, Badge, Box, Group, Paper, SimpleGrid, Table, Text, Title, Tooltip } from '@mantine/core';
import { IconDownload, IconInfoCircle, IconPackage, IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import {
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis
} from 'recharts';
import { MenuEngineeringItem, ProductPerformance } from '~/shared/types/analysis.types';

interface ProductAnalyticsProps {
  topProducts: ProductPerformance[];
  menuMatrix: MenuEngineeringItem[];
  loading?: boolean;
  error?: string;
}

const quadrantColors = {
  stars: '#10B981',
  cashCows: '#3B82F6',
  puzzles: '#F59E0B',
  dogs: '#EF4444'
};

export function ProductAnalytics({ topProducts, menuMatrix, loading, error }: ProductAnalyticsProps) {
  if (loading)
    return (
      <Paper p='md' withBorder h={400}>
        <Text>Loading product analytics...</Text>
      </Paper>
    );
  if (error)
    return (
      <Paper p='md' withBorder>
        <Text c='red'>Error: {error}</Text>
      </Paper>
    );

  const matrixData = menuMatrix.map(m => ({
    name: m.name,
    popularity: m.popularity,
    profitability: m.profitability,
    quadrant: m.quadrant
  }));

  return (
    <Paper p='md' withBorder>
      <Group justify='space-between' mb='md'>
        <Group>
          <IconPackage size={24} />
          <Title order={3}>Hiệu suất sản phẩm</Title>
          <Tooltip label='Hiệu suất sản phẩm và ma trận Menu Engineering'>
            <IconInfoCircle size={18} style={{ opacity: 0.6 }} />
          </Tooltip>
        </Group>
        <ActionIcon variant='subtle'>
          <IconDownload size={18} />
        </ActionIcon>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing='lg'>
        <Box>
          <Text fw={500} mb='xs'>
            Top Selling Products
          </Text>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Product</Table.Th>
                <Table.Th>Revenue</Table.Th>
                <Table.Th>Growth</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {topProducts.slice(0, 5).map(p => (
                <Table.Tr key={p.name}>
                  <Table.Td>{p.name}</Table.Td>
                  <Table.Td>${p.revenue.toLocaleString()}</Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      {p.growth > 0 ? (
                        <IconTrendingUp size={14} color='green' />
                      ) : (
                        <IconTrendingDown size={14} color='red' />
                      )}
                      <Text size='sm' c={p.growth > 0 ? 'green' : 'red'}>
                        {Math.abs(p.growth)}%
                      </Text>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Box>

        <Box>
          <Text fw={500} mb='xs'>
            Menu Engineering Matrix
          </Text>
          <ResponsiveContainer width='100%' height={250}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis type='number' dataKey='popularity' name='Popularity' unit='%' domain={[0, 100]} />
              <YAxis type='number' dataKey='profitability' name='Profitability' unit='%' domain={[0, 100]} />
              <ZAxis type='category' dataKey='name' range={[100, 100]} />
              <RechartsTooltip
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value, name, props) => [
                  `${value}%`,
                  name === 'popularity' ? 'Popularity' : 'Profitability'
                ]}
              />
              <Scatter data={matrixData} fill='#8884d8' shape='circle'>
                {matrixData.map((entry, idx) => (
                  <circle
                    key={idx}
                    cx={entry.popularity}
                    cy={entry.profitability}
                    r={8}
                    fill={quadrantColors[entry.quadrant]}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <SimpleGrid cols={2} spacing='xs' mt='sm'>
            <Group gap={4}>
              <Badge color='green' size='sm' /> <Text size='xs'>Stars</Text>
            </Group>
            <Group gap={4}>
              <Badge color='blue' size='sm' /> <Text size='xs'>Cash Cows</Text>
            </Group>
            <Group gap={4}>
              <Badge color='yellow' size='sm' /> <Text size='xs'>Puzzles</Text>
            </Group>
            <Group gap={4}>
              <Badge color='red' size='sm' /> <Text size='xs'>Dogs</Text>
            </Group>
          </SimpleGrid>
        </Box>
      </SimpleGrid>
    </Paper>
  );
}
