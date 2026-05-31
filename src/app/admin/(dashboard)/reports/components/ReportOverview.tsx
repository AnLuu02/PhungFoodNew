'use client';

import { BarChart, LineChart } from '@mantine/charts';
import { ActionIcon, Badge, Box, Card, Flex, Group, SimpleGrid, Table, Text, Title, Tooltip } from '@mantine/core';
import { OrderStatus } from '@prisma/client';
import { IconArrowsHorizontal, IconRotateClockwise } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { CommonSkeleton } from '~/components/Loading/LoadingSkeleton';
import dayjs from '~/lib/dayjs';
import { formatDateViVN, formatPriceLocaleVi, toNumber } from '~/lib/FuncHandler/Format';
import { getDatesObjBetween } from '~/lib/FuncHandler/Statistics';
import { getStatusInfo } from '~/lib/FuncHandler/status-order';
import { GetInitReport } from '~/shared/type-trpc/page.type-trpc';
import { Period } from '~/shared/types';
import { api } from '~/trpc/react';

export default function ReportOverviewPageClient() {
  const [showAllChart, setShowAllChart] = useState(false);
  const searchParams = useSearchParams();
  const startTimeToNum = toNumber(searchParams.get('startTime') ?? undefined);
  const endTimeToNum = toNumber(searchParams.get('endTime') ?? undefined);
  const period = (searchParams.get('period') ?? '_all') as Period;
  const { data: overviews, isLoading } = api.Revenue.getOverview.useQuery({
    startTime: startTimeToNum,
    endTime: endTimeToNum,
    period
  });

  const revenues = overviews ? overviews?.revenues : [];
  const users = overviews ? overviews?.users : [];
  const startDate = startTimeToNum || revenues?.[0]?.createdAt || dayjs().tz().toDate();
  const endDate = endTimeToNum || dayjs().tz().toDate();
  const periodSize = dayjs(endDate).tz().diff(startDate, 'day');

  const dataOverviewChart = useMemo(() => {
    const rangeDateObj = getDatesObjBetween(startDate, endDate, {
      format: 'DD-MM-YYYY',
      defaultTimeZone: true
    });
    const labels = Object.keys(rangeDateObj);
    const summaryRevenue: Record<string, number> = {};
    const summaryUsers: Record<string, number> = {};

    revenues.forEach((revenue: (typeof revenues)[number]) => {
      const day = +revenue.day;
      const month = +revenue.month;
      const year = +revenue.year;
      const key = dayjs([year, month - 1, day])
        .tz()
        .format('DD-MM-YYYY');
      if (labels.includes(key)) {
        summaryRevenue[key] = Number(summaryRevenue[key] || 0) + Number(revenue.netRevenue || 0);
      } else if (!(key in summaryRevenue)) {
        summaryRevenue[key] = 0;
      }
    });

    users.forEach((user: (typeof users)[number]) => {
      const key = user.createdAt ? dayjs(user.createdAt).tz().format('DD-MM-YYYY') : dayjs().tz().format('DD-MM-YYYY');
      if (labels.includes(key)) {
        summaryUsers[key] = Number(summaryUsers[key] || 0) + 1;
      } else if (!(key in summaryUsers)) {
        summaryUsers[key] = 0;
      }
    });
    return {
      revenues: labels.map(label => ({
        label: `Ngày ${label}`,
        revenue: summaryRevenue[label] || 0
      })),
      users: labels.map(label => ({
        label: `Ngày ${label}`,
        users: summaryUsers[label] || 0
      }))
    };
  }, [revenues, users]);

  return (
    <>
      <SimpleGrid cols={showAllChart ? 1 : 2}>
        {isLoading ? (
          <>
            <CommonSkeleton.Chart />
            <CommonSkeleton.Chart />
          </>
        ) : (
          <>
            <Card withBorder shadow='md' className='transition duration-300 ease-in-out dark:bg-transparent'>
              <Flex align={'center'} justify={'space-between'} mb={'xl'}>
                <Box>
                  <Title order={5} className='font-quicksand'>
                    Doanh thu theo thời gian
                  </Title>
                  <Text size='sm' c={'dimmed'}>
                    Biểu đồ doanh thu{' '}
                    <b>
                      {periodSize == 0
                        ? 'trong hôm nay'
                        : periodSize > 0
                          ? `từ ${formatDateViVN(startDate)} đến ${formatDateViVN(endDate)}`
                          : ' kể từ đơn hàng đầu tiên'}
                    </b>
                  </Text>
                </Box>
                <Group>
                  <Tooltip label={'Cập nhật'}>
                    <ActionIcon variant='light' size={'lg'}>
                      <IconRotateClockwise size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label={'Mở rộng'}>
                    <ActionIcon variant='light' size={'lg'} onClick={() => setShowAllChart(!showAllChart)}>
                      <IconArrowsHorizontal size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
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
            <Card withBorder shadow='sm' className='transition duration-300 ease-in-out dark:bg-transparent'>
              <Flex align={'center'} justify={'space-between'} mb={'xl'}>
                <Box>
                  <Title order={5} className='font-quicksand'>
                    Người dùng mới
                  </Title>
                  <Text size='sm' c={'dimmed'}>
                    Số lượng người dùng đăng kí mới{' '}
                    <b>
                      {periodSize >= 0
                        ? !periodSize
                          ? 'hôm nay'
                          : `từ ${formatDateViVN(startDate)} đến ${formatDateViVN(endDate)}`
                        : ' kể từ đơn hàng đầu tiên'}
                    </b>
                  </Text>
                </Box>
                <Group>
                  <Tooltip label={'Cập nhật'}>
                    <ActionIcon variant='light' size={'lg'}>
                      <IconRotateClockwise size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label={'Mở rộng'}>
                    <ActionIcon variant='light' size={'lg'} onClick={() => setShowAllChart(!showAllChart)}>
                      <IconArrowsHorizontal size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
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
          </>
        )}
      </SimpleGrid>

      {overviews?.orders && overviews?.orders?.length > 0 && (
        <Card withBorder shadow='sm' className={`dark:bg-transparent`}>
          <Box mb={'md'}>
            <Title order={5} className='font-quicksand'>
              Đơn hàng gần đây
            </Title>
            <Text size='sm' c={'dimmed'}>
              Danh sách đơn hàng{' '}
              <b>
                {periodSize >= 0
                  ? !periodSize
                    ? 'hôm nay'
                    : `từ ${formatDateViVN(startDate)} đến ${formatDateViVN(endDate)}`
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
              {isLoading ? (
                <>
                  <Table.Tr>
                    <Table.Td colSpan={5}>
                      <CommonSkeleton.Table cols={5} />
                    </Table.Td>
                  </Table.Tr>
                </>
              ) : (
                overviews &&
                overviews?.orders.map((order: NonNullable<GetInitReport['overview']['orders']>[number]) => {
                  const statusInfo = getStatusInfo(order.status as OrderStatus);
                  return (
                    <Table.Tr key={order.id}>
                      <Table.Td>{order.id}</Table.Td>
                      <Table.Td>{formatDateViVN(order.createdAt)}</Table.Td>
                      <Table.Td>{order?.user?.name}</Table.Td>
                      <Table.Td>{formatPriceLocaleVi(order?.finalTotal)}</Table.Td>
                      <Table.Td>
                        <Badge
                          leftSection={<statusInfo.icon size={16} />}
                          variant='light'
                          color={statusInfo.color}
                          style={{
                            borderColor: statusInfo.color
                          }}
                        >
                          {statusInfo.label}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  );
                })
              )}
            </Table.Tbody>
          </Table>
        </Card>
      )}
    </>
  );
}
