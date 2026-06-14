import { Prisma, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { moneyToNumber } from '~/lib/FuncHandler/Format';
import { InvoiceInput } from '~/shared/schema/invoice.schema';

export const findInvoiceService = async (
  db: PrismaClient,
  input: { page: number; limit: number; s?: string; include?: Prisma.InvoiceInclude }
) => {
  const { page, limit, s, include } = input;

  const where: Prisma.InvoiceWhereInput = {
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
  };
  const [totalInvoices, totalInvoicesQuery, invoices] = await db.$transaction([
    db.invoice.count(),
    db.invoice.count({
      where
    }),
    db.invoice.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        ...(include ?? {}),
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
    s?.trim() ? (totalInvoicesQuery == 0 ? 1 : totalInvoicesQuery / limit) : totalInvoices / limit
  );

  return {
    invoices: invoices.map(item => ({
      ...item,
      discountAmount: moneyToNumber(item.discountAmount),
      subTotal: moneyToNumber(item.subTotal),
      totalAmount: moneyToNumber(item.totalAmount),
      taxAmount: moneyToNumber(item.taxAmount),
      order: {
        ...item.order,
        discountAmount: moneyToNumber(item.order?.discountAmount),
        finalAmount: moneyToNumber(item.order?.finalAmount),
        originalAmount: moneyToNumber(item.order?.originalAmount),
        taxAmount: moneyToNumber(item.order?.taxAmount),
        shippingAmount: moneyToNumber(item.order?.shippingAmount),
        orderItems: item.order?.orderItems.map(orItem => ({
          ...orItem,
          price: moneyToNumber(orItem.price),
          product: {
            ...orItem.product,
            price: moneyToNumber(orItem.product.price),
            discount: moneyToNumber(orItem.product.discount)
          }
        }))
      }
    })),
    pagination: {
      hasNext: Boolean(totalPages > page),
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
      before: deleted
        ? {
            ...deleted,
            discountAmount: moneyToNumber(deleted.discountAmount),
            subTotal: moneyToNumber(deleted.subTotal),
            totalAmount: moneyToNumber(deleted.totalAmount),
            taxAmount: moneyToNumber(deleted.taxAmount)
          }
        : {},
      after: {}
    }
  };
};

export const getOneInvoiceService = async (
  db: PrismaClient,
  input: { key: string; include?: Prisma.InvoiceInclude }
) => {
  try {
    const { key, include } = input;

    const invoice = await db.invoice.findUnique({
      where: {
        id: key
      },
      include
    });
    if (!invoice) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Opps! Có vẻ như hóa đơn không tồn tại.'
      });
    }
    return {
      ...invoice,
      discountAmount: moneyToNumber(invoice.discountAmount),
      subTotal: moneyToNumber(invoice.subTotal),
      totalAmount: moneyToNumber(invoice.totalAmount),
      taxAmount: moneyToNumber(invoice.taxAmount)
    };
  } catch {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Opps! Có vẻ như hóa đơn không tồn tại.'
    });
  }
};
export const getAllInvoiceService = async (db: PrismaClient, input?: { include?: Prisma.InvoiceInclude }) => {
  const invoices = await db.invoice.findMany({
    include: { ...(input?.include ?? {}), seller: true }
  });
  return invoices.map(item => ({
    ...item,
    discountAmount: moneyToNumber(item.discountAmount),
    subTotal: moneyToNumber(item.subTotal),
    totalAmount: moneyToNumber(item.totalAmount),
    taxAmount: moneyToNumber(item.taxAmount)
  }));
};

export const upsertInvoiceService = async (
  db: PrismaClient,
  input: InvoiceInput,
  where?: Prisma.InvoiceWhereUniqueInput
) => {
  const { id, ...data } = input;
  const result = await db.$transaction(async tx => {
    const oldData = id ? await tx.invoice.findUnique({ where: { id } }) : null;
    const newData = await tx.invoice.upsert({
      where: where ?? {
        id: id || ''
      },
      create: data,
      update: data
    });
    return {
      oldData: oldData
        ? {
            ...oldData,
            discountAmount: moneyToNumber(oldData.discountAmount),
            subTotal: moneyToNumber(oldData.subTotal),
            totalAmount: moneyToNumber(oldData.totalAmount),
            taxAmount: moneyToNumber(oldData.taxAmount)
          }
        : {},
      newData: newData
        ? {
            ...newData,
            discountAmount: moneyToNumber(newData.discountAmount),
            subTotal: moneyToNumber(newData.subTotal),
            totalAmount: moneyToNumber(newData.totalAmount),
            taxAmount: moneyToNumber(newData.taxAmount)
          }
        : {}
    };
  });

  return {
    metaData: {
      before: result.oldData ?? {},
      after: result.newData
    }
  };
};
