import { AddressType, InvoiceStatus, OrderStatus, Prisma, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';

import { buildSortFilter, updatepointUser, updateRevenue, updateSales } from '~/lib/FuncHandler/PrismaHelper';
import { OrderInput } from '~/shared/schema/order.schema';

export const findOrderService = async (
  db: PrismaClient,
  input: {
    skip: number;
    take: number;
    s?: string;
    filter?: any;
    sort?: any;
  }
) => {
  const { skip, take, s, filter, sort } = input;

  const startPageItem = skip > 0 ? (skip - 1) * take : 0;
  const [totalOrders, totalOrdersQuery, orders] = await db.$transaction([
    db.order.count(),
    db.order.count({
      where: {
        OR: [
          {
            payment: {
              OR: [
                {
                  name: {
                    contains: s?.trim(),
                    mode: 'insensitive'
                  }
                }
              ]
            }
          },
          {
            user: {
              name: {
                contains: s?.trim(),
                mode: 'insensitive'
              }
            }
          },
          {
            originalTotal: {
              equals: Number(s?.trim()) || 0
            }
          },
          {
            discountAmount: {
              equals: Number(s?.trim()) || 0
            }
          },
          {
            finalTotal: {
              equals: Number(s?.trim()) || 0
            }
          }
        ],
        status: filter
          ? {
              equals: filter?.trim() as OrderStatus
            }
          : {
              not: {
                equals: OrderStatus.CANCELLED
              }
            }
      },
      orderBy: sort && sort.length > 0 ? buildSortFilter(sort, ['finalTotal']) : undefined
    }),
    db.order.findMany({
      skip: startPageItem,
      take,
      where: {
        OR: [
          {
            payment: {
              OR: [
                {
                  name: {
                    contains: s?.trim(),
                    mode: 'insensitive'
                  }
                }
              ]
            }
          },
          {
            user: {
              name: {
                contains: s?.trim(),
                mode: 'insensitive'
              }
            }
          },
          {
            originalTotal: {
              equals: Number(s?.trim()) || 0
            }
          },
          {
            discountAmount: {
              equals: Number(s?.trim()) || 0
            }
          },
          {
            finalTotal: {
              equals: Number(s?.trim()) || 0
            }
          }
        ],
        status: filter
          ? {
              equals: filter?.trim() as OrderStatus
            }
          : {
              not: {
                equals: OrderStatus.CANCELLED
              }
            }
      },
      orderBy: sort && sort.length > 0 ? buildSortFilter(sort, ['finalTotal']) : undefined,
      include: {
        payment: true,
        user: {
          include: {
            imageForEntity: { include: { image: true } },
            address: true
          }
        },
        delivery: { include: { address: true } },
        orderItems: {
          include: {
            product: {
              include: {
                imageForEntities: { include: { image: true } }
              }
            }
          }
        },
        vouchers: true
      }
    })
  ]);
  const totalPages = Math.ceil(
    Object.entries(input)?.length > 2 ? (totalOrdersQuery == 0 ? 1 : totalOrdersQuery / take) : totalOrders / take
  );
  const currentPage = skip ? Math.floor(skip / take + 1) : 1;

  return {
    orders,
    pagination: {
      currentPage,
      totalPages
    }
  };
};

export const upsertOrderService = async (db: PrismaClient, input: OrderInput) => {
  const { id, userId, paymentId, voucherIds, orderItems, delivery, ...data } = input;
  const order = await db.order.upsert({
    where: { id: id || 'new-item-' + Math.random() },
    create: {
      ...data,
      user: {
        connect: {
          id: userId ?? ''
        }
      },
      vouchers: {
        connect: voucherIds.map(id => ({
          id
        }))
      },
      payment: paymentId ? { connect: { id: paymentId } } : undefined,
      orderItems: {
        createMany: {
          data: orderItems.map(({ id, orderId, ...rest }) => ({ ...rest }))
        }
      },
      delivery: {
        create: {
          ...delivery,
          id: undefined,
          address: {
            create: delivery
              ? {
                  ...delivery.address,
                  id: undefined,
                  type: AddressType.DELIVERY
                }
              : undefined
          }
        }
      }
    },
    update: {
      ...data,
      payment: paymentId ? { connect: { id: paymentId } } : undefined,
      orderItems: {
        deleteMany: {
          id: {
            notIn: orderItems?.map(({ id }: any) => id).filter(Boolean) || []
          }
        },
        upsert: orderItems?.map(({ id, orderId, ...item }) => ({
          where: {
            id: id || 'new-item-' + Math.random() * 100
          },
          create: item,
          update: item
        }))
      },
      delivery: {
        upsert: {
          where: {
            id: delivery?.id || ''
          },
          create: {
            ...delivery,
            id: undefined,
            address: {
              create: delivery
                ? {
                    ...delivery.address,
                    id: undefined,
                    type: AddressType.DELIVERY
                  }
                : undefined
            }
          },
          update: {
            ...delivery,
            address: {
              upsert: {
                where: {
                  id: delivery?.address?.id || ''
                },
                create: {
                  ...delivery?.address,
                  type: AddressType.DELIVERY,
                  id: undefined
                },
                update: {
                  ...delivery?.address,
                  type: AddressType.DELIVERY,
                  id: delivery?.address?.id || ''
                }
              }
            }
          }
        }
      }
    },
    include: {
      orderItems: true
    }
  });
  if (!order) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Rất tiêc đơn hàng không tồn tại.'
    });
  }

  //test admin
  if (order && order.status === OrderStatus.COMPLETED) {
    updatepointUser(db, input.userId, Number(input.finalTotal) || 0);
    updateRevenue(db, order.status, input.userId, order);
    await Promise.all(
      order?.orderItems?.map((orderItem: any) => {
        return updateSales(db, order.status, orderItem.productId, orderItem?.quantity);
      })
    );
  }
  return order;
};
export const updateOrderService = async (
  db: PrismaClient,
  input: {
    where: any;
    data: any;
  }
) => {
  const order: any = await db.order.update({
    where: input.where as Prisma.OrderWhereUniqueInput,
    data: input.data,
    include: {
      orderItems: true
    }
  });

  if (order && order.status === OrderStatus.COMPLETED) {
    updateRevenue(db, order.status, order.userId, order);
    updatepointUser(db, order.userId, order.finalTotal);
    await Promise.all(
      order?.orderItems?.map((orderItem: any) => {
        return updateSales(db, order.status, orderItem.productId, orderItem?.quantity);
      })
    );
  }
  return order;
};
export const deleteOrderService = async (db: PrismaClient, input: { id: string }) => {
  const order = await db.order.update({
    where: { id: input.id },
    data: {
      status: OrderStatus.CANCELLED
    }
  });
  const invoice = await db.invoice.update({
    where: {
      orderId: order.id
    },
    data: {
      status: InvoiceStatus.CANCELLED
    }
  });

  return order;
};

export const getFilterOrderService = async (db: PrismaClient, input: { s: string; period?: number }) => {
  const { s, period } = input;
  const searchQuery = s?.trim();
  const where = {
    AND: [
      period
        ? {
            createdAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - period)),
              lte: new Date()
            }
          }
        : undefined,
      {
        OR: [
          {
            id: searchQuery
          },
          {
            user: {
              email: {
                equals: searchQuery
              }
            }
          }
        ]
      }
    ].filter(Boolean)
  };
  const order = await db.order.findMany({
    where: where as any,
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              imageForEntities: { include: { image: true } }
            }
          }
        }
      },
      vouchers: true,
      user: {
        include: {
          imageForEntity: { include: { image: true } },
          address: true
        }
      },
      payment: true,
      delivery: {
        include: {
          address: true
        }
      }
    }
  });

  return order;
};
export const getOneOrderService = async (db: PrismaClient, input: { s: string }) => {
  const searchQuery = input.s?.trim();
  return await db.order.findFirst({
    where: {
      OR: [
        {
          id: searchQuery
        },
        {
          user: {
            email: {
              contains: searchQuery,
              mode: 'insensitive'
            }
          }
        }
      ]
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              imageForEntities: { include: { image: true } }
            }
          }
        }
      },
      vouchers: true,
      user: {
        include: {
          imageForEntity: { include: { image: true } },
          address: true
        }
      },
      payment: true,
      delivery: {
        include: {
          address: true
        }
      }
    }
  });
};
export const getAllOrderService = async (db: PrismaClient) => {
  const order = await db.order.findMany({
    include: {
      orderItems: {
        include: {
          product: true
        }
      },
      delivery: {
        select: {
          address: true
        }
      },
      payment: true,
      vouchers: true,
      user: {
        include: {
          address: true
        },
        omit: {
          password: true
        }
      }
    }
  });
  return order;
};
