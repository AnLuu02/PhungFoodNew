import { OrderStatus } from '@prisma/client';
import { Delivery } from './delivery';
import { OrderItem } from './orderItem';

export type Order = {
  id: string;

  total: number;

  status: OrderStatus;

  userId: string;

  note?: string;

  paymentId: string;

  transactionId: string;

  orderItems: OrderItem[];

  delivery: Delivery;
};
