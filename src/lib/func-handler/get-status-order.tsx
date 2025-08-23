import { OrderStatus } from '@prisma/client';
import {
  IconCheck,
  IconCircleCheck,
  IconClock,
  IconTruck,
  IconTruckDelivery,
  IconUxCircle,
  IconX
} from '@tabler/icons-react';
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

export const getTotalOrderStatus = (orders: any[]) => {
  const objStatus = orders.reduce((acc: any, order: any) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});
  const totalOrders = orders.length || 0;
  const completionRate = (objStatus.COMPLETED / totalOrders) * 100 || 0;
  return {
    [LocalOrderStatus.COMPLETED]: objStatus.COMPLETED,
    [LocalOrderStatus.PROCESSING]: objStatus.PROCESSING,
    [LocalOrderStatus.CANCELLED]: objStatus.CANCELLED,
    completionRate,
    [LocalOrderStatus.PENDING]: objStatus.PENDING,
    [LocalOrderStatus.DELIVERED]: objStatus.DELIVERED
  };
};

export const ORDER_STATUS_UI = [
  {
    key: LocalOrderStatus.COMPLETED,
    label: 'Hoàn thành',
    color: '#008236',
    icon: <IconCheck size={22} color='#008236' />
  },
  {
    key: LocalOrderStatus.PENDING,
    label: 'Chờ xử lý',
    color: '#155DFC',
    icon: <IconClock size={22} color='#155DFC' />
  },
  {
    key: LocalOrderStatus.DELIVERED,
    label: 'Đang giao',
    color: '#009689',
    icon: <IconTruck size={22} color='#009689' />
  },
  {
    key: LocalOrderStatus.CANCELLED,
    label: 'Đã hủy',
    color: '#E7000B',
    icon: <IconX size={22} color='#E7000B' />
  },
  {
    key: LocalOrderStatus.PROCESSING,
    label: 'Chưa thanh toán',
    color: '#FF6900',
    icon: <IconClock size={22} color='#FF6900' />
  }
];
