import { Text } from '@mantine/core';
import { OrderStatus } from '@prisma/client';
import { IconCircleCheck, IconClock, IconTruckDelivery, IconUxCircle } from '@tabler/icons-react';

export const getStatusColor = (status: string) => {
  switch (status) {
    case OrderStatus.COMPLETED:
      return 'green';
    case OrderStatus.PROCESSING:
      return 'yellow';
    case OrderStatus.DELIVERED:
      return 'blue';
    case OrderStatus.PENDING:
      return 'orange';
    case OrderStatus.CANCELLED:
      return 'red';
    default:
      return 'gray';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case OrderStatus.COMPLETED:
      return (
        <Text size='xs' fw={700}>
          Hoàn thành
        </Text>
      );
    case OrderStatus.PROCESSING:
      return (
        <Text size='xs' fw={700}>
          Chưa thanh toán
        </Text>
      );
    case OrderStatus.DELIVERED:
      return (
        <Text size='xs' fw={700}>
          Đang giao hàng
        </Text>
      );
    case OrderStatus.PENDING:
      return (
        <Text size='xs' fw={700}>
          Chờ xử lý
        </Text>
      );
    case OrderStatus.CANCELLED:
      return (
        <Text size='xs' fw={700}>
          Đã hủy
        </Text>
      );
    default:
      return (
        <Text size='xs' fw={700}>
          Không xác định
        </Text>
      );
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case OrderStatus.COMPLETED:
      return <IconCircleCheck size={16} className='ml-1' color='white' />;
    case OrderStatus.PROCESSING:
      return <IconClock size={16} className='ml-1' color='white' />;
    case OrderStatus.DELIVERED:
      return <IconTruckDelivery size={16} className='ml-1' color='white' />;
    case OrderStatus.PENDING:
      return <IconClock size={16} className='ml-1' color='white' />;
    case OrderStatus.CANCELLED:
      return <IconUxCircle size={16} className='ml-1' color='white' />;
    default:
      return null;
  }
};

export const getTotalOrderStatus = (mockOrders: any) => {
  const completed = mockOrders.filter((order: any) => order.status === OrderStatus.COMPLETED).length || 0;
  const pending = mockOrders.filter((order: any) => order.status === OrderStatus.PENDING).length || 0;
  const delivered = mockOrders.filter((order: any) => order.status === OrderStatus.DELIVERED).length || 0;
  const processing = mockOrders.filter((order: any) => order.status === OrderStatus.PROCESSING).length || 0;
  const canceled = mockOrders.filter((order: any) => order.status === OrderStatus.CANCELLED).length || 0;
  const total = mockOrders.length || 0;
  const completionRate = (completed / total) * 100 || 0;
  return { completed, processing, canceled, completionRate, pending, delivered };
};
