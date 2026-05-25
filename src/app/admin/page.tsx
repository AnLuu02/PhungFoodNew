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
import { api } from '~/trpc/server';
import { ChangeRate } from './(dashboard)/reports/components/ChangeRate';

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
      currentValue: Number(revenue?.totalFinalRevenue?.currentValue || 0),
      previousValue: revenue?.totalFinalRevenue?.previousValue || 0,
      changeRate: revenue?.totalFinalRevenue?.changeRate || 0,
      icon: IconBrandCashapp,
      color: '#4ED07E'
    },
    {
      label: 'Tổng người dùng',
      currentValue: Number(revenue?.totalUsers?.currentValue || 0),
      previousValue: revenue?.totalUsers?.previousValue || 0,
      icon: IconUser,
      changeRate: revenue?.totalUsers?.changeRate || 0,
      color: '#4B6CB3'
    },
    {
      label: 'Tổng đơn hàng',
      currentValue: Number(revenue?.totalOrders?.currentValue || 0),
      previousValue: revenue?.totalOrders?.previousValue || 0,
      changeRate: revenue?.totalOrders?.changeRate || 0,
      icon: IconShoppingCart,
      color: '#8547BB'
    },
    {
      label: 'Tổng sản phẩm',
      currentValue: Number(revenue?.totalProducts?.currentValue || 0),
      previousValue: revenue?.totalProducts?.previousValue || 0,
      changeRate: revenue?.totalProducts?.changeRate || 0,
      icon: IconCheese,
      color: '#CB7E56'
    }
  ];
  return (
    <Box pb='xl' mb='xl' className='min-h-screen bg-gray-50/70 dark:bg-transparent'>
      <Stack gap='xs' className='mx-auto max-w-7xl'>
        <Paper withBorder radius='xl' p='xl' className='relative overflow-hidden bg-white dark:bg-dark-background'>
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
          {dataRevenue.map((item: any, index: number) => {
            const IconR = item.icon;

            return (
              <Card
                key={index}
                withBorder
                radius='xl'
                p='lg'
                className='group bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:bg-dark-background'
              >
                <Stack gap='md'>
                  <Flex align='center' justify='space-between'>
                    <Text size='sm' fw={700} c='dimmed'>
                      {item.label}
                    </Text>

                    <ThemeIcon
                      size={42}
                      radius='xl'
                      variant='light'
                      style={{
                        color: item.color,
                        backgroundColor: `${item.color}18`
                      }}
                    >
                      <IconR size={20} />
                    </ThemeIcon>
                  </Flex>

                  <Box>
                    <Title order={3} className='font-quicksand'>
                      {formatMoneyShort(item.currentValue)}
                    </Title>

                    <Box mt={6}>
                      <ChangeRate
                        currentValue={Number(item.currentValue)}
                        previousValue={Number(item.previousValue)}
                        changeRate={item.changeRate}
                      />
                    </Box>
                  </Box>
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>

        <Grid gutter='md'>
          <GridCol span={{ base: 12, lg: 8 }}>
            <Stack gap='md' h={'100%'}>
              <Paper withBorder radius='xl' className='overflow-hidden bg-white dark:bg-dark-background'>
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
                <Paper withBorder radius='xl' p='lg' className='bg-white dark:bg-dark-background'>
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

                <Paper withBorder radius='xl' p='lg' className='bg-white dark:bg-dark-background'>
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

                <Paper withBorder radius='xl' p='lg' className='bg-white dark:bg-dark-background'>
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
