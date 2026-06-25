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
