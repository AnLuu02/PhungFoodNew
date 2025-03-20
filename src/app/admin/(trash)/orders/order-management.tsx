'use client';

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Menu,
  Modal,
  Paper,
  rem,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
  Textarea,
  Title
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconDotsVertical,
  IconEye,
  IconHistory,
  IconMapPin,
  IconPrinter,
  IconReceipt,
  IconShoppingCart
} from '@tabler/icons-react';
import { useState } from 'react';
import { getStatusColor, getStatusIcon } from '~/app/lib/utils/func-handler/get-status-order';

type OrderStatus = 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: 'cash' | 'credit_card' | 'online';
  paymentStatus: 'paid' | 'pending';
  orderType: 'dine_in' | 'takeaway' | 'delivery';
  createdAt: Date;
  notes: string;
}

const initialOrders: Order[] = [
  {
    id: 'ORD-5531',
    customer: {
      name: 'John Smith',
      phone: '(212) 555-1234',
      email: 'john@example.com',
      address: '123 Main St, New York, NY 10001'
    },
    items: [
      { id: '1', name: 'Margherita Pizza', quantity: 2, price: 12.99 },
      { id: '2', name: 'Caesar Salad', quantity: 1, price: 8.99 },
      { id: '3', name: 'Garlic Bread', quantity: 1, price: 5.99 }
    ],
    total: 40.96,
    status: 'delivered',
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    orderType: 'delivery',
    createdAt: new Date(2023, 2, 15, 18, 30),
    notes: 'Please deliver to the back door'
  },
  {
    id: 'ORD-5530',
    customer: {
      name: 'Sarah Johnson',
      phone: '(212) 555-5678',
      email: 'sarah@example.com',
      address: '456 Broadway, New York, NY 10002'
    },
    items: [
      { id: '3', name: 'Spaghetti Bolognese', quantity: 1, price: 14.5 },
      { id: '4', name: 'Tiramisu', quantity: 2, price: 6.99 },
      { id: '5', name: 'Espresso', quantity: 2, price: 3.5 }
    ],
    total: 35.48,
    status: 'processing',
    paymentMethod: 'online',
    paymentStatus: 'paid',
    orderType: 'takeaway',
    createdAt: new Date(2023, 2, 15, 19, 15),
    notes: 'No utensils needed'
  },
  {
    id: 'ORD-5529',
    customer: {
      name: 'Michael Brown',
      phone: '(212) 555-9012',
      email: 'michael@example.com',
      address: ''
    },
    items: [
      { id: '1', name: 'Margherita Pizza', quantity: 1, price: 12.99 },
      { id: '6', name: 'Coca Cola', quantity: 2, price: 2.5 }
    ],
    total: 17.99,
    status: 'ready',
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    orderType: 'dine_in',
    createdAt: new Date(2023, 2, 14, 20, 45),
    notes: 'Table 5'
  },
  {
    id: 'ORD-5528',
    customer: {
      name: 'Emily Davis',
      phone: '(212) 555-3456',
      email: 'emily@example.com',
      address: '789 5th Ave, New York, NY 10003'
    },
    items: [
      { id: '7', name: 'Pepperoni Pizza', quantity: 2, price: 14.99 },
      { id: '8', name: 'Buffalo Wings', quantity: 1, price: 10.99 },
      { id: '9', name: 'Cheesecake', quantity: 1, price: 7.99 }
    ],
    total: 48.96,
    status: 'pending',
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    orderType: 'delivery',
    createdAt: new Date(2023, 2, 14, 19, 0),
    notes: 'Extra napkins please'
  },
  {
    id: 'ORD-5527',
    customer: {
      name: 'Robert Wilson',
      phone: '(212) 555-7890',
      email: 'robert@example.com',
      address: ''
    },
    items: [
      { id: '10', name: 'Chicken Alfredo', quantity: 1, price: 16.99 },
      { id: '11', name: 'Garlic Knots', quantity: 1, price: 4.99 },
      { id: '12', name: 'Iced Tea', quantity: 1, price: 2.99 }
    ],
    total: 24.97,
    status: 'cancelled',
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    orderType: 'takeaway',
    createdAt: new Date(2023, 2, 13, 12, 30),
    notes: 'Customer cancelled due to long wait time'
  }
];

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<string | null>('active');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);
  const [statusModalOpened, { open: openStatusModal, close: closeStatusModal }] = useDisclosure(false);
  const [statusNote, setStatusNote] = useState('');

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    openDetails();
  };

  const handleChangeStatus = (order: Order) => {
    setSelectedOrder(order);
    setStatusNote('');
    openStatusModal();
  };

  const handleUpdateStatus = (newStatus: OrderStatus) => {
    if (!selectedOrder) return;

    const updatedOrders = orders.map(order =>
      order.id === selectedOrder.id
        ? { ...order, status: newStatus, notes: statusNote ? `${order.notes}\n${statusNote}` : order.notes }
        : order
    );

    setOrders(updatedOrders);
    closeStatusModal();

    notifications.show({
      title: 'Order Status Updated',
      message: `Order ${selectedOrder.id} status changed to ${newStatus}`,
      color: 'blue'
    });
  };

  const getPaymentStatusColor = (status: 'paid' | 'pending') => {
    return status === 'paid' ? 'green' : 'orange';
  };

  const getOrderTypeLabel = (type: 'dine_in' | 'takeaway' | 'delivery') => {
    switch (type) {
      case 'dine_in':
        return 'Dine In';
      case 'takeaway':
        return 'Takeaway';
      case 'delivery':
        return 'Delivery';
      default:
        return '';
    }
  };

  const filteredOrders =
    activeTab === 'active'
      ? orders.filter(order => ['pending', 'processing', 'ready'].includes(order.status))
      : orders.filter(order => ['delivered', 'cancelled'].includes(order.status));

  return (
    <>
      <Group justify='space-between' mb='lg'>
        <Title order={2}>Order Management</Title>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab} mb='xl'>
        <Tabs.List>
          <Tabs.Tab value='active' leftSection={<IconShoppingCart size={16} />}>
            Active Orders
          </Tabs.Tab>
          <Tabs.Tab value='completed' leftSection={<IconHistory size={16} />}>
            Order History
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Order ID</Table.Th>
            <Table.Th>Customer</Table.Th>
            <Table.Th>Date & Time</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Total</Table.Th>
            <Table.Th>Payment</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredOrders.map(order => (
            <Table.Tr key={order.id}>
              <Table.Td>{order.id}</Table.Td>
              <Table.Td>{order.customer.name}</Table.Td>
              <Table.Td>{order.createdAt.toLocaleString()}</Table.Td>
              <Table.Td>{getOrderTypeLabel(order.orderType)}</Table.Td>
              <Table.Td>${order.total.toFixed(2)}</Table.Td>
              <Table.Td>
                <Badge color={getPaymentStatusColor(order.paymentStatus)}>
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Badge color={getStatusColor(order.status)} leftSection={getStatusIcon(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group gap='xs'>
                  <ActionIcon variant='subtle' color='blue' onClick={() => handleViewOrder(order)}>
                    <IconEye size='1rem' stroke={1.5} />
                  </ActionIcon>
                  {activeTab === 'active' && (
                    <Menu position='bottom-end' withinPortal>
                      <Menu.Target>
                        <ActionIcon variant='subtle'>
                          <IconDotsVertical size='1rem' stroke={1.5} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<IconReceipt style={{ width: rem(14), height: rem(14) }} />}
                          onClick={() => handleChangeStatus(order)}
                        >
                          Update Status
                        </Menu.Item>
                        <Menu.Item leftSection={<IconPrinter style={{ width: rem(14), height: rem(14) }} />}>
                          Print Receipt
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  )}
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {/* Order Details Modal */}
      <Modal opened={detailsOpened} onClose={closeDetails} title={`Order Details: ${selectedOrder?.id}`} size='lg'>
        {selectedOrder && (
          <Stack>
            <Group>
              <div>
                <Text fw={500}>Order Date:</Text>
                <Text>{selectedOrder.createdAt.toLocaleString()}</Text>
              </div>
              <Badge color={getStatusColor(selectedOrder.status)} size='lg'>
                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
              </Badge>
            </Group>

            <Divider label='Customer Information' labelPosition='center' />

            <Paper withBorder p='md' radius='md'>
              <Text fw={500}>{selectedOrder.customer.name}</Text>
              <Text size='sm'>{selectedOrder.customer.phone}</Text>
              <Text size='sm'>{selectedOrder.customer.email}</Text>
              {selectedOrder.customer.address && (
                <Text size='sm' mt={5}>
                  <IconMapPin size='0.9rem' style={{ display: 'inline', marginRight: '5px' }} />
                  {selectedOrder.customer.address}
                </Text>
              )}
            </Paper>

            <Divider label='Order Items' labelPosition='center' />

            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Item</Table.Th>
                  <Table.Th>Quantity</Table.Th>
                  <Table.Th>Price</Table.Th>
                  <Table.Th>Subtotal</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {selectedOrder.items.map(item => (
                  <Table.Tr key={item.id}>
                    <Table.Td>{item.name}</Table.Td>
                    <Table.Td>{item.quantity}</Table.Td>
                    <Table.Td>${item.price.toFixed(2)}</Table.Td>
                    <Table.Td>${(item.quantity * item.price).toFixed(2)}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
              <Table.Tfoot>
                <Table.Tr>
                  <Table.Td colSpan={3} style={{ textAlign: 'right' }}>
                    <Text fw={500}>Total:</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={700}>${selectedOrder.total.toFixed(2)}</Text>
                  </Table.Td>
                </Table.Tr>
              </Table.Tfoot>
            </Table>

            <Divider label='Additional Information' labelPosition='center' />

            <Group>
              <div>
                <Text fw={500}>Order Type:</Text>
                <Text>{getOrderTypeLabel(selectedOrder.orderType)}</Text>
              </div>
              <div>
                <Text fw={500}>Payment Method:</Text>
                <Text>{selectedOrder.paymentMethod.replace('_', ' ').toUpperCase()}</Text>
              </div>
              <div>
                <Text fw={500}>Payment Status:</Text>
                <Badge color={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                  {selectedOrder.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </Badge>
              </div>
            </Group>

            {selectedOrder.notes && (
              <Box>
                <Text fw={500}>Notes:</Text>
                <Paper withBorder p='sm' bg='gray.0'>
                  <Text size='sm'>{selectedOrder.notes}</Text>
                </Paper>
              </Box>
            )}

            <Group mt='md'>
              <Button variant='outline' onClick={closeDetails}>
                Close
              </Button>
              <Button leftSection={<IconPrinter size={16} />}>Print Receipt</Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal opened={statusModalOpened} onClose={closeStatusModal} title='Update Order Status' size='md'>
        {selectedOrder && (
          <Stack>
            <Text>
              Current Status:
              <Badge ml='xs' color={getStatusColor(selectedOrder.status)}>
                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
              </Badge>
            </Text>

            <Select
              label='New Status'
              placeholder='Select new status'
              data={[
                { value: 'pending', label: 'Pending' },
                { value: 'processing', label: 'Processing' },
                { value: 'ready', label: 'Ready' },
                { value: 'delivered', label: 'Delivered' },
                { value: 'cancelled', label: 'Cancelled' }
              ]}
              defaultValue={selectedOrder.status}
              onChange={value => value && handleUpdateStatus(value as OrderStatus)}
            />

            <Textarea
              label='Status Note (Optional)'
              placeholder='Add a note about this status change'
              value={statusNote}
              onChange={event => setStatusNote(event.currentTarget.value)}
            />

            <Group mt='md'>
              <Button variant='outline' onClick={closeStatusModal}>
                Cancel
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
}
