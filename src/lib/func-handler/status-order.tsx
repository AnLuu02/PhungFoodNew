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
import { LocalOrderStatus } from '../zod/EnumType';

export const ORDER_STATUS_MAP: Record<
  LocalOrderStatus,
  {
    key: string;
    label: string;
    color: string;
    message: string;
    icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  }
> = {
  [LocalOrderStatus.COMPLETED]: {
    key: LocalOrderStatus.COMPLETED,
    label: 'HOÀN THÀNH',
    color: '#008236',
    icon: IconCircleDashedCheck,
    message: 'Đơn hàng đã được hoàn thành thành công'
  },
  [LocalOrderStatus.UNPAID]: {
    key: LocalOrderStatus.UNPAID,
    label: 'CHỜ THANH TOÁN',
    color: '#FF6900',
    icon: IconClock,
    message: 'Đơn hàng của bạn chưa được thanh toán'
  },
  [LocalOrderStatus.PENDING]: {
    key: LocalOrderStatus.PENDING,
    label: 'CHỜ XÁC NHẬN',
    color: '#155DFC',
    icon: IconClock,
    message: 'Đơn hàng của bạn đang chờ nhà hàng xác nhận.'
  },
  [LocalOrderStatus.CONFIRMED]: {
    key: LocalOrderStatus.CONFIRMED,
    label: 'ĐÃ XÁC NHẬN - ĐANG CHUẨN BỊ',
    color: '#155DFC',
    icon: IconClock,
    message: 'Đơn hàng của bạn đã được nhà hàng xác nhận. Đang chuẩn bị hàng.'
  },
  [LocalOrderStatus.SHIPPING]: {
    key: LocalOrderStatus.SHIPPING,
    label: 'ĐANG GIAO HÀNG',
    color: '#009689',
    icon: IconTruck,
    message: 'Đơn hàng đang trên đường giao đến bạn'
  },
  [LocalOrderStatus.CANCELLED]: {
    key: LocalOrderStatus.CANCELLED,
    label: 'ĐÃ HỦY',
    color: '#E7000B',
    icon: IconAlertTriangle,
    message: 'Đơn hàng đã bị hủy'
  }
};

export const statusConfig: Record<LocalOrderStatus | string | any, any> = {
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
    key: LocalOrderStatus.COMPLETED,
    label: 'Hoàn thành',
    color: '#008236',
    icon: <IconCheck size={22} color='#008236' />
  },
  {
    key: LocalOrderStatus.PENDING,
    label: 'Chờ xác nhận',
    color: '#155DFC',
    icon: <IconClock size={22} color='#155DFC' />
  },
  {
    key: LocalOrderStatus.SHIPPING,
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
    key: LocalOrderStatus.UNPAID,
    label: 'Chưa thanh toán',
    color: '#FF6900',
    icon: <IconClock size={22} color='#FF6900' />
  },
  {
    key: LocalOrderStatus.CONFIRMED,
    label: 'Đã xác nhận - Đang chuẩn bị',
    color: '#FF6900',
    icon: <IconClock size={22} color='#FF6900' />
  }
];

export const getStatusInfo = (status: LocalOrderStatus) => {
  const icon = ORDER_STATUS_MAP[status as LocalOrderStatus]?.icon;
  const color = ORDER_STATUS_MAP[status as LocalOrderStatus]?.color;
  const label = ORDER_STATUS_MAP[status as LocalOrderStatus]?.label;
  const message = ORDER_STATUS_MAP[status as LocalOrderStatus]?.message;
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
    [LocalOrderStatus.COMPLETED]: objStatus.COMPLETED,
    [LocalOrderStatus.UNPAID]: objStatus.UNPAID,
    [LocalOrderStatus.CANCELLED]: objStatus.CANCELLED,
    completionRate,
    [LocalOrderStatus.PENDING]: objStatus.PENDING,
    [LocalOrderStatus.SHIPPING]: objStatus.SHIPPING,
    [LocalOrderStatus.CONFIRMED]: objStatus.CONFIRMED,
    totalOrders
  };
};
