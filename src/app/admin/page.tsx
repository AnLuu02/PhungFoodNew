'use client';

import { BarChart, LineChart } from '@mantine/charts';
import {
  Avatar,
  Box,
  Card,
  Center,
  Grid,
  Group,
  Paper,
  RingProgress,
  SegmentedControl,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
  useMantineTheme
} from '@mantine/core';
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconBrandStocktwits,
  IconCardboards,
  IconCategory,
  IconCategory2,
  IconImageInPicture,
  IconMeat,
  IconShoppingCart,
  IconStar,
  IconTicket,
  IconUser,
  IconUsers
} from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';
import { api } from '~/trpc/react';

function CardWithIcon({
  icon: Icon,
  title,
  value,
  href,
  diff,
  isLoading
}: {
  icon: React.FC<any>;
  title: string;
  href: string;
  value: string;
  diff?: number;
  isLoading?: boolean;
}) {
  const theme = useMantineTheme();
  const DiffIcon = diff && diff > 0 ? IconArrowUpRight : IconArrowDownRight;
  const color = diff && diff > 0 ? theme.colors.teal[6] : theme.colors.red[6];

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder className='cursor-pointer hover:border-red-400'>
      <Link href={`/admin/${href}`} className='no-underline'>
        <Group>
          <Icon size={32} stroke={1.5} />
          <div>
            <Text size='xs' c='dimmed' tt='uppercase' fw={700}>
              {title}
            </Text>
            {isLoading ? (
              <Skeleton height={24} width={60} />
            ) : (
              <Text fw={700} size='xl'>
                {value}
              </Text>
            )}
          </div>
        </Group>
        {diff && (
          <Group mt='md' gap='xs'>
            <Text c={color} size='sm' fw={500}>
              {diff > 0 ? '+' : ''}
              {diff}%
            </Text>
            <DiffIcon size={16} color={color} />
            <Text c='dimmed' size='xs'>
              so với tháng trước
            </Text>
          </Group>
        )}
      </Link>
    </Card>
  );
}

const salesData = [
  { date: 'Jan', sales: 20 },
  { date: 'Feb', sales: 34 },
  { date: 'Mar', sales: 28 },
  { date: 'Apr', sales: 42 },
  { date: 'May', sales: 38 },
  { date: 'Jun', sales: 51 }
];

const categoryData = [
  { category: 'Electronics', sales: 450 },
  { category: 'Clothing', sales: 320 },
  { category: 'Books', sales: 180 },
  { category: 'Home', sales: 280 }
];

export default function Dashboard() {
  const theme = useMantineTheme();
  const [period, setPeriod] = React.useState<'7 ngày' | '30 ngày' | '3 tháng'>('7 ngày');
  const { data: category, isLoading: categoryLoading } = api.Category.getAll.useQuery();
  const { data: payment, isLoading: paymentLoading } = api.Payment.getAll.useQuery();
  const { data: users, isLoading: usersLoading } = api.User.getAll.useQuery();
  const { data: orders, isLoading: ordersLoading } = api.Order.getAll.useQuery();
  const { data: materials, isLoading: materialsLoading } = api.Material.getAll.useQuery();
  const { data: products, isLoading: productsLoading } = api.Product.getAll.useQuery({ userRole: 'ADMIN' });
  const { data: vouchers, isLoading: vouchersLoading } = api.Voucher.getAll.useQuery();
  const { data: reviews, isLoading: reviewsLoading } = api.Review.getAll.useQuery();
  const { data: subCategories, isLoading: subCategoriesLoading } = api.SubCategory.getAll.useQuery();
  const { data: images, isLoading: imagesLoading } = api.Image.getAll.useQuery();
  const { data: roles, isLoading: rolesLoading } = api.RolePermission.getRoles.useQuery();

  const { data: revenue, isLoading: revenueLoading } = api.Revenue.getRevenueByDuringDate.useQuery({
    period: period
  });

  const valueRating = React.useMemo(() => {
    if (reviews) {
      const total = reviews.reduce((acc, review) => {
        if (review.rating >= 4) {
          acc += 1;
        }
        return acc;
      }, 0);
      return total / reviews.length;
    }
    return 0;
  }, [reviews]);
  return (
    <Stack gap='lg'>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
        <CardWithIcon
          icon={IconCategory}
          title='Danh mục'
          href='category'
          value={category?.length?.toString() || '0'}
          diff={12}
          isLoading={categoryLoading}
        />
        <CardWithIcon
          icon={IconCardboards}
          href='payment'
          title='Thanh toán'
          value={payment?.length?.toString() || '0'}
          diff={-2}
          isLoading={paymentLoading}
        />
        <CardWithIcon
          icon={IconUsers}
          title='Người dùng'
          href='user'
          value={users?.length?.toString() || '0'}
          diff={7}
          isLoading={usersLoading}
        />
        <CardWithIcon
          icon={IconShoppingCart}
          href='order'
          title='Đơn hàng'
          value={orders?.length?.toString() || '0'}
          diff={5}
          isLoading={ordersLoading}
        />
        <CardWithIcon
          icon={IconBrandStocktwits}
          href='product'
          title='Sản phẩm'
          value={products?.length?.toString() || '0'}
          diff={5}
          isLoading={productsLoading}
        />
        <CardWithIcon
          icon={IconMeat}
          title='Nguyên liệu'
          href='material'
          value={materials?.length?.toString() || '0'}
          diff={5}
          isLoading={materialsLoading}
        />
        <CardWithIcon
          icon={IconTicket}
          title='Khuyến mãi'
          href='voucher'
          value={vouchers?.length?.toString() || '0'}
          diff={5}
          isLoading={vouchersLoading}
        />
        <CardWithIcon
          icon={IconStar}
          title='Đánh giá'
          href='review'
          value={reviews?.length?.toString() || '0'}
          diff={5}
          isLoading={reviewsLoading}
        />
        <CardWithIcon
          icon={IconCategory2}
          title='Danh mục con'
          href='subCategory'
          value={subCategories?.length?.toString() || '0'}
          diff={5}
          isLoading={subCategoriesLoading}
        />
        <CardWithIcon
          icon={IconImageInPicture}
          title='Ảnh'
          href='image'
          value={images?.length?.toString() || '0'}
          diff={5}
          isLoading={imagesLoading}
        />
        <CardWithIcon
          icon={IconUser}
          title='Vai trò'
          href='role'
          value={roles?.length?.toString() || '0'}
          diff={5}
          isLoading={rolesLoading}
        />
      </SimpleGrid>

      <Grid gutter='md'>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card shadow='sm' padding='lg' radius='md' withBorder>
            <Group mb='md'>
              <Title order={4}>Doanh số bán hàng</Title>
              <SegmentedControl
                value={period}
                onChange={v => setPeriod(v as any)}
                data={['7 ngày', '30 ngày', '3 tháng']}
                size='xs'
              />
            </Group>
            <LineChart
              h={300}
              data={revenue?.map((item: any) => ({ date: item.date, sales: item.sales })) || []}
              dataKey='date'
              series={[{ name: 'sales', color: theme.colors.blue[6] }]}
              curveType='linear'
            />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow='sm' padding='lg' radius='md' withBorder h='100%'>
            <Title order={4} mb='md'>
              Đánh giá khách hàng
            </Title>
            <Center>
              <RingProgress
                size={200}
                thickness={12}
                sections={[{ value: Math.floor(valueRating * 100), color: theme.colors.green[6] }]}
                label={
                  <Text size='xl' ta='center' fw={700}>
                    {Math.floor(valueRating * 100)?.toFixed(2)}%
                  </Text>
                }
              />
            </Center>
            <Text ta='center' mt='sm' size='sm' c='dimmed'>
              Thông kê theo tỉ lệ đánh giá từ 4 sao trở lên. Dựa trên {reviews?.length} đánh giá
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid gutter='md'>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow='sm' padding='lg' radius='md' withBorder>
            <Title order={4} mb='md'>
              Danh mục hàng đầu
            </Title>
            <BarChart
              h={300}
              data={categoryData}
              dataKey='category'
              series={[{ name: 'sales', color: theme.colors.violet[6] }]}
              tickLine='y'
            />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow='sm' padding='lg' radius='md' withBorder>
            <Title order={4} mb='md'>
              Hoạt động gần đây
            </Title>
            <Stack>
              {[
                { name: 'Olivia Martin', action: 'Commented on your post', time: '1h ago' },
                { name: 'Jackson Lee', action: 'Liked your comment', time: '2h ago' },
                { name: 'Isabella Nguyen', action: 'Shared your post', time: '3h ago' },
                { name: 'Ethan Chen', action: 'Placed a new order', time: '4h ago' },
                { name: 'Sophia Kim', action: 'Registered as a new user', time: '5h ago' }
              ].map((activity, index) => (
                <Paper key={index} p='xs' withBorder>
                  <Group>
                    <Avatar radius='xl' />
                    <Box style={{ flex: 1 }}>
                      <Text size='sm' fw={500}>
                        {activity.name}
                      </Text>
                      <Text size='xs' c='dimmed'>
                        {activity.action}
                      </Text>
                    </Box>
                    <Text size='xs' c='dimmed'>
                      {activity.time}
                    </Text>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
