import { VoucherType } from '@prisma/client';
import { RouterOutputs } from '~/trpc/react';

export type VoucherApplyStorage = RouterOutputs['Voucher']['getVoucherForUser'][number];

export type ProductCart = {
  id: string;
  name: string;
  price: number;
  discount: number;
  thumbnail: string;
};

export type CartItem = {
  product: ProductCart;
  quantity: number;
  note?: string;
};

export type VoucherItem = {
  id: string;
  code: string;
  maxDiscount: number;
  minOrderPrice: number;
  type: VoucherType;
  discountValue: number;
};
