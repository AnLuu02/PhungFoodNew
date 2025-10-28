'use client';

import { BarChart } from '@mantine/charts';
import { ActionIcon, Box, Button, Card, Divider, Flex, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import {
  IconArrowRight,
  IconChartCovariate,
  IconCheese,
  IconCircleCheck,
  IconClock,
  IconDatabase,
  IconMoneybag,
  IconSettings,
  IconStack2Filled,
  IconUsers,
  IconUsersGroup
} from '@tabler/icons-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { formatTimeAgo } from '~/lib/FuncHandler/Format';

const navReportDetails = [
  {
    icon: IconChartCovariate,
    label: 'Tương tác',
    des: 'Báo cáo tổng quan với biểu đồ tương tác',
    value: 'revenues',
    href: '/admin/reports/dashboard',
    color: '#8547BB'
  },
  {
    icon: IconMoneybag,
    label: 'Báo cáo doanh thu',
    des: 'Phân tích chi tiết doanh thu và bán hàng',
    value: 'revenues',
    href: '/admin/reports/dashboard',
    color: '#228BE6'
  },
  {
    icon: IconUsersGroup,
    label: 'Báo cáo người dùng',
    des: 'Thống kê và phân tích người dùng',
    value: 'revenues',
    href: '/admin/reports/dashboard',
    color: '#40C057'
  },
  {
    icon: IconStack2Filled,
    label: 'Báo cáo sản phẩm',
    des: 'Hiệu suất và đánh giá sản phẩm',
    value: 'revenues',
    href: '/admin/reports/dashboard',
    color: '#FA5252'
  },
  {
    icon: IconSettings,
    label: 'Báo cáo hệ thống',
    des: 'Tình trạng và hiệu suất hệ thống',
    value: 'revenues',
    href: '/admin/reports/dashboard',
    color: '#FD7E14'
  }
];

export default function ReportDetailPageClient({ overviews, recentActivitiesApp }: any) {
  const searchParams = useSearchParams();
  const startTime = searchParams.get('startTime');
  const endTime = searchParams.get('endTime');
  const startTimeToNum = (startTime && Number(startTime)) || new Date().getTime();
  const endTimeToNum = (endTime && Number(endTime)) || new Date().getTime();
  const period = !(endTimeToNum - startTimeToNum) ? 1 : (endTimeToNum - startTimeToNum) / (24 * 60 * 60 * 1000) + 1;

  const revenues = overviews.revenues || [];
  const dataOverviewChart = useMemo(() => {
    const labels = Array.from({ length: +period }, (_, i) => {
      const currentDate = new Date(endTimeToNum - (period !== 1 ? (+period - i - 1) * 24 * 60 * 60 * 1000 : 0));
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

  const recentActivitiesAppRender = useMemo(() => {
    return recentActivitiesApp.slice(0, 5).filter(Boolean);
  }, [recentActivitiesApp]);
  return (
    <Stack>
      <Card withBorder shadow='sm' radius={'lg'}>
        <Flex align={'center'} justify={'space-between'} mb={'md'}>
          <Box>
            <Title order={4} className='font-quicksand'>
              Báo cáo chi tiết
            </Title>
            <Text size='sm' c={'dimmed'}>
              Truy cập các báo cáo chuyên sâu
            </Text>
          </Box>
        </Flex>
        <SimpleGrid cols={5}>
          {navReportDetails?.map((item, index) => (
            <Card
              radius={'lg'}
              px={'md'}
              py={'xs'}
              className='cursor-pointer duration-200 hover:scale-105 hover:shadow-xl'
              style={{ backgroundColor: item.color + 22, border: `1px solid ${item.color}` }}
              key={index}
            >
              <Flex gap={3} direction={'column'} justify={'space-between'} align={'flex-start'} h={'100%'}>
                <ActionIcon w={30} h={30} radius={'md'} my={'md'} styles={{ root: { backgroundColor: item.color } }}>
                  <item.icon size={20} />
                </ActionIcon>
                <Text fw={700}>{item.label}</Text>
                <Text size='sm' c={'dimmed'}>
                  {item.des}
                </Text>
                <Button
                  variant='transparent'
                  pl={0}
                  rightSection={<IconArrowRight />}
                  component={Link}
                  href={item.href}
                >
                  Xem chi tiết
                </Button>
              </Flex>
            </Card>
          ))}
        </SimpleGrid>
      </Card>

      <SimpleGrid cols={2}>
        <Card withBorder shadow='sm' radius={'lg'}>
          <Flex align={'center'} justify={'space-between'} mb={'md'}>
            <Box>
              <Title order={5} className='font-quicksand'>
                Hoạt động gần đây
              </Title>
              <Text size='sm' c={'dimmed'}>
                Các sự kiện quan trọng trong hệ thống
              </Text>
            </Box>
            <ActionIcon variant='light' size={'lg'}>
              <IconClock size={16} />
            </ActionIcon>
          </Flex>
          <Box>
            <Divider />
            <SimpleGrid cols={1} mt={'md'} px={'md'} pb={'md'}>
              {recentActivitiesAppRender?.length > 0 ? (
                recentActivitiesAppRender.map((item: any, index: number) => {
                  return (
                    <Flex align={'flex-start'} gap={'md'} key={index}>
                      {item?.icon === 'product' ? (
                        <IconCheese size={16} />
                      ) : item?.icon === 'revenue' ? (
                        <IconDatabase size={16} />
                      ) : (
                        <IconUsers size={16} />
                      )}
                      <Box>
                        <Text size='sm'>
                          <b>{item?.actor}</b> {item?.action} <b>{item?.target || ''}</b>
                        </Text>
                        <Text size='xs' c={'dimmed'}>
                          {formatTimeAgo(item?.timezone)}
                        </Text>
                      </Box>
                    </Flex>
                  );
                })
              ) : (
                <Text size='sm' ta={'center'} c={'dimmed'}>
                  Không có hoạt động 7 ngày gần đây
                </Text>
              )}
            </SimpleGrid>
            {recentActivitiesApp?.length > 5 && (
              <Button variant='subtle' rightSection={<IconArrowRight size={16} />}>
                Xem tất cả hoạt động
              </Button>
            )}
          </Box>
        </Card>
        <Card withBorder shadow='sm' radius={'lg'}>
          <Flex align={'center'} justify={'space-between'} mb={'md'}>
            <Box>
              <Title order={5} className='font-quicksand'>
                Tình trạng hệ thống
              </Title>
              <Text size='sm' c={'dimmed'}>
                Hiệu suất và trạng thái dịch vụ
              </Text>
            </Box>
            <ActionIcon variant='light' c={'green'} size={'lg'}>
              <IconCircleCheck size={16} />
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
    </Stack>
  );
}
