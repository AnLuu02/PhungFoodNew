import { VoucherStatus, VoucherType } from '@prisma/client';

export type Voucher = {
  id: string;

  tag?: string;

  name: string;

  description?: string;

  type: VoucherType;

  status: VoucherStatus;

  code: string;

  discountValue: number;

  maxDiscount: number;

  minOrderPrice: number;

  applyAll: boolean;

  quantity: number;

  quantityForUser: number;

  usedQuantity: number;

  availableQuantity: number;

  startDate: Date;

  endDate: Date;

  pointUser?: number;

  orderId?: string;
};
