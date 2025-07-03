'use client';

import { Box, Card, Center, Divider, Flex, Group, Progress, Select, Space, Stack, Text } from '@mantine/core';
import { UserLevel } from '@prisma/client';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import LoadingComponent from '~/components/Loading/Loading';
import { formatPriceLocaleVi } from '~/lib/func-handler/formatPrice';
import { getColorLevelUser, getLevelUser } from '~/lib/func-handler/level-user';
import { api } from '~/trpc/react';

const LazyChart = dynamic(() => import('./UserSpendingChart'), {
  ssr: false
});
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
  const { data: userDb, isLoading: isLoadingUserDb } = api.User.getOne.useQuery({ s: user?.user?.email || '' });
  const { data: revenue, isLoading } = api.Revenue.getTotalSpentInMonthByUser.useQuery({
    userId: user?.user?.id || '',
    year: Number(selectedYear) || 2025
  });

  const { mockSpendingData, totalSpent } = useMemo(() => {
    return {
      mockSpendingData: months.map(item => ({
        ...item,
        amount: revenue?.find((spend: any) => spend.month === months.indexOf(item) + 1)?.totalSpent || 0
      })),
      totalSpent: revenue?.reduce((total, item) => total + Number(item?.totalSpent || 0), 0) || 0
    };
  }, [revenue]);

  const getVIPProgress = (userDb: any) => {
    return (userDb?.pointLevel || 0) * 100;
  };

  if (isLoading || isLoadingUserDb) {
    return <LoadingComponent />;
  }

  return (
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
          <LazyChart data={mockSpendingData} />
        </Box>

        <Flex gap={{ base: 'xs', md: 'md' }} justify={'space-between'} direction={{ base: 'column', md: 'row' }}>
          <Box w={{ base: '100%', md: '50%' }}>
            <Text fw={700} mb='xs'>
              Tỷ lệ hoàn thành đơn hàng
            </Text>
            <Progress value={orderCompletionRate} size='sm' radius='xl' />
            <Text size='sm' c='dimmed' mt='xs'>
              {orderCompletionRate}% đơn đặt hàng của bạn đã được hoàn thành thành công
            </Text>
          </Box>

          <Divider orientation='vertical' size={2} mx={'xl'} />

          <Box w={{ base: '100%', md: '50%' }}>
            <Flex align={'center'} mb='xs' gap={5}>
              <Text fw={700}>Cấp V.I.P:</Text>
              <Text fw={700} c={getColorLevelUser(userDb?.level as UserLevel)}>
                {getLevelUser(userDb?.level as UserLevel)}
              </Text>
            </Flex>
            <Progress value={getVIPProgress(userDb)} size='sm' radius='xl' />
            <Group mt='xs'>
              {vipLevels.map(level => (
                <Text key={level} size='sm' c='dimmed'>
                  {level}
                </Text>
              ))}
            </Group>
          </Box>
        </Flex>
      </Stack>
    </Card>
  );
}
