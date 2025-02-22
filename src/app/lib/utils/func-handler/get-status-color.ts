import { OrderStatus } from '@prisma/client';

export const getStatusColor = (status: string) => {
  switch (status) {
    case OrderStatus.COMPLETED:
      return 'green';
    case OrderStatus.PENDING:
      return 'yellow';
    case OrderStatus.CANCELLED:
      return 'red';
    default:
      return 'gray';
  }
};
