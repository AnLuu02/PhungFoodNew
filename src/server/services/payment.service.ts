import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { seedPayments } from '~/lib/HardData/seed';
import { PaymentInput } from '~/shared/schema/payment.schema';

export const findPaymentService = async (db: PrismaClient, input: { skip: number; take: number; s?: string }) => {
  const { skip, take, s } = input;
  const startPageItem = skip > 0 ? (skip - 1) * take : 0;
  const [totalPayments, totalPaymentsQuery, payments] = await db.$transaction([
    db.payment.count(),
    db.payment.count({
      where: {
        name: { contains: s, mode: 'insensitive' }
      }
    }),
    db.payment.findMany({
      skip: startPageItem,
      take,
      where: {
        name: { contains: s, mode: 'insensitive' }
      }
    })
  ]);
  const totalPages = Math.ceil(s ? (totalPaymentsQuery == 0 ? 1 : totalPaymentsQuery / take) : totalPayments / take);
  const currentPage = skip ? Math.floor(skip / take + 1) : 1;
  return {
    payments,
    pagination: {
      currentPage,
      totalPages
    }
  };
};
export const deletePaymentService = async (db: PrismaClient, input: { id: string }) => {
  const payment = await db.payment.delete({
    where: { id: input.id }
  });

  return payment;
};

export const getOnePaymentService = async (db: PrismaClient, input: { id: string }) => {
  const { id } = input;
  const payment = await db.payment.findUnique({
    where: {
      id
    }
  });
  if (!payment) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Không có phương thức thanh toán phù hợp.'
    });
  }
  return payment;
};
export const getAllPaymentService = async (db: PrismaClient) => {
  let payments = await db.payment.findMany();
  if (!payments?.length) {
    await db.payment.createMany({
      data: seedPayments
    });
    payments = await db.payment.findMany();
  }
  return payments;
};
export const upsertPaymentService = async (db: PrismaClient, input: PaymentInput) => {
  const { id, ...data } = input;
  try {
    const payment = await db.payment.upsert({
      where: { id: id || '' },
      create: data,
      update: data
    });
    return payment;
  } catch {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Nhà cũng cấp đã tồn tại.'
    });
  }
};
