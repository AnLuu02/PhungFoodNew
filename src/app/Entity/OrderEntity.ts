import { OrderStatus } from '@prisma/client';
import { OrderItem } from './OrderItemEntity';

export type Order = {
  id: string;

  total: number;

  status: OrderStatus;

  userId: string;

  paymentId: string;

  transactionId: string;

  orderItems: OrderItem[];
};
