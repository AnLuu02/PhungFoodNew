'use client';

import { Box, Card, Center, Flex, Group, Progress, Select, Space, Stack, Text } from '@mantine/core';
import { UserLevel } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import LoadingComponent from '~/app/_components/Loading/Loading';
import { formatPriceLocaleVi } from '~/app/lib/utils/func-handler/formatPrice';
import { getLevelUser } from '~/app/lib/utils/func-handler/get-level-user';
import { api } from '~/trpc/react';

const mockYearlySpending = {
  '2025': 3280,
  '2024': 2800,
  '2023': 2500
};
const months = [
  { month: 'Tháng 1', amount: 0 },
  { month: 'Tháng 2', amount: 0 },
  { month: 'Tháng 3', amount: 0 },
  { month: 'Tháng 4', amount: 0 },
  { month: 'Tháng 5', amount: 0 },
  { month: 'Tháng 6', amount: 0 },
  { month: 'Tháng 7', amount: 0 },
  { month: 'Tháng 8', amount: 0 },
  { month: 'Tháng 9', amount: 0 },
  { month: 'Tháng 10', amount: 0 },
  { month: 'Tháng 11', amount: 0 },
  { month: 'Tháng 12', amount: 0 }
];
export const orderCompletionRate = 85;

export const vipLevels = ['Đồng', 'Bạc', 'Vàng', 'Bạch kim', 'Kim cương'];
export const userVIPLevel = 'Vàng';

export default function UserStatistics() {
  const [selectedYear, setSelectedYear] = useState('2025');
  const { data: user } = useSession();
  const { data: userDb, isLoading: isLoadingUserDb } = api.User.getOne.useQuery({ query: user?.user?.email || '' });
  const { data: revenue, isLoading } = api.Revenue.getTotalSpentInMonthByUser.useQuery({
    userId: user?.user?.id || '',
    year: Number(selectedYear) || 2025
  });

  const mockSpendingData = months.map(item => ({
    ...item,
    amount: revenue?.find((spend: any) => spend.month === months.indexOf(item) + 1)?.totalSpent || 0
  }));

  const getVIPProgress = (userDb: any) => {
    return (userDb?.pointLevel || 0) * 100;
  };
  const totalSpent = revenue?.reduce((total, item) => total + Number(item?.totalSpent || 0), 0) || 0;

  return isLoading ? (
    <LoadingComponent />
  ) : (
    <Card shadow='sm' padding='lg' radius='md' withBorder>
      <Stack gap='md'>
        <Box>
          <Text fw={700} mb='xs' size='xl'>
            Tổng quan chi tiêu
          </Text>
          <Flex align={'center'} justify={'space-between'} mb='xl'>
            <Select
              value={selectedYear}
              onChange={value => setSelectedYear(value || '2023')}
              data={Object.keys(mockYearlySpending).map(year => ({ value: year, label: year }))}
              style={{ width: 120 }}
            />
            <Text size='xl' fw={700}>
              <Center>
                Đã chi:
                <Space w={'xs'} />
                <b className='text-red-500'>{formatPriceLocaleVi(totalSpent)}</b>
              </Center>
            </Text>
          </Flex>
          <Box style={{ height: 200 }}>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={mockSpendingData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis dataKey={'amount'} />
                <Tooltip />
                <Line type='monotone' dataKey='amount' stroke='#8884d8' />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box>
          <Text fw={700} mb='xs'>
            Tỷ lệ hoàn thành đơn hàng
          </Text>
          <Progress value={orderCompletionRate} size='xl' radius='xl' />
          <Text size='sm' color='dimmed' mt='xs'>
            {orderCompletionRate}% đơn đặt hàng của bạn đã được hoàn thành thành công
          </Text>
        </Box>

        <Box>
          <Text fw={700} mb='xs'>
            Cấp V.I.P: {getLevelUser(userDb?.level as UserLevel)}
          </Text>
          <Progress value={getVIPProgress(userDb)} size='xl' radius='xl' />
          <Group mt='xs'>
            {vipLevels.map(level => (
              <Text key={level} size='sm' color='dimmed'>
                {level}
              </Text>
            ))}
          </Group>
        </Box>
      </Stack>
    </Card>
  );
}
