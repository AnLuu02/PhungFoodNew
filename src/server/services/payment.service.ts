import { Prisma, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { seedPayments } from '~/lib/HardData/seed';
import { PaymentInput } from '~/shared/schema/payment.schema';

export const findPaymentService = async (
  db: PrismaClient,
  input: { page: number; limit: number; s?: string; include?: Prisma.PaymentInclude }
) => {
  const { page, limit, s, include } = input;
  const where: Prisma.PaymentWhereInput = {
    name: { contains: s, mode: 'insensitive' }
  };
  const [totalPayments, totalPaymentsQuery, payments] = await db.$transaction([
    db.payment.count(),
    db.payment.count({
      where
    }),
    db.payment.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
      include,
      orderBy: {
        createdAt: 'desc'
      }
    })
  ]);
  const totalPages = Math.ceil(s ? (totalPaymentsQuery == 0 ? 1 : totalPaymentsQuery / limit) : totalPayments / limit);
  return {
    payments,
    pagination: {
      hasNext: Boolean(totalPages > page),
      totalPages
    }
  };
};
export const deletePaymentService = async (db: PrismaClient, input: { id: string }) => {
  const deleted = await db.payment.delete({
    where: { id: input.id }
  });

  return {
    metaData: {
      before: deleted ?? {},
      after: {}
    }
  };
};

export const getOnePaymentService = async (
  db: PrismaClient,
  input: { id: string; include?: Prisma.PaymentInclude }
) => {
  const { id, include } = input;
  const payment = await db.payment.findUnique({
    where: {
      id
    },
    include
  });
  if (!payment) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Không có phương thức thanh toán phù hợp.'
    });
  }
  return payment;
};
export const getAllPaymentService = async (
  db: PrismaClient,
  input?: {
    include?: Prisma.PaymentInclude;
  }
) => {
  let payments = await db.payment.findMany({ include: input?.include });
  if (!payments?.length) {
    await db.payment.createMany({
      data: seedPayments
    });
    payments = await db.payment.findMany({ include: input?.include });
  }
  return payments;
};
export const upsertPaymentService = async (db: PrismaClient, input: PaymentInput) => {
  const { id, ...data } = input;
  try {
    const result = await db.$transaction(async tx => {
      const oldData = id ? await tx.payment.findUnique({ where: { id } }) : null;
      const newData = await tx.payment.upsert({
        where: { id: id || '' },
        create: data,
        update: data
      });
      return { oldData, newData };
    });
    return {
      metaData: {
        before: result.oldData ?? {},
        after: result.newData
      }
    };
  } catch {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Nhà cũng cấp đã tồn tại.'
    });
  }
};
