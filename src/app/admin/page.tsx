import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  GridCol,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title
} from '@mantine/core';
import {
  IconArrowRight,
  IconBrandCashapp,
  IconChartBarPopular,
  IconCheese,
  IconGift,
  IconSettings,
  IconShoppingCart,
  IconUser,
  IconUserPlus
} from '@tabler/icons-react';
import Link from 'next/link';
import { formatMoneyShort, formatTimeAgo } from '~/lib/func-handler/Format';
import { api } from '~/trpc/server';
import { ChangeRate } from './(dashboard)/reports/components/ChangeRate';

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
  const recentActivities = data.recentActivities || [];
  const revenue = data.revenue || [];
  const dataRevenue = [
    {
      label: 'Tổng doanh thu',
      currentValue: revenue?.totalFinalRevenue?.currentValue || 0,
      previousValue: revenue?.totalFinalRevenue?.previousValue || 0,
      changeRate: revenue?.totalFinalRevenue?.changeRate || 0,
      icon: IconBrandCashapp,
      color: '#4ED07E'
    },
    {
      label: 'Tổng người dùng',
      currentValue: revenue?.totalUsers?.currentValue || 0,
      previousValue: revenue?.totalUsers?.previousValue || 0,
      icon: IconUser,
      changeRate: revenue?.totalUsers?.changeRate || 0,
      color: '#4B6CB3'
    },
    {
      label: 'Tổng đơn hàng',
      currentValue: revenue?.totalOrders?.currentValue || 0,
      previousValue: revenue?.totalOrders?.previousValue || 0,
      changeRate: revenue?.totalOrders?.changeRate || 0,
      icon: IconShoppingCart,
      color: '#8547BB'
    },
    {
      label: 'Tổng sản phẩm',
      currentValue: revenue?.totalProducts?.currentValue || 0,
      previousValue: revenue?.totalProducts?.previousValue || 0,
      changeRate: revenue?.totalProducts?.changeRate || 0,
      icon: IconCheese,
      color: '#CB7E56'
    }
  ];
  return (
    <Box pb={'xl'} mb={'xl'} className='min-h-screen'>
      <Stack gap='lg' className='mx-auto max-w-7xl'>
        <Box>
          <Title order={2} className='font-quicksand'>
            Chào mừng trở lại!
          </Title>
          <Text c={'dimmed'} size='sm'>
            Đây là tổng quan về hoạt động của hệ thống PhungFood hôm nay
          </Text>
        </Box>

        <SimpleGrid cols={4}>
          {dataRevenue.map((item, index) => {
            const IconR = item.icon;
            return (
              <Card key={index} radius={'lg'} withBorder shadow='md'>
                <Stack gap={'xs'}>
                  <Text size='sm' fw={700} c={'dimmed'}>
                    {item.label}
                  </Text>
                  <Flex align={'center'} justify={'space-between'}>
                    <Title className='font-quicksand' order={3}>
                      {formatMoneyShort(item.currentValue)}
                    </Title>
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

                  <ChangeRate
                    currentValue={item.currentValue}
                    previousValue={item.previousValue}
                    changeRate={item.changeRate}
                  />
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>

        <Grid>
          <GridCol span={8}>
            <Paper radius={'lg'} withBorder shadow='md'>
              <Box px={'xl'} py={'md'}>
                <Title order={4} className='font-quicksand'>
                  Thao tác nhanh
                </Title>
                <Text c={'dimmed'} size='sm'>
                  Các tác vụ thường dùng trong hệ thống
                </Text>
              </Box>
              <Divider />
              <SimpleGrid cols={2} mt={'md'} p={'xl'}>
                {recentControl.map((item, index) => {
                  const IconR = item.icon;
                  return (
                    <Link href={item.href} key={index}>
                      <Card
                        radius={'lg'}
                        pos={'relative'}
                        key={index}
                        px={'xl'}
                        className='cursor-pointer hover:opacity-90 hover:shadow-md'
                      >
                        <Flex align={'center'} gap={'md'}>
                          <ActionIcon size={'xl'} radius={'md'} color={item.color}>
                            <IconR size={20} />
                          </ActionIcon>
                          <Box>
                            <Title order={5} className='font-quicksand'>
                              {item.label}
                            </Title>
                            <Text c={'dimmed'} size='sm'>
                              {item.des}
                            </Text>
                          </Box>
                        </Flex>
                        <IconArrowRight size={16} className='absolute right-4 top-3' />
                      </Card>
                    </Link>
                  );
                })}
              </SimpleGrid>
            </Paper>
          </GridCol>
          <GridCol span={4}>
            <Paper radius={'lg'} withBorder shadow='md' pb={'md'}>
              <Box px={'xl'} py={'md'}>
                <Title order={4} className='font-quicksand'>
                  Hoạt động gần đây
                </Title>
                <Text c={'dimmed'} size='sm'>
                  Các sự kiện mới đây trong hệ thống
                </Text>
              </Box>
              <Divider />
              <SimpleGrid cols={1} mt={'md'} px={'md'} pb={'md'}>
                {recentActivities?.length > 0 ? (
                  recentActivities.slice(0, 5).map((item: any, index: number) => {
                    return (
                      <Flex align={'flex-start'} gap={'md'} key={index}>
                        <Avatar
                          className='border-1 border-solid border-mainColor'
                          src={item?.image?.url}
                          radius={'xl'}
                        />
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
              {recentActivities?.length > 5 && (
                <Button variant='subtle' rightSection={<IconArrowRight size={16} />}>
                  Xem tất cả hoạt động
                </Button>
              )}
            </Paper>
          </GridCol>
        </Grid>
      </Stack>
    </Box>
  );
}
