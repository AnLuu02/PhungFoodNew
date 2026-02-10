import { RouterOutputs } from '~/trpc/react';

export type CategoryFind = RouterOutputs['Category']['find'];
export type CategoryAll = RouterOutputs['Category']['getAll'];
export type CategoryOne = RouterOutputs['Category']['getOne'];
export type CategoryFilter = RouterOutputs['Category']['getFilter'];

export type SubCategoryFind = RouterOutputs['SubCategory']['find'];
export type SubCategoryAll = RouterOutputs['SubCategory']['getAll'];

export type MaterialAll = RouterOutputs['Material']['getAll'];

export type ProductFind = RouterOutputs['Product']['find'];
export type ProductAll = RouterOutputs['Product']['getAll'];
export type ProductFilter = RouterOutputs['Product']['getFilter'];
export type ProductOne = RouterOutputs['Product']['getOne'];

export type CartItem = ProductOne & { note?: string; quantity: number };

export type UserAll = RouterOutputs['User']['getAll'];
export type UserOne = RouterOutputs['User']['getOne'];

export type VoucherForUser = RouterOutputs['Voucher']['getVoucherForUser'];

export type OrderFilter = RouterOutputs['Order']['getFilter'];
export type OrderOne = RouterOutputs['Order']['getOne'];

export type OrderItem = NonNullable<OrderOne>['orderItems'][0];

export type FavouriteFilter = RouterOutputs['FavouriteFood']['getFilter'];

export type ReviewFind = RouterOutputs['Review']['find'];
export type ReviewAll = RouterOutputs['Review']['getAll'];

export type RolePermissionOne = RouterOutputs['RolePermission']['getOne'];
export type RolePermissionAll = RouterOutputs['RolePermission']['getAllPermission'];

//page
export type InitProductDetail = RouterOutputs['Page']['getInitProductDetail'];
export type InitReport = RouterOutputs['Page']['getInitReport'];
