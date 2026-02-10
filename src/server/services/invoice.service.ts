import { PrismaClient } from '@prisma/client';
import { ResponseTRPC } from '~/types/ResponseFetcher';

export async function findInvoices(db: PrismaClient, input: { skip: number; take: number; s?: string }) {
  const { skip, take, s } = input;
  const startPageItem = skip > 0 ? (skip - 1) * take : 0;

  const where = s?.trim()
    ? {
        OR: [
          { orderId: { contains: s, mode: 'insensitive' } },
          { salerId: { contains: s, mode: 'insensitive' } },
          { invoiceNumber: { contains: s, mode: 'insensitive' } },
          { status: { contains: s, mode: 'insensitive' } },
          { currency: { contains: s, mode: 'insensitive' } },
          { taxCode: { contains: s, mode: 'insensitive' } }
        ]
      }
    : undefined;

  const [total, totalQuery, invoices] = await db.$transaction([
    db.invoice.count(),
    db.invoice.count({ where: where as any }),
    db.invoice.findMany({
      skip: startPageItem,
      take,
      where: where as any,
      include: {
        saler: true,
        order: {
          include: {
            user: true,
            orderItems: {
              include: {
                product: {
                  include: { images: true }
                }
              }
            }
          }
        }
      }
    })
  ]);

  const totalPages = Math.ceil(s ? (totalQuery === 0 ? 1 : totalQuery / take) : total / take);
  const currentPage = skip ? Math.floor(skip / take + 1) : 1;

  return {
    invoices,
    pagination: {
      currentPage,
      totalPages
    }
  };
}

export const getInvoiceByIdOrNumber = (db: PrismaClient, s: string) => {
  const keyword = s.trim();
  return db.invoice.findFirst({
    where: {
      OR: [{ id: keyword }, { invoiceNumber: keyword }]
    }
  });
};

export const getAllInvoices = (db: PrismaClient) => {
  return db.invoice.findMany({
    include: { saler: true }
  });
};

export async function createInvoice(db: PrismaClient, input: any): Promise<ResponseTRPC> {
  const invoice = await db.invoice.create({ data: input });

  return {
    code: 'OK',
    message: 'Tạo Hóa đơn thành công.',
    data: invoice
  };
}

export async function updateInvoice(db: PrismaClient, input: any): Promise<ResponseTRPC> {
  const invoice = await db.invoice.update({
    where: { id: input.id },
    data: input
  });

  return {
    code: 'OK',
    message: 'Cập nhật Hóa đơn thành công.',
    data: invoice
  };
}

export async function deleteInvoice(db: PrismaClient, id: string): Promise<ResponseTRPC> {
  const invoice = await db.invoice.delete({
    where: { id }
  });

  return {
    code: 'OK',
    message: 'Xóa Hóa đơn thành công.',
    data: invoice
  };
}
