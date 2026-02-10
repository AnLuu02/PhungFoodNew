import { PrismaClient } from '@prisma/client';

export const findExistingVoucher = async (db: PrismaClient, id: string) => {
  return db.voucher.findFirst({
    where: {
      id
    }
  });
};
export function findVoucher() {}
export function createVoucher() {}
export function deleteVoucher() {}
export function getAllVoucher() {}
export async function getVoucherAppliedAllVoucher(db: PrismaClient) {
  return await db.voucher.findMany({ where: { applyAll: true } });
}
export function getOneVoucher() {}
export function getVoucherForUserVoucher() {}
export function useVoucherVoucher() {}
export function updateVoucher() {}
