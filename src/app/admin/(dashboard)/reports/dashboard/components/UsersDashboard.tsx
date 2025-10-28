'use client';
import { BarChart } from '@mantine/charts';
import { ActionIcon, Box, Card, Flex, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconBrandCashapp, IconCheese, IconShoppingCart, IconUser, IconUserPlus } from '@tabler/icons-react';
import { useMemo } from 'react';
import { formatDateViVN, formatMoneyShort } from '~/lib/FuncHandler/Format';
export function UsersDashboard({ dataClient, period, startTimeToNum, endTimeToNum, dataOverviewChart }: any) {
  const dataRevenue = useMemo(() => {
    return [
      {
        label: 'Tổng doanh thu',
        currentValue: dataClient?.totalFinalRevenue?.currentValue || 0,
        previousValue: dataClient?.totalFinalRevenue?.previousValue || 0,
        changeRate: dataClient?.totalFinalRevenue?.changeRate || 0,
        icon: IconBrandCashapp,
        color: '#4ED07E'
      },
      {
        label: 'Tổng người dùng',
        currentValue: dataClient?.totalUsers?.currentValue || 0,
        previousValue: dataClient?.totalUsers?.previousValue || 0,
        icon: IconUser,
        changeRate: dataClient?.totalUsers?.changeRate || 0,
        color: '#4B6CB3'
      },
      {
        label: 'Tổng đơn hàng',
        currentValue: dataClient?.totalOrders?.currentValue || 0,
        previousValue: dataClient?.totalOrders?.previousValue || 0,
        changeRate: dataClient?.totalOrders?.changeRate || 0,
        icon: IconShoppingCart,
        color: '#8547BB'
      },
      {
        label: 'Tổng sản phẩm',
        currentValue: dataClient?.totalProducts?.currentValue || 0,
        previousValue: dataClient?.totalProducts?.previousValue || 0,
        changeRate: dataClient?.totalProducts?.changeRate || 0,
        icon: IconCheese,
        color: '#CB7E56'
      }
    ];
  }, [dataClient]);
  return (
    <>
      <Stack>
        <Card withBorder shadow='sm' radius={'lg'}>
          <Flex align={'center'} justify={'space-between'} mb={'xl'}>
            <Box>
              <Title order={5} className='font-quicksand'>
                Người dùng mới
              </Title>
              <Text size='sm' c={'dimmed'}>
                Số lượng người dùng đăng kí mới{' '}
                <b>
                  {period >= 0
                    ? !period
                      ? 'hôm nay'
                      : `từ ${formatDateViVN(startTimeToNum)} đến ${formatDateViVN(endTimeToNum)}`
                    : ' kể từ đơn hàng đầu tiên'}
                </b>
              </Text>
            </Box>
            <ActionIcon variant='light' size={'lg'}>
              <IconUserPlus size={16} />
            </ActionIcon>
          </Flex>
          <BarChart
            h={300}
            data={dataOverviewChart.users}
            dataKey='label'
            type='stacked'
            series={[{ name: 'users', label: 'Người dùng mới', color: 'violet.6' }]}
            gridAxis='xy'
          />
        </Card>
        <SimpleGrid cols={4}>
          {dataRevenue.map((item: any, index: number) => {
            const IconR = item.icon;
            return (
              <Card key={index} radius={'md'} withBorder shadow='md' style={{ backgroundColor: item.color }}>
                <Stack gap={'xs'}>
                  <Flex align={'center'} justify={'space-between'}>
                    <Box>
                      <Text size='sm' fw={700} c={'dimmed'}>
                        {item.label}
                      </Text>
                      <Title className='font-quicksand' order={3}>
                        {formatMoneyShort(item.currentValue)}
                      </Title>
                    </Box>
                    <Paper
                      w={40}
                      h={40}
                      withBorder
                      className='flex items-center justify-center'
                      style={{
                        backgroundColor: item.color + '22'
                      }}
                      radius={'md'}
                    >
                      <IconR size={16} color={item.color} />
                    </Paper>
                  </Flex>
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>
      </Stack>
    </>
  );
}
