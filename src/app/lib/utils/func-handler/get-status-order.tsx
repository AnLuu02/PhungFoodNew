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
      return 'Hoàn thành';
    case OrderStatus.PROCESSING:
      return 'Chưa thanh toán';
    case OrderStatus.DELIVERED:
      return 'Đang giao hàng';
    case OrderStatus.PENDING:
      return 'Chờ xử lý';
    case OrderStatus.CANCELLED:
      return 'Đã hủy';
    default:
      return 'Không xác định';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case OrderStatus.COMPLETED:
      return <IconCircleCheck size={14} className='ml-1' color='white' />;
    case OrderStatus.PROCESSING:
      return <IconClock size={14} className='ml-1' color='white' />;
    case OrderStatus.DELIVERED:
      return <IconTruckDelivery size={14} className='ml-1' color='white' />;
    case OrderStatus.PENDING:
      return <IconClock size={14} className='ml-1' color='white' />;
    case OrderStatus.CANCELLED:
      return <IconUxCircle size={14} className='ml-1' color='white' />;
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
