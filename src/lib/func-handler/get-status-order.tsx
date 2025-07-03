import { OrderStatus } from '@prisma/client';
import { IconCircleCheck, IconClock, IconTruckDelivery, IconUxCircle } from '@tabler/icons-react';
import { LocalOrderStatus } from '../zod/EnumType';

const ORDER_STATUS_MAP: Record<
  OrderStatus | string | any,
  {
    color: string;
    text: string;
    icon: JSX.Element;
  }
> = {
  [LocalOrderStatus.COMPLETED]: {
    color: 'green',
    text: 'Hoàn thành',
    icon: <IconCircleCheck size={14} className='ml-1' color='white' />
  },
  [LocalOrderStatus.PROCESSING]: {
    color: 'yellow',
    text: 'Chưa thanh toán',
    icon: <IconClock size={14} className='ml-1' color='white' />
  },
  [LocalOrderStatus.DELIVERED]: {
    color: 'blue',
    text: 'Đang giao hàng',
    icon: <IconTruckDelivery size={14} className='ml-1' color='white' />
  },
  [LocalOrderStatus.PENDING]: {
    color: 'orange',
    text: 'Chờ xử lý',
    icon: <IconClock size={14} className='ml-1' color='white' />
  },
  [LocalOrderStatus.CANCELLED]: {
    color: 'red',
    text: 'Đã hủy',
    icon: <IconUxCircle size={14} className='ml-1' color='white' />
  }
};
export const getStatusColor = (status: any) => ORDER_STATUS_MAP[status]?.color ?? 'gray';

export const getStatusText = (status: any) => ORDER_STATUS_MAP[status]?.text ?? 'Không xác định';

export const getStatusIcon = (status: any) => ORDER_STATUS_MAP[status]?.icon ?? null;
export const getTotalOrderStatus = (mockOrders: any) => {
  const completed = mockOrders.filter((order: any) => order.status === LocalOrderStatus.COMPLETED).length || 0;
  const pending = mockOrders.filter((order: any) => order.status === LocalOrderStatus.PENDING).length || 0;
  const delivered = mockOrders.filter((order: any) => order.status === LocalOrderStatus.DELIVERED).length || 0;
  const processing = mockOrders.filter((order: any) => order.status === LocalOrderStatus.PROCESSING).length || 0;
  const canceled = mockOrders.filter((order: any) => order.status === LocalOrderStatus.CANCELLED).length || 0;
  const total = mockOrders.length || 0;
  const completionRate = (completed / total) * 100 || 0;
  return { completed, processing, canceled, completionRate, pending, delivered };
};
