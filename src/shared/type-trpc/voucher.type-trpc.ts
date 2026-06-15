import { RouterOutputs } from '~/trpc/react';

export type FindVoucher = RouterOutputs['Voucher']['find'];
export type GetAllVoucher = RouterOutputs['Voucher']['getAll'];
export type GetOneVoucher = RouterOutputs['Voucher']['getOne'];
export type GetVoucherAppliedAllVoucher = RouterOutputs['Voucher']['getVoucherAppliedAll'];
export type VoucherForUser = RouterOutputs['Voucher']['getVoucherForUser'];

//voucherForUser
