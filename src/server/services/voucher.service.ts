import { Prisma, PrismaClient, VoucherType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { STATUS_VOUCHER } from '~/shared/constants/voucher.constants';
import { VoucherInput } from '~/shared/schema/voucher.schema';

export const findVoucherService = async (
  db: PrismaClient,
  input: {
    page: number;
    limit: number;
    filters: {
      s?: string;
      status: string[];
      type?: string;
    };
    include?: Prisma.VoucherInclude;
  }
) => {
  const {
    page,
    limit,
    filters: { s, status, type },
    include
  } = input;
  const searchQuery = s?.trim();
  const where: Prisma.VoucherWhereInput = {
    type: (type?.toUpperCase() ?? undefined) as VoucherType | undefined,
    ...(status.includes(STATUS_VOUCHER.ACTIVE)
      ? {
          isActive: true
        }
      : status.includes(STATUS_VOUCHER.INACTIVE)
        ? {
            isActive: false
          }
        : status.includes(STATUS_VOUCHER.EXPIRED)
          ? {
              endDate: {
                lt: new Date()
              }
            }
          : status.includes(STATUS_VOUCHER.SCHEDULE)
            ? {
                startDate: {
                  gt: new Date()
                }
              }
            : {}),
    OR: [
      {
        name: { contains: searchQuery, mode: 'insensitive' }
      },
      {
        description: { contains: searchQuery, mode: 'insensitive' }
      },
      { code: { contains: searchQuery, mode: 'insensitive' } }
    ]
  };
  const [totalVouchers, totalVouchersQuery, vouchers] = await db.$transaction([
    db.voucher.count(),
    db.voucher.count({
      where
    }),
    db.voucher.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
      include,
      orderBy: {
        createdAt: 'desc'
      }
    })
  ]);
  const totalPages = Math.ceil(
    searchQuery || status.length > 0 || type
      ? totalVouchersQuery == 0
        ? 1
        : totalVouchersQuery / limit
      : totalVouchers / limit
  );

  return {
    vouchers,
    pagination: {
      hasNext: Boolean(totalPages > page),
      totalPages
    }
  };
};
export const deleteVoucherService = async (db: PrismaClient, input: { id: string }) => {
  const deleted = await db.voucher.delete({
    where: { id: input.id }
  });

  return {
    metaData: {
      before: deleted ?? {},
      after: {}
    }
  };
};
export const getAllVoucherService = async (db: PrismaClient, input?: { include?: Prisma.VoucherInclude }) => {
  return await db.voucher.findMany({ include: input?.include });
};
export const getVoucherAppliedAllService = async (db: PrismaClient, input?: { include?: Prisma.VoucherInclude }) => {
  return await db.voucher.findMany({ where: { applyAll: true }, include: input?.include });
};

export const getOneVoucherService = async (
  db: PrismaClient,
  input: { id: string; include?: Prisma.VoucherInclude }
) => {
  const voucher = await db.voucher.findUnique({
    where: {
      id: input.id
    },
    include: input.include
  });
  return voucher;
};
export const getVoucherForUserService = async (
  db: PrismaClient,
  input: { userId?: string; include?: Prisma.VoucherInclude }
) => {
  let users_db = null;
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
      ...(input?.include ? input.include : {}),
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
    const existed = await db.voucher.findFirst({
      where: input.where
    });

    if (!existed || (existed && existed?.id == input?.where?.id)) {
      const updateVoucher = await db.voucher.update({
        where: input.where as Prisma.VoucherWhereUniqueInput,
        data: input.data as Prisma.VoucherUpdateInput
      });
      return {
        metaData: {
          before: existed ?? {},
          after: updateVoucher
        }
      };
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
    const existed: any = await db.voucher.findFirst({
      where: input.where
    });

    if (!existed || (existed && existed?.id == input?.where?.id)) {
      const updateVoucher = await db.voucher.update({
        where: input.where as Prisma.VoucherWhereUniqueInput,
        data: input.data as Prisma.VoucherUpdateInput
      });
      return {
        metaData: {
          before: existed ?? {},
          after: updateVoucher
        }
      };
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
  const result = await db.voucher.create({
    data: input
  });
  return {
    metaData: {
      before: {},
      after: result
    }
  };
};
