import { Prisma, PrismaClient, VoucherType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { moneyToNumber } from '~/lib/FuncHandler/Format';
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
    vouchers: vouchers.map(v => ({
      ...v,
      minOrderPrice: moneyToNumber(v.minOrderPrice),
      discountValue: moneyToNumber(v.discountValue),
      maxDiscount: moneyToNumber(v.maxDiscount)
    })),
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
      before: deleted
        ? {
            ...deleted,
            discountValue: moneyToNumber(deleted.discountValue),
            maxDiscount: moneyToNumber(deleted.maxDiscount),
            minOrderPrice: moneyToNumber(deleted.minOrderPrice)
          }
        : {},
      after: {}
    }
  };
};
export const getAllVoucherService = async (db: PrismaClient, input?: { include?: Prisma.VoucherInclude }) => {
  const vouchers = await db.voucher.findMany({ include: input?.include });
  return vouchers.map(v => ({
    ...v,
    discountValue: moneyToNumber(v.discountValue),
    maxDiscount: moneyToNumber(v.maxDiscount),
    minOrderPrice: moneyToNumber(v.minOrderPrice)
  }));
};
export const getVoucherAppliedAllService = async (db: PrismaClient, input?: { include?: Prisma.VoucherInclude }) => {
  const vouhcers = await db.voucher.findMany({ where: { applyAll: true }, include: input?.include });
  return vouhcers.map(v => ({
    ...v,
    maxDiscount: moneyToNumber(v.maxDiscount),
    minOrderPrice: moneyToNumber(v.minOrderPrice),
    discountValue: moneyToNumber(v.discountValue)
  }));
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
  if (!voucher) throw new TRPCError({ code: 'NOT_FOUND', message: 'Oops! Có vẻ như voucher không tồn tại.' });
  return {
    ...voucher,
    maxDiscount: moneyToNumber(voucher.maxDiscount),
    minOrderPrice: moneyToNumber(voucher.minOrderPrice),
    discountValue: moneyToNumber(voucher.discountValue)
  };
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
  const vouchers = await db.voucher.findMany({
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
      voucherForUser: {
        select: {
          id: true,
          userId: true,
          quantityForUser: true
        }
      }
    }
  });
  return vouchers.map(v => ({
    ...v,
    maxDiscount: moneyToNumber(v.maxDiscount),
    minOrderPrice: moneyToNumber(v.minOrderPrice),
    discountValue: moneyToNumber(v.discountValue)
  }));
};

export const upsertVoucherService = async (
  db: PrismaClient,
  input: { where: Prisma.VoucherWhereUniqueInput; data: Prisma.VoucherUpdateInput }
) => {
  try {
    const existed = await db.voucher.findFirst({
      where: input.where
    });

    if (!existed || (existed && existed?.id == input?.where?.id)) {
      const updateVoucher = await db.voucher.update({
        where: input.where,
        data: input.data
      });
      return {
        metaData: {
          before: existed
            ? {
                ...existed,
                maxDiscount: moneyToNumber(existed.maxDiscount),
                minOrderPrice: moneyToNumber(existed.minOrderPrice),
                discountValue: moneyToNumber(existed.discountValue)
              }
            : {},
          after: {
            ...updateVoucher,
            maxDiscount: moneyToNumber(updateVoucher.maxDiscount),
            minOrderPrice: moneyToNumber(updateVoucher.minOrderPrice),
            discountValue: moneyToNumber(updateVoucher.discountValue)
          }
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
export const updateVoucherService = async (
  db: PrismaClient,
  input: { where: Prisma.VoucherWhereUniqueInput; data: Prisma.VoucherUpdateInput }
) => {
  try {
    const existed = await db.voucher.findFirst({
      where: input.where
    });

    if (!existed || (existed && existed?.id == input?.where?.id)) {
      const updateVoucher = await db.voucher.update({
        where: input.where,
        data: input.data
      });
      return {
        metaData: {
          before: existed
            ? {
                ...existed,
                maxDiscount: moneyToNumber(existed.maxDiscount),
                minOrderPrice: moneyToNumber(existed.minOrderPrice),
                discountValue: moneyToNumber(existed.discountValue)
              }
            : {},
          after: {
            ...updateVoucher,
            maxDiscount: moneyToNumber(updateVoucher.maxDiscount),
            minOrderPrice: moneyToNumber(updateVoucher.minOrderPrice),
            discountValue: moneyToNumber(updateVoucher.discountValue)
          }
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
      after: {
        ...result,
        maxDiscount: moneyToNumber(result.maxDiscount),
        minOrderPrice: moneyToNumber(result.minOrderPrice),
        discountValue: moneyToNumber(result.discountValue)
      }
    }
  };
};
