import { Prisma, PrismaClient } from '@prisma/client';
import { buildSortFilter, updatepointUser, updateRevenue, updateSales } from '~/lib/FuncHandler/PrismaHelper';
import { LocalOrderStatus } from '~/lib/ZodSchema/enum';

type FindOrderInput = {
  skip: number;
  take: number;
  s?: string;
  filter?: string | null;
  sort?: string[];
};

const buildSearchWhere = (input: FindOrderInput) => {
  const { s, filter } = input;
  return {
    OR: [
      {
        payment: {
          name: { contains: s?.trim(), mode: 'insensitive' }
        }
      },
      {
        user: {
          name: { contains: s?.trim(), mode: 'insensitive' }
        }
      },
      {
        originalTotal: { equals: Number(s) || 0 }
      },
      {
        discountAmount: { equals: Number(s) || 0 }
      },
      {
        finalTotal: { equals: Number(s) || 0 }
      }
    ],
    status: filter ? { equals: filter.trim() as LocalOrderStatus } : undefined
  };
};

export const findOrders = async (db: PrismaClient, input: FindOrderInput) => {
  const { skip, take, sort } = input;
  const start = skip > 0 ? (skip - 1) * take : 0;
  const where = buildSearchWhere(input);
  const orderBy = sort && sort.length > 0 ? buildSortFilter(sort, ['finalTotal']) : undefined;

  const [total, filtered, orders] = await db.$transaction([
    db.order.count(),
    db.order.count({ where: where as any, orderBy }),
    db.order.findMany({
      skip: start,
      take,
      where: where as any,
      orderBy,
      include: {
        payment: true,
        user: { include: { image: true, address: true } },
        delivery: { include: { address: true } },
        orderItems: {
          include: {
            product: { include: { images: true } }
          }
        },
        vouchers: true
      }
    })
  ]);

  const totalPages = Math.ceil(Object.values(input).length > 2 ? (filtered || 1) / take : total / take);
  const currentPage = skip ? Math.floor(skip / take + 1) : 1;

  return {
    orders,
    pagination: { currentPage, totalPages }
  };
};

export const createOrder = async (db: PrismaClient, ctx: any, input: any) => {
  const order = await db.order.create({
    data: {
      originalTotal: Number(input.originalTotal) || 0,
      discountAmount: Number(input.discountAmount) || 0,
      finalTotal: Number(input.finalTotal) || 0,
      status: input.status,
      userId: input.userId,
      paymentId: input.paymentId,
      delivery: input.delivery
        ? {
            create: {
              ...input.delivery,
              address: { create: input.delivery.address }
            }
          }
        : undefined,
      transactionId: input.transactionId,
      orderItems: {
        createMany: { data: input.orderItems }
      },
      vouchers: {
        connect: input.voucherIds.map((id: string) => ({ id }))
      }
    },
    include: { orderItems: true }
  });

  await handleCompletedOrder(ctx, order);

  return order;
};

export const updateOrder = async (
  db: PrismaClient,
  ctx: any,
  where: Prisma.OrderWhereUniqueInput,
  data: Prisma.OrderUpdateInput
) => {
  const order = await db.order.update({
    where,
    data,
    include: { orderItems: true }
  });

  await handleCompletedOrder(ctx, order);

  return order;
};

const handleCompletedOrder = async (ctx: any, order: any) => {
  if (!order || order.status !== LocalOrderStatus.COMPLETED) return;

  updateRevenue(ctx, order.status, order.userId, order);
  updatepointUser(ctx, order.userId, order.finalTotal);

  await Promise.all(order.orderItems.map((item: any) => updateSales(ctx, order.status, item.productId, item.quantity)));
};

export const getOrderByFilter = async (db: PrismaClient, s: string, period?: number) => {
  const search = s.trim();

  const where = {
    AND: [
      period
        ? {
            createdAt: {
              gte: new Date(Date.now() - period * 86400000),
              lte: new Date()
            }
          }
        : undefined,
      {
        OR: [{ id: search }, { user: { email: { equals: search } } }]
      }
    ].filter(Boolean)
  };

  return db.order.findMany({
    where: where as any,
    include: {
      orderItems: {
        include: {
          product: { include: { images: true } }
        }
      },
      vouchers: true,
      user: { include: { image: true, address: true } },
      payment: true,
      delivery: { include: { address: true } }
    }
  });
};

export const getOrderByIdOrEmail = async (db: PrismaClient, s: string) => {
  return db.order.findFirst({
    where: {
      OR: [
        { id: s.trim() },
        {
          user: {
            email: {
              contains: s.trim(),
              mode: 'insensitive'
            }
          }
        }
      ]
    },
    include: {
      orderItems: {
        include: {
          product: { include: { images: true } }
        }
      },
      vouchers: true,
      user: { include: { image: true, address: true } },
      payment: true,
      delivery: { include: { address: true } }
    }
  });
};

export const getAllOrders = async (db: PrismaClient) => {
  return db.order.findMany({
    include: {
      orderItems: true,
      user: {
        select: { id: true, name: true, email: true }
      }
    }
  });
};

export const deleteOrder = async (db: PrismaClient, id: string) => {
  return db.order.delete({ where: { id } });
};
