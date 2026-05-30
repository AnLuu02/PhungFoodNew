import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title
} from '@mantine/core';
import {
  IconArrowRight,
  IconBrandCashapp,
  IconCalendarStats,
  IconChartBar,
  IconChartBarPopular,
  IconCheese,
  IconClock,
  IconGift,
  IconSettings,
  IconShoppingCart,
  IconTrendingUp,
  IconUser,
  IconUserPlus
} from '@tabler/icons-react';
import Link from 'next/link';
import TimelineRecentActivity from '~/components/TimelineRecentActivity';
import { formatMoneyShort } from '~/lib/FuncHandler/Format';
import { buildChangeRateData } from '~/lib/FuncHandler/Statistics';
import { Period } from '~/shared/types';
import { api } from '~/trpc/server';
import { AnalyticsMetricCard } from './(dashboard)/components/AnalyticsMetricCard';

export const revalidate = 60 * 60;
export const dynamic = 'force-static';

const recentControl = [
  {
    label: 'Thêm người dùng mới',
    des: 'Tạo tài khoản cho khách hàng mới',
    icon: IconUserPlus,
    color: '#297FFF',
    href: '/admin/user'
  },
  {
    href: '/admin/product',
    label: 'Thêm sản phẩm',
    des: 'Thêm món ăn mới vào hệ thống',
    icon: IconCheese,
    color: '#03C853'
  },
  {
    href: '/admin/voucher',
    label: 'Thêm voucher',
    des: 'Thêm chương trình khuyến mãi ',
    icon: IconGift,
    color: '#F8C256'
  },
  {
    label: 'Xem báo cáo',
    des: 'Phân tích dữ liệu và thống kê',
    icon: IconChartBarPopular,
    color: '#AD45FF',
    href: '/admin/reports'
  },
  {
    label: 'Cài đặt hệ thống',
    des: 'Quản lý cấu hình và thiết lập',
    icon: IconSettings,
    color: '#FF6801',
    href: '/admin/settings'
  }
];

export default async function Dashboard() {
  const data = await api.Page.getInitAdmin();
  const revenue = data.revenue || [];
  const dataRevenue = [
    {
      label: 'Tổng doanh thu',
      currentValue: Number(revenue?.totalFinalRevenue?.current?.value || 0),
      previousSparkline: revenue?.totalFinalRevenue?.previous?.sparkline || [0, 0, 0, 0, 0, 0, 0],
      currentSparkline: revenue?.totalFinalRevenue?.current?.sparkline || [0, 0, 0, 0, 0, 0, 0],
      changeRate: revenue?.totalFinalRevenue?.changeRate || 0,
      icon: IconBrandCashapp,
      color: 'blue'
    },
    {
      label: 'Tổng người dùng',
      currentValue: Number(revenue?.totalUsers?.current?.value || 0),
      previousSparkline: revenue?.totalUsers?.previous?.sparkline || [0, 0, 0, 0, 0, 0, 0],
      currentSparkline: revenue?.totalUsers?.current?.sparkline || [0, 0, 0, 0, 0, 0, 0],
      changeRate: revenue?.totalUsers?.changeRate || 0,
      icon: IconUser,
      color: 'green'
    },
    {
      label: 'Tổng đơn hàng',
      currentValue: Number(revenue?.totalOrders?.current?.value || 0),
      previousSparkline: revenue?.totalOrders?.previous?.sparkline || [0, 0, 0, 0, 0, 0, 0],
      currentSparkline: revenue?.totalOrders?.current?.sparkline || [0, 0, 0, 0, 0, 0, 0],
      changeRate: revenue?.totalOrders?.changeRate || 0,
      icon: IconShoppingCart,
      color: 'orange'
    },
    {
      label: 'Tổng sản phẩm',
      currentValue: Number(revenue?.totalProducts?.current?.value || 0),
      previousSparkline: revenue?.totalProducts?.previous?.sparkline || [0, 0, 0, 0, 0, 0, 0],
      currentSparkline: revenue?.totalProducts?.current?.sparkline || [0, 0, 0, 0, 0, 0, 0],
      changeRate: revenue?.totalProducts?.changeRate || 0,
      icon: IconCheese,
      color: 'violet'
    }
  ];
  return (
    <Box pb='xl' mb='xl' className='min-h-screen bg-gray-50/70 dark:bg-transparent'>
      <Stack gap='xs' className='mx-auto max-w-7xl'>
        <Paper withBorder radius='xl' p='xl' className='relative overflow-hidden bg-white dark:bg-transparent'>
          <Flex justify='space-between' align='center' gap='lg' wrap='wrap' className='relative z-10'>
            <Box>
              <Badge variant='light' size='lg' mb='sm'>
                PhungFood Admin
              </Badge>

              <Title order={2} className='font-quicksand'>
                Chào mừng trở lại!
              </Title>

              <Text c='dimmed' size='sm' mt={4}>
                Đây là tổng quan nhanh về doanh thu, đơn hàng và hoạt động hệ thống hôm nay.
              </Text>
            </Box>

            <Paper withBorder radius='lg' p='md' className='bg-gray-50 dark:bg-dark-card'>
              <Group gap='sm'>
                <ThemeIcon variant='light' size='lg' radius='xl'>
                  <IconClock size={18} />
                </ThemeIcon>

                <Box>
                  <Text size='xs' c='dimmed'>
                    Cập nhật gần nhất
                  </Text>
                  <Text size='sm' fw={700}>
                    Hôm nay
                  </Text>
                </Box>
              </Group>
            </Paper>
          </Flex>
        </Paper>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing='md'>
          {dataRevenue.map((item: (typeof dataRevenue)[number], index: number) => {
            const IconR = item.icon;

            return (
              <AnalyticsMetricCard
                key={index}
                title={item.label}
                value={formatMoneyShort(item.currentValue).toString()}
                descObj={buildChangeRateData(item.changeRate, '_all' as Period)}
                color={item.color}
                icon={<IconR size={24} />}
                currentSparkline={item.currentSparkline}
                previousSparkline={item.previousSparkline}
              />
            );
          })}
        </SimpleGrid>

        <Grid gutter='md'>
          <GridCol span={{ base: 12, lg: 8 }}>
            <Stack gap='md' h={'100%'}>
              <Paper withBorder radius='xl' className='overflow-hidden bg-white dark:bg-transparent'>
                <Box px='xl' py='lg'>
                  <Group justify='space-between' align='flex-start'>
                    <Box>
                      <Title order={4} className='font-quicksand'>
                        Thao tác nhanh
                      </Title>
                      <Text c='dimmed' size='sm'>
                        Các tác vụ thường dùng để quản lý hệ thống nhanh hơn.
                      </Text>
                    </Box>

                    <ThemeIcon variant='light' radius='xl'>
                      <IconArrowRight size={18} />
                    </ThemeIcon>
                  </Group>
                </Box>

                <Divider />

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='md' p='xl'>
                  {recentControl.map((item: any, index: number) => {
                    const IconR = item.icon;

                    return (
                      <Link href={item.href} key={index} className='no-underline'>
                        <Card
                          withBorder
                          radius='lg'
                          p='lg'
                          className='group h-full cursor-pointer bg-gray-50 transition-all hover:-translate-y-1 hover:border-mainColor/60 hover:bg-white hover:shadow-md dark:bg-dark-card'
                        >
                          <Flex align='center' justify='space-between' gap='md'>
                            <Group gap='md' wrap='nowrap'>
                              <ActionIcon size='xl' radius='xl' color={item.color} variant='light'>
                                <IconR size={20} />
                              </ActionIcon>

                              <Box>
                                <Title order={5} className='font-quicksand'>
                                  {item.label}
                                </Title>
                                <Text c='dimmed' size='sm' lineClamp={1}>
                                  {item.des}
                                </Text>
                              </Box>
                            </Group>

                            <IconArrowRight
                              size={18}
                              className='shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-mainColor'
                            />
                          </Flex>
                        </Card>
                      </Link>
                    );
                  })}
                </SimpleGrid>
              </Paper>

              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing='md'>
                <Paper withBorder radius='xl' p='lg' className='bg-white dark:bg-transparent'>
                  <Group gap='sm'>
                    <ThemeIcon variant='light' color='green' radius='xl'>
                      <IconTrendingUp size={18} />
                    </ThemeIcon>
                    <Box>
                      <Text size='xs' c='dimmed'>
                        Hiệu suất
                      </Text>
                      <Text fw={700}>Ổn định</Text>
                    </Box>
                  </Group>
                </Paper>

                <Paper withBorder radius='xl' p='lg' className='bg-white dark:bg-transparent'>
                  <Group gap='sm'>
                    <ThemeIcon variant='light' color='orange' radius='xl'>
                      <IconCalendarStats size={18} />
                    </ThemeIcon>
                    <Box>
                      <Text size='xs' c='dimmed'>
                        Báo cáo
                      </Text>
                      <Text fw={700}>Trong ngày</Text>
                    </Box>
                  </Group>
                </Paper>

                <Paper withBorder radius='xl' p='lg' className='bg-white dark:bg-transparent'>
                  <Group gap='sm'>
                    <ThemeIcon variant='light' color='violet' radius='xl'>
                      <IconChartBar size={18} />
                    </ThemeIcon>
                    <Box>
                      <Text size='xs' c='dimmed'>
                        Dữ liệu
                      </Text>
                      <Text fw={700}>Đang đồng bộ</Text>
                    </Box>
                  </Group>
                </Paper>
              </SimpleGrid>
            </Stack>
          </GridCol>

          <GridCol span={{ base: 12, lg: 4 }}>
            <Box h={'100%'}>
              <TimelineRecentActivity initData={data.recentActivities} />
            </Box>
          </GridCol>
        </Grid>
      </Stack>
    </Box>
  );
}
