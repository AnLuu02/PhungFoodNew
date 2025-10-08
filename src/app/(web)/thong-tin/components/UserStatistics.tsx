'use client';

import { LineChart } from '@mantine/charts';
import {
  Box,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Progress,
  Select,
  Space,
  Stack,
  Text,
  Title,
  Tooltip
} from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import { getInfoLevelUser } from '~/constants';
import { formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { LocalUserLevel } from '~/lib/zod/EnumType';
import { api } from '~/trpc/react';

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
export function UserStatistics() {
  const [selectedYear, setSelectedYear] = useState('2025');
  const { data: user } = useSession();
  const { data: userDb } = api.User.getOne.useQuery({ s: user?.user?.email || '' }, { enabled: !!user?.user?.email });
  const { data: revenue } = api.Revenue.getTotalSpentInMonthByUser.useQuery(
    {
      userId: user?.user?.id || '',
      year: Number(selectedYear) || 2025
    },
    { enabled: !!user?.user?.id }
  );

  const { mockSpendingData, totalSpent } = useMemo(() => {
    return {
      mockSpendingData: months.map(item => ({
        ...item,
        amount: revenue?.find((spend: any) => spend.month === months.indexOf(item) + 1)?.totalSpent || 0
      })),
      totalSpent: revenue?.reduce((sum, item) => sum + Number(item?.totalSpent || 0), 0) || 0
    };
  }, [revenue]);

  const levelInfo = useMemo(() => {
    return getInfoLevelUser(userDb?.level as LocalUserLevel);
  }, [userDb]);

  return (
    <Stack>
      <Flex className='sm:items-center' gap={'md'} justify={'space-between'} direction={{ base: 'column', sm: 'row' }}>
        <Box w={{ base: '100%', sm: '50%' }}>
          <Title order={2} className='font-quicksand'>
            Thống kê chi tiêu
          </Title>
          <Text size='sm' c={'dimmed'}>
            Theo dõi và phân tích các khoản chi tiêu của bạn theo thời gian
          </Text>
        </Box>
        <Button className='rounded-md bg-mainColor hover:bg-mainColor/90'>Chi tiết các đơn hàng</Button>
      </Flex>

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
                data={Object.keys({
                  '2025': 3280,
                  '2024': 2800,
                  '2023': 2500
                }).map(year => ({ value: year, label: year }))}
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
              <LineChart
                data={mockSpendingData}
                dataKey='month'
                series={[{ name: 'amount', label: 'Chi tiêu', color: '#8884d8' }]}
                curveType='linear'
                gridAxis='xy'
                tickLine='xy'
                withTooltip
                h={200}
              />
            </Box>
          </Box>

          <Flex
            gap={{ base: 'xs', md: 'md' }}
            mt={'md'}
            justify={'space-between'}
            direction={{ base: 'column', md: 'row' }}
          >
            <Box w={{ base: '100%', md: '50%' }} className='space-y-3'>
              <Text fw={700}>Tỷ lệ hoàn thành đơn hàng</Text>
              <Progress value={orderCompletionRate} size='md' radius='xl' />
              <Text size='sm' c='dimmed'>
                {orderCompletionRate}% đơn đặt hàng của bạn đã được hoàn thành thành công
              </Text>
            </Box>

            <Divider orientation='vertical' size={2} mx={'xl'} />

            <Box w={{ base: '100%', md: '50%' }} className='space-y-3'>
              <Box className='flex items-center justify-between text-sm'>
                <Text fw={700}>
                  Tiến độ lên hạng
                  <i> {getInfoLevelUser(levelInfo.nextLevel).viName}</i>
                </Text>
                <span className='font-medium text-gray-900 dark:text-white'>
                  {userDb?.pointUser || 0 / levelInfo.maxPoint} điểm
                </span>
              </Box>
              <Tooltip label={`${userDb?.pointUser || 0} điểm`}>
                <Progress
                  value={((userDb?.pointUser || 0) / (levelInfo.maxPoint + 1)) * 100}
                  color={levelInfo.color}
                  size='md'
                  radius='xl'
                />
              </Tooltip>
              <Box className='flex items-center justify-between text-xs'>
                <Text size='xs' c='dimmed'>
                  {levelInfo.viName} - ({userDb?.pointUser || 0} điểm)
                </Text>
                <Text size='xs' c={'dimmed'}>
                  Cần thêm {levelInfo.maxPoint + 1 - (userDb?.pointUser || 0)} điểm để lên{' '}
                  {getInfoLevelUser(levelInfo.nextLevel as LocalUserLevel).viName}
                </Text>
              </Box>
            </Box>
          </Flex>
        </Stack>
      </Card>
    </Stack>
  );
}
