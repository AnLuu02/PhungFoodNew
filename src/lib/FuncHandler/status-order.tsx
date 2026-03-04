import { OrderStatus } from '@prisma/client';
import {
  Icon,
  IconAlertTriangle,
  IconCheck,
  IconCircleDashedCheck,
  IconCircleX,
  IconClock,
  IconCreditCard,
  IconProps,
  IconTruck,
  IconX
} from '@tabler/icons-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export const ORDER_STATUS_MAP: Record<
  OrderStatus,
  {
    key: string;
    label: string;
    color: string;
    message: string;
    icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  }
> = {
  [OrderStatus.COMPLETED]: {
    key: OrderStatus.COMPLETED,
    label: 'Hoàn thành',
    color: '#008236',
    icon: IconCircleDashedCheck,
    message: 'Đơn hàng đã được hoàn thành thành công'
  },
  [OrderStatus.UNPAID]: {
    key: OrderStatus.UNPAID,
    label: 'Chờ thanh toán',
    color: '#FF6900',
    icon: IconClock,
    message: 'Đơn hàng của bạn chưa được thanh toán'
  },
  [OrderStatus.PENDING]: {
    key: OrderStatus.PENDING,
    label: 'Chờ xác nhận',
    color: '#155DFC',
    icon: IconClock,
    message: 'Đơn hàng của bạn đang chờ nhà hàng xác nhận.'
  },
  [OrderStatus.CONFIRMED]: {
    key: OrderStatus.CONFIRMED,
    label: 'Đã xác nhận - đang chuẩn bị',
    color: '#155DFC',
    icon: IconClock,
    message: 'Đơn hàng của bạn đã được nhà hàng xác nhận. Đang chuẩn bị hàng.'
  },
  [OrderStatus.SHIPPING]: {
    key: OrderStatus.SHIPPING,
    label: 'Đang giao hàng',
    color: '#009689',
    icon: IconTruck,
    message: 'Đơn hàng đang trên đường giao đến bạn'
  },
  [OrderStatus.CANCELLED]: {
    key: OrderStatus.CANCELLED,
    label: 'Đã hủy',
    color: '#E7000B',
    icon: IconAlertTriangle,
    message: 'Đơn hàng đã bị hủy'
  }
};

export const statusConfig: Record<OrderStatus | string | any, any> = {
  ...ORDER_STATUS_MAP,
  ERROR: {
    key: 'ERROR',
    label: 'LỖI XỬ LÝ',
    color: '#FF0000',
    icon: IconCircleX,
    message: 'Có lỗi xảy ra khi xử lý đơn hàng của bạn'
  },
  PAYMENT_FAILED: {
    key: 'PAYMENT_FAILED',
    label: 'THANH TOÁN THẤT BẠI',
    color: '#FF0000',
    icon: IconCreditCard,
    message: 'Thanh toán không thành công, vui lòng thử lại'
  }
};

export const ORDER_STATUS_UI = [
  {
    key: OrderStatus.COMPLETED,
    label: 'Hoàn thành',
    color: '#008236',
    icon: <IconCheck size={22} color='#008236' />
  },
  {
    key: OrderStatus.PENDING,
    label: 'Chờ xác nhận',
    color: '#155DFC',
    icon: <IconClock size={22} color='#155DFC' />
  },
  {
    key: OrderStatus.SHIPPING,
    label: 'Đang giao',
    color: '#009689',
    icon: <IconTruck size={22} color='#009689' />
  },
  {
    key: OrderStatus.CANCELLED,
    label: 'Đã hủy',
    color: '#E7000B',
    icon: <IconX size={22} color='#E7000B' />
  },
  {
    key: OrderStatus.UNPAID,
    label: 'Chưa thanh toán',
    color: '#FF6900',
    icon: <IconClock size={22} color='#FF6900' />
  },
  {
    key: OrderStatus.CONFIRMED,
    label: 'Đã xác nhận - Đang chuẩn bị',
    color: '#FF6900',
    icon: <IconClock size={22} color='#FF6900' />
  }
];

export const getStatusInfo = (status: OrderStatus) => {
  const { icon, color, label, message } = ORDER_STATUS_MAP[status];
  return {
    icon,
    color,
    label,
    message
  };
};

export const getTotalOrderStatus = (orders: any[]) => {
  const objStatus = orders.reduce((acc: any, order: any) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});
  const totalOrders = orders.length || 0;
  const completionRate = (objStatus.COMPLETED / totalOrders) * 100 || 0;
  return {
    [OrderStatus.COMPLETED]: objStatus.COMPLETED,
    [OrderStatus.UNPAID]: objStatus.UNPAID,
    [OrderStatus.CANCELLED]: objStatus.CANCELLED,
    completionRate,
    [OrderStatus.PENDING]: objStatus.PENDING,
    [OrderStatus.SHIPPING]: objStatus.SHIPPING,
    [OrderStatus.CONFIRMED]: objStatus.CONFIRMED,
    totalOrders
  };
};
