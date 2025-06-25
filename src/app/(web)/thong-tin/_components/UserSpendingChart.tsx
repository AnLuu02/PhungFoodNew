import { Box } from '@mantine/core';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function UserSpendingChart({ data }: any) {
  return (
    <Box style={{ height: 200 }}>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='month' />
          <YAxis dataKey='amount' />
          <Tooltip />
          <Line type='monotone' dataKey='amount' stroke='#8884d8' />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
