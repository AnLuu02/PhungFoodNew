'use client';

import { Badge, Button, Card, Container, Divider, Group, List, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconCheck, IconHome, IconPrinter } from '@tabler/icons-react';
import { useState } from 'react';

const paymentData = {
  transactionId: 'TRX123456789',
  amount: 99.99,
  currency: 'USD',
  paymentMethod: 'Credit Card',
  paymentDate: new Date(),
  customerName: 'John Doe',
  orderItems: [
    { name: 'Product A', quantity: 2, price: 29.99 },
    { name: 'Product B', quantity: 1, price: 40.01 }
  ]
};
export default function PaymentResult() {
  const [isPrinting, setIsPrinting] = useState(false);
  const handlePrint = () => {
    setIsPrinting(true);
    window.print();
    setIsPrinting(false);
  };

  return (
    <Container size='sm' my='xl'>
      <Card shadow='sm' padding='lg' radius='md' withBorder>
        <Stack gap='md'>
          <Group>
            <Title order={2}>Payment Result</Title>
            <Badge size='xl' color='green' variant='light'>
              Success
            </Badge>
          </Group>

          <Divider />

          <Stack gap='xs'>
            <Text size='sm' c='dimmed'>
              Transaction ID
            </Text>
            <Text fw={500}>{paymentData.transactionId}</Text>
          </Stack>

          <Stack gap='xs'>
            <Text size='sm' c='dimmed'>
              Amount Paid
            </Text>
            <Text fw={500} size='xl'>
              {paymentData.amount.toFixed(2)} VNĐ
            </Text>
          </Stack>

          <Stack gap='xs'>
            <Text size='sm' c='dimmed'>
              Payment Method
            </Text>
            <Text>{paymentData.paymentMethod}</Text>
          </Stack>

          <Stack gap='xs'>
            <Text size='sm' c='dimmed'>
              Date & Time
            </Text>
            <Text>{paymentData.paymentDate.toLocaleString()}</Text>
          </Stack>

          <Stack gap='xs'>
            <Text size='sm' c='dimmed'>
              Customer Name
            </Text>
            <Text>{paymentData.customerName}</Text>
          </Stack>

          <Divider />

          <Stack gap='xs'>
            <Text fw={500}>Order Details</Text>
            <List
              spacing='xs'
              size='sm'
              center
              icon={
                <ThemeIcon color='teal' size={24} radius='xl'>
                  <IconCheck size='1rem' />
                </ThemeIcon>
              }
            >
              {paymentData.orderItems.map((item, index) => (
                <List.Item key={index}>
                  {item.name} x{item.quantity} - {(item.price * item.quantity).toFixed(2)} VNĐ
                </List.Item>
              ))}
            </List>
          </Stack>

          <Divider />

          <Group>
            <Button leftSection={<IconPrinter size='1rem' />} onClick={handlePrint} loading={isPrinting}>
              Print Receipt
            </Button>
            <Button variant='light' color='gray' leftSection={<IconHome size='1rem' />} component='a' href='/'>
              Back to Home
            </Button>
          </Group>
        </Stack>
      </Card>
    </Container>
  );
}
