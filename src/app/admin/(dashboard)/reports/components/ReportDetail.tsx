'use client';

import { ActionIcon, Box, Button, Card, Flex, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import {
  IconArrowRight,
  IconChartCovariate,
  IconMoneybag,
  IconSettings,
  IconStack2Filled,
  IconUsersGroup
} from '@tabler/icons-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import TimelineRecentActivity from '~/components/TimelineRecentActivity';
import { toNumber } from '~/lib/FuncHandler/Format';

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

export default function ReportDetailPageClient() {
  const searchParams = useSearchParams();
  const startTimeToNum = toNumber(searchParams?.get('startTime') ?? undefined);
  const endTimeToNum = toNumber(searchParams?.get('endTime') ?? undefined);
  // const { data: overviews, isLoading } = api.Revenue.getOverview.useQuery({
  //   startTime: startTimeToNum,
  //   endTime: endTimeToNum
  // });
  return (
    <Stack>
      <Card withBorder shadow='sm'>
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
              px={'md'}
              py={'xs'}
              className='cursor-pointer duration-200 hover:scale-105 hover:shadow-xl'
              style={{ backgroundColor: item.color + 22, border: `1px solid ${item.color}` }}
              key={index}
            >
              <Flex gap={3} direction={'column'} justify={'space-between'} align={'flex-start'} h={'100%'}>
                <ActionIcon w={30} h={30} my={'md'} styles={{ root: { backgroundColor: item.color } }}>
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
        <TimelineRecentActivity startTime={startTimeToNum} endTime={endTimeToNum} />
      </SimpleGrid>
    </Stack>
  );
}
