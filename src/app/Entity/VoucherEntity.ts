import { VoucherType } from '@prisma/client';
import { Product } from './ProductEntity';

export type Voucher = {
  id: string;

  tag: string;

  name: string;

  description?: string;

  type: VoucherType;

  discountValue: number;

  maxDiscount: number;

  minOrderPrice: number;

  applyAll: boolean;

  quantity: number;

  usedQuantity: number;

  availableQuantity: number;

  startDate: Date;

  endDate: Date;

  vipLevel?: number;

  orderId?: string;

  products: Product[];
};
