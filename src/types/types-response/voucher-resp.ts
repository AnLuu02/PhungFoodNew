import { RouterOutputs } from '~/trpc/react';

export type VoucherCreateOutput = RouterOutputs['Voucher']['create'];
export type VoucherUpdateOutput = RouterOutputs['Voucher']['update'];
export type VoucherDeleteOutput = RouterOutputs['Voucher']['delete'];
export type VoucherGetOneOutput = RouterOutputs['Voucher']['getOne'];
export type VoucherFindOutput = RouterOutputs['Voucher']['find'];
export type VoucherGetAllOutput = RouterOutputs['Voucher']['getAll'];
export type VoucherGetVoucherForUserOutput = RouterOutputs['Voucher']['getVoucherForUser'];
export type VoucherUseVoucherOutput = RouterOutputs['Voucher']['useVoucher'];
