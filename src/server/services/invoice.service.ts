import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { InvoiceInput } from '~/shared/schema/invoice.schema';

export const findInvoiceService = async (db: PrismaClient, input: { skip: number; take: number; s?: string }) => {
  const { skip, take, s } = input;

  const startPageItem = skip > 0 ? (skip - 1) * take : 0;
  const [totalInvoices, totalInvoicesQuery, invoices] = await db.$transaction([
    db.invoice.count(),
    db.invoice.count({
      where: {
        OR: [
          {
            orderId: { contains: s, mode: 'insensitive' }
          },
          {
            seller: {
              name: {
                contains: s,
                mode: 'insensitive'
              }
            }
          },
          {
            invoiceNumber: { contains: s, mode: 'insensitive' }
          },

          {
            currency: { contains: s, mode: 'insensitive' }
          },
          {
            buyerTaxCode: { contains: s, mode: 'insensitive' }
          }
        ]
      }
    }),
    db.invoice.findMany({
      skip: startPageItem,
      take,
      where: {
        OR: [
          {
            orderId: { contains: s, mode: 'insensitive' }
          },
          {
            seller: {
              name: {
                contains: s,
                mode: 'insensitive'
              }
            }
          },
          {
            invoiceNumber: { contains: s, mode: 'insensitive' }
          },
          {
            currency: { contains: s, mode: 'insensitive' }
          },
          {
            buyerTaxCode: { contains: s, mode: 'insensitive' }
          }
        ]
      },
      include: {
        seller: true,
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            address: {
              select: {
                fullAddress: true
              }
            },
            phone: true
          }
        },
        order: {
          include: {
            user: true,
            orderItems: {
              include: {
                product: {
                  include: {
                    imageForEntities: { include: { image: true } }
                  }
                }
              }
            }
          }
        }
      }
    })
  ]);
  const totalPages = Math.ceil(
    s?.trim() ? (totalInvoicesQuery == 0 ? 1 : totalInvoicesQuery / take) : totalInvoices / take
  );
  const currentPage = skip ? Math.floor(skip / take + 1) : 1;

  return {
    invoices,
    pagination: {
      currentPage,
      totalPages
    }
  };
};
export const deleteInvoiceService = async (db: PrismaClient, input: { id: string }) => {
  const deleted = await db.invoice.delete({
    where: { id: input.id }
  });
  return {
    metaData: {
      before: deleted ?? {},
      after: {}
    }
  };
};

export const getOneInvoiceService = async (db: PrismaClient, input: { id: string }) => {
  try {
    return await db.invoice.findUnique({
      where: {
        id: input.id
      }
    });
  } catch {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Opps! Có vẻ như hóa đơn không tồn tại.'
    });
  }
};
export const getAllInvoiceService = async (db: PrismaClient) => {
  return await db.invoice.findMany({
    include: {
      seller: true
    }
  });
};

export const upsertInvoiceService = async (db: PrismaClient, input: InvoiceInput) => {
  const { id, ...data } = input;
  const result = await db.$transaction(async tx => {
    const oldData = id ? await tx.invoice.findUnique({ where: { id } }) : null;
    const newData = await tx.invoice.upsert({
      where: {
        id: id || ''
      },
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
};
