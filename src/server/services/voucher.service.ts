import { Prisma, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { VoucherInput } from '~/shared/schema/voucher.schema';

export const findVoucherService = async (db: PrismaClient, input: { skip: number; take: number; s?: string }) => {
  const { skip, take, s } = input;
  const startPageItem = skip > 0 ? (skip - 1) * take : 0;
  const [totalVouchers, totalVouchersQuery, vouchers] = await db.$transaction([
    db.voucher.count(),
    db.voucher.count({
      where: {
        OR: [
          {
            name: { contains: s?.trim(), mode: 'insensitive' }
          },
          {
            description: { contains: s?.trim(), mode: 'insensitive' }
          }
        ]
      }
    }),
    db.voucher.findMany({
      skip: startPageItem,
      take,
      where: {
        OR: [
          {
            name: { contains: s?.trim(), mode: 'insensitive' }
          },
          {
            description: { contains: s?.trim(), mode: 'insensitive' }
          }
        ]
      }
    })
  ]);
  const totalPages = Math.ceil(
    s?.trim() ? (totalVouchersQuery == 0 ? 1 : totalVouchersQuery / take) : totalVouchers / take
  );
  const currentPage = skip ? Math.floor(skip / take + 1) : 1;

  return {
    vouchers,
    pagination: {
      currentPage,
      totalPages
    }
  };
};
export const deleteVoucherService = async (db: PrismaClient, input: { id: string }) => {
  const voucher = await db.voucher.delete({
    where: { id: input.id }
  });

  return voucher;
};
export const getAllVoucherService = async (db: PrismaClient) => {
  return await db.voucher.findMany({});
};
export const getVoucherAppliedAllService = async (db: PrismaClient) => {
  return await db.voucher.findMany({ where: { applyAll: true } });
};

export const getOneVoucherService = async (db: PrismaClient, input: { id: string }) => {
  const voucher = await db.voucher.findUnique({
    where: {
      id: input.id
    }
  });
  return voucher;
};
export const getVoucherForUserService = async (db: PrismaClient, input: { userId?: string }) => {
  let users_db: any;
  if (input.userId && input.userId !== '') {
    users_db = await db.user.findUnique({
      where: {
        id: input.userId
      },
      select: { pointUser: true }
    });
  }
  const voucher = await db.voucher.findMany({
    where: {
      isActive: true,
      startDate: {
        lte: new Date()
      },
      endDate: {
        gte: new Date()
      },
      OR: [
        { applyAll: true },
        {
          voucherForUser: {
            some: {
              userId: input.userId
            }
          }
        },
        {
          pointUser: users_db?.pointUser
            ? {
                lte: users_db.pointUser
              }
            : undefined
        }
      ]
    },
    include: {
      voucherForUser: true
    }
  });
  return voucher;
};
export const useVoucherService = async (db: PrismaClient, input: { userId: string; voucherIds: string[] }) => {
  const { userId, voucherIds } = input;
  let records = await db.voucherForUser.findMany({
    where: {
      userId,
      voucherId: { in: voucherIds }
    }
  });

  if (records.length < voucherIds.length) {
    const missingVoucherIds = voucherIds.filter(v => !records.some(r => r.voucherId === v));

    if (missingVoucherIds.length > 0) {
      const vouchers = await db.voucher.findMany({
        where: { id: { in: missingVoucherIds } },
        select: { id: true, applyAll: true, quantityForUser: true }
      });

      const applyAllVouchers = vouchers.filter(v => v.applyAll);

      if (applyAllVouchers.length > 0) {
        await db.voucherForUser.createMany({
          data: applyAllVouchers.map(v => ({
            userId,
            voucherId: v.id,
            quantityForUser: v.quantityForUser ?? 1
          })),
          skipDuplicates: true
        });

        records = await db.voucherForUser.findMany({
          where: { userId, voucherId: { in: voucherIds } }
        });
      }
    }
  }

  if (records.length < voucherIds.length) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Có voucher không hợp lệ cho user này'
    });
  }

  records.forEach(r => {
    if (r.quantityForUser <= 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Voucher ${r.voucherId} đã hết lượt sử dụng`
      });
    }
  });

  await db.$transaction([
    db.voucherForUser.updateMany({
      where: {
        userId,
        voucherId: { in: voucherIds }
      },
      data: { quantityForUser: { decrement: 1 } }
    }),
    db.voucher.updateMany({
      where: {
        id: { in: voucherIds }
      },
      data: {
        usedQuantity: { increment: 1 },
        availableQuantity: { decrement: 1 }
      }
    })
  ]);

  return records;
};
export const upsertVoucherService = async (db: PrismaClient, input: { where: any; data: any }) => {
  try {
    const existingVoucher: any = await db.voucher.findFirst({
      where: input.where
    });

    if (!existingVoucher || (existingVoucher && existingVoucher?.id == input?.where?.id)) {
      const updateVoucher = await db.voucher.update({
        where: input.where as Prisma.VoucherWhereUniqueInput,
        data: input.data as Prisma.VoucherUpdateInput
      });
      return updateVoucher;
    }

    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Khuyến mãi đã tồn tại. Hãy thử lại.'
    });
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Opps! Chờ mốt chút, có gì đó đã xảy ra.'
    });
  }
};

export const updateVoucherService = async (db: PrismaClient, input: { where: any; data: any }) => {
  try {
    const existingVoucher: any = await db.voucher.findFirst({
      where: input.where
    });

    if (!existingVoucher || (existingVoucher && existingVoucher?.id == input?.where?.id)) {
      const updateVoucher = await db.voucher.update({
        where: input.where as Prisma.VoucherWhereUniqueInput,
        data: input.data as Prisma.VoucherUpdateInput
      });
      return updateVoucher;
    }

    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Khuyến mãi đã tồn tại. Hãy thử lại.'
    });
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Opps! Chờ mốt chút, có gì đó đã xảy ra.'
    });
  }
};

export const createVoucherService = async (db: PrismaClient, input: VoucherInput) => {
  return await db.voucher.create({
    data: input
  });
};
