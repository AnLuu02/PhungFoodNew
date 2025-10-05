'use client';

import { BarChart, LineChart } from '@mantine/charts';
import { ActionIcon, Badge, Box, Card, Flex, SimpleGrid, Table, Text, Title } from '@mantine/core';
import { IconRotateClockwise, IconUserPlus } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { formatDateViVN, formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { getStatusInfo } from '~/lib/func-handler/status-order';
import { LocalOrderStatus } from '~/lib/zod/EnumType';
export default function ReportOverviewPageClient({ overviews }: any) {
  const revenues = overviews.revenues || [];
  const searchParams = useSearchParams();
  const startTime = searchParams.get('startTime');
  const endTime = searchParams.get('endTime');
  const startTimeToNum = startTime
    ? Number(startTime)
    : revenues?.[0]?.createdAt
      ? new Date(revenues?.[0]?.createdAt).getTime()
      : -1;
  const endTimeToNum = endTime ? Number(endTime) : revenues?.[0]?.createdAt ? new Date().getTime() : -2;
  const period = (endTimeToNum - startTimeToNum) / (24 * 60 * 60 * 1000);

  const dataOverviewChart = useMemo(() => {
    const periodValue = period > 0 ? period : 1;
    const labels = Array.from({ length: periodValue || 1 }, (_, i) => {
      const currentDate = new Date(endTimeToNum - (periodValue !== 1 ? (periodValue - i) * 24 * 60 * 60 * 1000 : 0));
      return `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    });

    const summaryRevenue: Record<string, number> = {};
    const summaryUsers: Record<string, number> = {};
    labels.forEach(label => {
      summaryRevenue[label] = 0;
      summaryUsers[label] = 0;
    });

    revenues.forEach((revenue: any) => {
      const day = +revenue.day;
      const month = +revenue.month;
      const year = +revenue.year;
      const key = `${day}/${month}/${year}`;
      if (labels.includes(key)) {
        summaryRevenue[key]! += Number(revenue.totalSpent);
      }
    });

    const users = overviews.users || [];
    users.forEach((user: any) => {
      const date = new Date(user.createdAt);
      const key = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      if (labels.includes(key)) {
        summaryUsers[key]! += 1;
      }
    });

    return {
      revenues: labels.map(label => ({
        label: `Ngày ${label}`,
        revenue: summaryRevenue[label]
      })),
      users: labels.map(label => ({
        label: `Ngày ${label}`,
        users: summaryUsers[label]
      }))
    };
  }, [overviews]);
  return (
    <>
      <SimpleGrid cols={2}>
        <Card radius={'md'} withBorder shadow='md'>
          <Flex align={'center'} justify={'space-between'} mb={'xl'}>
            <Box>
              <Title order={5} className='font-quicksand'>
                Doanh thu theo thời gian
              </Title>
              <Text size='sm' c={'dimmed'}>
                Biểu đồ doanh thu{' '}
                <b>
                  {period >= 0
                    ? !period
                      ? 'trong hôm nay'
                      : `từ ${formatDateViVN(startTimeToNum)} đến ${formatDateViVN(endTimeToNum)}`
                    : ' kể từ đơn hàng đầu tiên'}
                </b>
              </Text>
            </Box>
            <ActionIcon variant='light' size={'lg'}>
              <IconRotateClockwise size={16} />
            </ActionIcon>
          </Flex>
          <LineChart
            h={300}
            data={dataOverviewChart.revenues}
            dataKey='label'
            series={[{ name: 'revenue', label: 'Doanh thu (VNĐ)', color: 'blue.6' }]}
            curveType='bump'
            gridAxis='xy'
            lineProps={{
              isAnimationActive: true,
              animationDuration: 400,
              animationEasing: 'ease-in-out'
            }}
            valueFormatter={value => formatPriceLocaleVi(value)}
          />
        </Card>
        <Card withBorder shadow='sm' radius={'md'}>
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
      </SimpleGrid>

      {overviews.orders && overviews.orders?.length > 0 && (
        <Card radius={'md'} withBorder shadow='sm'>
          <Box mb={'md'}>
            <Title order={5} className='font-quicksand'>
              Đơn hàng gần đây
            </Title>
            <Text size='sm' c={'dimmed'}>
              Danh sách đơn hàng{' '}
              <b>
                {period >= 0
                  ? !period
                    ? 'hôm nay'
                    : `từ ${formatDateViVN(startTimeToNum)} đến ${formatDateViVN(endTimeToNum)}`
                  : ' kể từ đơn hàng đầu tiên'}
              </b>
            </Text>
          </Box>

          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Ngày</Table.Th>
                <Table.Th>Khách hàng</Table.Th>
                <Table.Th>Tổng tiền</Table.Th>
                <Table.Th>Trạng thái</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {overviews.orders.map((order: any) => {
                const statusInfo = getStatusInfo(order.status as LocalOrderStatus);
                return (
                  <Table.Tr key={order.id}>
                    <Table.Td>{order.id}</Table.Td>
                    <Table.Td>{formatDateViVN(order.createdAt)}</Table.Td>
                    <Table.Td>{order?.user?.name}</Table.Td>
                    <Table.Td>{formatPriceLocaleVi(order?.finalTotal)}</Table.Td>
                    <Table.Td>
                      <Badge leftSection={<statusInfo.icon size={16} />} color={statusInfo.color}>
                        {statusInfo.label}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Card>
      )}
    </>
  );
}
