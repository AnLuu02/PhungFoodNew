import {
  ActionIcon,
  Badge,
  Card,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title,
  rem,
  useMantineTheme
} from '@mantine/core';
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconCurrencyDollar,
  IconEye,
  IconPencil,
  IconShoppingCart,
  IconStar,
  IconUsers
} from '@tabler/icons-react';
import { getStatusColor } from '~/app/lib/utils/func-handler/get-status-order';

export default function DashboardOverview() {
  const theme = useMantineTheme();

  const stats = [
    {
      title: 'Revenue',
      value: '$13,456',
      diff: 34,
      icon: <IconCurrencyDollar style={{ width: rem(32), height: rem(32) }} stroke={1.5} />,
      color: theme.colors.green[6]
    },
    {
      title: 'New Customers',
      value: '145',
      diff: 12,
      icon: <IconUsers style={{ width: rem(32), height: rem(32) }} stroke={1.5} />,
      color: theme.colors.blue[6]
    },
    {
      title: 'Orders',
      value: '435',
      diff: -4,
      icon: <IconShoppingCart style={{ width: rem(32), height: rem(32) }} stroke={1.5} />,
      color: theme.colors.orange[6]
    },
    {
      title: 'Reviews',
      value: '4.8/5',
      diff: 8,
      icon: <IconStar style={{ width: rem(32), height: rem(32) }} stroke={1.5} />,
      color: theme.colors.yellow[6]
    }
  ];

  const recentOrders = [
    { id: '#ORD-5531', customer: 'John Smith', date: '2023-03-15', total: '$45.50', status: 'Completed' },
    { id: '#ORD-5530', customer: 'Sarah Johnson', date: '2023-03-15', total: '$86.25', status: 'Processing' },
    { id: '#ORD-5529', customer: 'Michael Brown', date: '2023-03-14', total: '$32.80', status: 'Completed' },
    { id: '#ORD-5528', customer: 'Emily Davis', date: '2023-03-14', total: '$124.00', status: 'Delivered' },
    { id: '#ORD-5527', customer: 'Robert Wilson', date: '2023-03-13', total: '$65.75', status: 'Cancelled' }
  ];

  return (
    <Stack>
      <Title order={2} mb='md'>
        Dashboard Overview
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        {stats.map(stat => (
          <Paper key={stat.title} withBorder p='md' radius='md'>
            <Group justify='space-between'>
              <div>
                <Text size='xs' c='dimmed'>
                  {stat.title}
                </Text>
                <Text fw={700} size='xl'>
                  {stat.value}
                </Text>
              </div>
              <ThemeIcon color={stat.color} variant='light' size='lg' radius='md'>
                {stat.icon}
              </ThemeIcon>
            </Group>

            <Group mt='xs'>
              <Text c={stat.diff > 0 ? 'teal' : 'red'} size='sm' fw={500}>
                {stat.diff > 0 ? `+${stat.diff}%` : `${stat.diff}%`}
              </Text>
              {stat.diff > 0 ? (
                <IconArrowUpRight size='1rem' stroke={1.5} color={theme.colors.teal[6]} />
              ) : (
                <IconArrowDownRight size='1rem' stroke={1.5} color={theme.colors.red[6]} />
              )}
              <Text size='xs' c='dimmed'>
                compared to last month
              </Text>
            </Group>
          </Paper>
        ))}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, md: 2 }} mt='md'>
        <Card withBorder padding='md' radius='md'>
          <Card.Section withBorder inheritPadding py='xs'>
            <Group justify='space-between'>
              <Text fw={500}>Recent Orders</Text>
              <Text size='sm' c='dimmed'>
                Today
              </Text>
            </Group>
          </Card.Section>

          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Order ID</Table.Th>
                <Table.Th>Customer</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {recentOrders.map(order => (
                <Table.Tr key={order.id}>
                  <Table.Td>{order.id}</Table.Td>
                  <Table.Td>{order.customer}</Table.Td>
                  <Table.Td>{order.date}</Table.Td>
                  <Table.Td>{order.total}</Table.Td>
                  <Table.Td>
                    <Badge color={getStatusColor(order.status)}>{order.status}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap='xs'>
                      <ActionIcon size='sm' variant='subtle'>
                        <IconEye size='1rem' stroke={1.5} />
                      </ActionIcon>
                      <ActionIcon size='sm' variant='subtle'>
                        <IconPencil size='1rem' stroke={1.5} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>

        <Card withBorder padding='md' radius='md'>
          <Card.Section withBorder inheritPadding py='xs'>
            <Group justify='space-between'>
              <Text fw={500}>Popular Menu Items</Text>
              <Text size='sm' c='dimmed'>
                This Week
              </Text>
            </Group>
          </Card.Section>

          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Item</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Orders</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>Margherita Pizza</Table.Td>
                <Table.Td>Pizza</Table.Td>
                <Table.Td>$12.99</Table.Td>
                <Table.Td>145</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Chicken Alfredo</Table.Td>
                <Table.Td>Pasta</Table.Td>
                <Table.Td>$14.50</Table.Td>
                <Table.Td>132</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Caesar Salad</Table.Td>
                <Table.Td>Salads</Table.Td>
                <Table.Td>$8.99</Table.Td>
                <Table.Td>98</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Garlic Bread</Table.Td>
                <Table.Td>Sides</Table.Td>
                <Table.Td>$4.50</Table.Td>
                <Table.Td>87</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Tiramisu</Table.Td>
                <Table.Td>Desserts</Table.Td>
                <Table.Td>$6.99</Table.Td>
                <Table.Td>76</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Card>
      </SimpleGrid>
    </Stack>
  );
}
