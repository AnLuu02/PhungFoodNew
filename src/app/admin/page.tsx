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
  Stack,
  Text,
  Title,
  useMantineTheme
} from '@mantine/core';
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconCardboards,
  IconCategory,
  IconShoppingCart,
  IconUsers
} from '@tabler/icons-react';
import React from 'react';

// Assuming these are fetched from an API or passed as props
const category = [
  /* ... category data ... */
];
const payment = [
  /* ... payment data ... */
];
const users = [
  /* ... users data ... */
];
const orders = [
  /* ... orders data ... */
];

function CardWithIcon({
  icon: Icon,
  title,
  value,
  diff
}: {
  icon: React.FC<any>;
  title: string;
  value: string;
  diff?: number;
}) {
  const theme = useMantineTheme();
  const DiffIcon = diff && diff > 0 ? IconArrowUpRight : IconArrowDownRight;
  const color = diff && diff > 0 ? theme.colors.teal[6] : theme.colors.red[6];

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder>
      <Group>
        <Icon size={32} stroke={1.5} />
        <div>
          <Text size='xs' color='dimmed' tt='uppercase' fw={700}>
            {title}
          </Text>
          <Text fw={700} size='xl'>
            {value}
          </Text>
        </div>
      </Group>
      {diff && (
        <Group mt='md' gap='xs'>
          <Text color={color} size='sm' fw={500}>
            {diff > 0 ? '+' : ''}
            {diff}%
          </Text>
          <DiffIcon size={16} color={color} />
          <Text color='dimmed' size='xs'>
            so với tháng trước
          </Text>
        </Group>
      )}
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
  const [period, setPeriod] = React.useState('7 ngày');

  return (
    <Stack gap='lg'>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
        <CardWithIcon icon={IconCategory} title='Danh mục' value={category?.length?.toString() || '0'} diff={12} />
        <CardWithIcon icon={IconCardboards} title='Thanh toán' value={payment?.length?.toString() || '0'} diff={-2} />
        <CardWithIcon icon={IconUsers} title='Người dùng' value={users?.length?.toString() || '0'} diff={7} />
        <CardWithIcon icon={IconShoppingCart} title='Đơn hàng' value={orders?.length?.toString() || '0'} diff={5} />
      </SimpleGrid>

      <Grid gutter='md'>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card shadow='sm' padding='lg' radius='md' withBorder>
            <Group mb='md'>
              <Title order={4}>Doanh số bán hàng</Title>
              <SegmentedControl value={period} onChange={setPeriod} data={['7 ngày', '30 ngày', '3 tháng']} size='xs' />
            </Group>
            <LineChart
              h={300}
              data={salesData}
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
                thickness={16}
                sections={[{ value: 87, color: theme.colors.green[6] }]}
                label={
                  <Text size='xl' ta='center' fw={700}>
                    87%
                  </Text>
                }
              />
            </Center>
            <Text ta='center' mt='sm' size='sm' color='dimmed'>
              Dựa trên 1234 đánh giá
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
