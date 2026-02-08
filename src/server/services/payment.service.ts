import { PrismaClient } from '@prisma/client';
import { seedPayments } from '~/lib/HardData/seed';

type FindPaymentInput = {
  skip: number;
  take: number;
  s?: string;
};

export const findPayments = async (db: PrismaClient, input: FindPaymentInput) => {
  const { skip, take, s } = input;
  const start = skip > 0 ? (skip - 1) * take : 0;

  const [total, filtered, payments] = await db.$transaction([
    db.payment.count(),
    db.payment.count({
      where: {
        name: { contains: s, mode: 'insensitive' }
      }
    }),
    db.payment.findMany({
      skip: start,
      take,
      where: {
        name: { contains: s, mode: 'insensitive' }
      }
    })
  ]);

  const totalPages = Math.ceil(s ? (filtered === 0 ? 1 : filtered / take) : total / take);
  const currentPage = skip ? Math.floor(skip / take + 1) : 1;

  return {
    payments,
    pagination: {
      currentPage,
      totalPages
    }
  };
};

export const createPayment = async (db: PrismaClient, data: any) => {
  return db.payment.create({ data });
};

export const updatePayment = async (db: PrismaClient, id: string, data: any) => {
  return db.payment.update({
    where: { id },
    data
  });
};

export const deletePayment = async (db: PrismaClient, id: string) => {
  return db.payment.delete({ where: { id } });
};

export const getPaymentByIdOrThrow = async (db: PrismaClient, s: string) => {
  const payment = await db.payment.findFirst({
    where: {
      OR: [{ id: { contains: s, mode: 'insensitive' } }]
    }
  });

  if (!payment) {
    throw new Error('Payment not found');
  }

  return payment;
};

export const getAllPaymentsWithSeed = async (db: PrismaClient) => {
  let payments = await db.payment.findMany();

  if (!payments.length) {
    await db.payment.createMany({ data: seedPayments });
    payments = await db.payment.findMany();
  }

  return payments;
};
