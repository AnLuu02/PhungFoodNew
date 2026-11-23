import { Prisma, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import dayjs from 'dayjs';

type ReserveVoucherInput = {
  userId: string;
  orderId: string;
  vouchers: {
    voucherId: string;
    discountAmount: number;
  }[];
};

export const reserveVoucherService = async (
  db: PrismaClient | Prisma.TransactionClient,
  input: ReserveVoucherInput
) => {
  const { userId, orderId, vouchers } = input;

  const voucherIds = vouchers.map(v => v.voucherId);

  if (voucherIds.length === 0) {
    return [];
  }

  const uniqueVoucherIds = Array.from(new Set(voucherIds));

  if (uniqueVoucherIds.length !== voucherIds.length) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Có voucher bị chọn trùng trong đơn hàng.'
    });
  }

  const now = dayjs();

  let records = await db.voucherForUser.findMany({
    where: {
      userId,
      voucherId: {
        in: uniqueVoucherIds
      }
    },
    include: {
      voucher: {
        select: {
          id: true,
          code: true,
          discountValue: true,
          startDate: true,
          endDate: true,
          isActive: true,
          applyAll: true,
          quantityForUser: true,
          availableQuantity: true,
          usedQuantity: true
        }
      }
    }
  });

  if (records.length < uniqueVoucherIds.length) {
    const existingVoucherIds = new Set(records.map(r => r.voucherId));

    const missingVoucherIds = uniqueVoucherIds.filter(id => !existingVoucherIds.has(id));

    const missingVouchers = await db.voucher.findMany({
      where: {
        id: {
          in: missingVoucherIds
        }
      },
      select: {
        id: true,
        applyAll: true,
        quantityForUser: true
      }
    });

    const applyAllVouchers = missingVouchers.filter(v => v.applyAll);

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
        where: {
          userId,
          voucherId: {
            in: uniqueVoucherIds
          }
        },
        include: {
          voucher: {
            select: {
              id: true,
              code: true,
              discountValue: true,
              startDate: true,
              endDate: true,
              isActive: true,
              applyAll: true,
              quantityForUser: true,
              availableQuantity: true,
              usedQuantity: true
            }
          }
        }
      });
    }
  }

  if (records.length < uniqueVoucherIds.length) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Có voucher không hợp lệ cho user này.'
    });
  }

  const invalidVouchers: {
    status: 'inactive' | 'schedule' | 'expired' | 'endOfTurn' | 'soldOut';
    voucher: unknown;
  }[] = [];

  for (const record of records) {
    const voucher = record.voucher;

    if (!voucher || !voucher.isActive) {
      invalidVouchers.push({
        status: 'inactive',
        voucher: record
      });
      continue;
    }

    if (voucher.startDate && dayjs(voucher.startDate).isAfter(now)) {
      invalidVouchers.push({
        status: 'schedule',
        voucher: record
      });
      continue;
    }

    if (voucher.endDate && dayjs(voucher.endDate).isBefore(now)) {
      invalidVouchers.push({
        status: 'expired',
        voucher: record
      });
      continue;
    }

    if (record.quantityForUser <= 0) {
      invalidVouchers.push({
        status: 'endOfTurn',
        voucher: record
      });
      continue;
    }

    if (typeof voucher.availableQuantity === 'number' && voucher.availableQuantity <= 0) {
      invalidVouchers.push({
        status: 'soldOut',
        voucher: record
      });
      continue;
    }
  }

  if (invalidVouchers.length > 0) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Một số voucher không hợp lệ.',
      cause: invalidVouchers
    });
  }

  const existedUsages = await db.voucherUsage.findMany({
    where: {
      orderId,
      voucherId: {
        in: uniqueVoucherIds
      }
    },
    select: {
      voucherId: true
    }
  });

  if (existedUsages.length > 0) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Voucher đã được giữ chỗ cho đơn hàng này.'
    });
  }

  for (const voucherId of uniqueVoucherIds) {
    const userQuotaUpdated = await db.voucherForUser.updateMany({
      where: {
        userId,
        voucherId,
        quantityForUser: {
          gt: 0
        }
      },
      data: {
        quantityForUser: {
          decrement: 1
        }
      }
    });

    if (userQuotaUpdated.count !== 1) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Voucher của bạn vừa hết lượt sử dụng.'
      });
    }

    const voucherUpdated = await db.voucher.updateMany({
      where: {
        id: voucherId,
        availableQuantity: {
          gt: 0
        }
      },
      data: {
        availableQuantity: {
          decrement: 1
        }
      }
    });

    if (voucherUpdated.count !== 1) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Voucher vừa hết số lượng.'
      });
    }
  }

  const discountAmountMap = new Map(vouchers.map(v => [v.voucherId, v.discountAmount]));

  await db.voucherUsage.createMany({
    data: records.map(record => ({
      userId,
      orderId,
      voucherId: record.voucherId ?? '',
      code: record.voucher?.code ?? 'GIAMGIA',
      discount: discountAmountMap.get(record.voucherId ?? '') ?? 0,
      status: 'PENDING'
    })),
    skipDuplicates: true
  });

  return records.map(record => ({
    status: 'reserved' as const,
    voucher: record
  }));
};

export const confirmVoucherUsageService = async (
  db: PrismaClient | Prisma.TransactionClient,
  input: {
    userId: string;
    orderId: string;
  }
) => {
  const usages = await db.voucherUsage.findMany({
    where: {
      userId: input.userId,
      orderId: input.orderId,
      status: 'PENDING'
    },
    select: {
      id: true,
      voucherId: true
    }
  });

  if (usages.length === 0) {
    return [];
  }

  await db.voucherUsage.updateMany({
    where: {
      userId: input.userId,
      orderId: input.orderId,
      status: 'PENDING'
    },
    data: {
      status: 'USED',
      usedAt: new Date()
    }
  });

  for (const usage of usages) {
    await db.voucher.update({
      where: {
        id: usage.voucherId
      },
      data: {
        usedQuantity: {
          increment: 1
        }
      }
    });
  }

  return usages;
};

export const releaseVoucherUsageService = async (
  db: PrismaClient | Prisma.TransactionClient,
  input: {
    userId: string;
    orderId: string;
  }
) => {
  const usages = await db.voucherUsage.findMany({
    where: {
      userId: input.userId,
      orderId: input.orderId,
      status: 'PENDING'
    },
    select: {
      id: true,
      voucherId: true
    }
  });

  if (usages.length === 0) {
    return [];
  }

  await db.voucherUsage.updateMany({
    where: {
      userId: input.userId,
      orderId: input.orderId,
      status: 'PENDING'
    },
    data: {
      status: 'RELEASED',
      releasedAt: new Date()
    }
  });

  for (const usage of usages) {
    await db.voucher.update({
      where: {
        id: usage.voucherId
      },
      data: {
        availableQuantity: {
          increment: 1
        }
      }
    });

    await db.voucherForUser.updateMany({
      where: {
        userId: input.userId,
        voucherId: usage.voucherId
      },
      data: {
        quantityForUser: {
          increment: 1
        }
      }
    });
  }

  return usages;
};
