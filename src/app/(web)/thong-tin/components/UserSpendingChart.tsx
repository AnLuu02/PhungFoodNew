'use client';
import { LineChart } from '@mantine/charts';
import { Box } from '@mantine/core';
export default function UserSpendingChart({ data }: any) {
  return (
    <Box style={{ height: 200 }}>
      <LineChart
        data={data}
        dataKey='month'
        series={[{ name: 'amount', label: 'Chi tiêu', color: '#8884d8' }]}
        curveType='linear'
        gridAxis='xy'
        tickLine='xy'
        withTooltip
        h={200}
      />
    </Box>
  );
}
