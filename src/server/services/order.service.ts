import { AddressType, OrderStatus, Prisma, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import dayjs from '~/lib/dayjs';
import { moneyToNumber } from '~/lib/FuncHandler/Format';
import { generateInvoiceNumber } from '~/lib/FuncHandler/generateInvoiceNumber';
import { buildSortFilter, updatepointUser, updateRevenue, updateSales } from '~/lib/FuncHandler/PrismaHelper';
import { OrderInput } from '~/shared/schema/order.schema';
import { upsertInvoiceService } from './invoice.service';
import { reserveVoucherService } from './voucherUsage.service';

export const findOrderService = async (
  db: PrismaClient,
  input: {
    page: number;
    limit: number;
    s?: string;
    filter?: string | null;
    sort?: string[];
    period?: {
      startTime?: number;
      endTime?: number;
    };
    include?: Prisma.OrderInclude;
  }
) => {
  const { page, limit, s, filter, sort, include, period } = input;
  const searchQuery = s?.trim();
  const where: Prisma.OrderWhereInput = {
    ...(period
      ? {
          createdAt: {
            gte: dayjs(period.startTime).utc().toISOString(),
            lte: dayjs(period.endTime).utc().toISOString()
          }
        }
      : {}),
    ...(searchQuery
      ? {
          OR: [
            {
              payment: {
                OR: [
                  {
                    name: {
                      contains: searchQuery,
                      mode: 'insensitive'
                    }
                  }
                ]
              }
            },
            {
              user: {
                name: {
                  contains: searchQuery,
                  mode: 'insensitive'
                }
              }
            },
            {
              originalAmount: {
                equals: Number(searchQuery) || 0
              }
            },
            {
              discountAmount: {
                equals: Number(searchQuery) || 0
              }
            },
            {
              finalAmount: {
                equals: Number(searchQuery) || 0
              }
            },
            {
              shippingAmount: {
                equals: Number(searchQuery) || 0
              }
            }
          ]
        }
      : {}),
    ...(filter
      ? {
          status: filter
            ? {
                equals: filter?.trim() as OrderStatus
              }
            : {
                not: {
                  equals: OrderStatus.CANCELLED
                }
              }
        }
      : {})
  };
  const [totalOrders, totalOrdersQuery, orders] = await db.$transaction([
    db.order.count(),
    db.order.count({
      where,
      orderBy: sort && sort.length > 0 ? buildSortFilter(sort, ['finalAmount']) : undefined
    }),
    db.order.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
      orderBy: sort && sort.length > 0 ? buildSortFilter(sort, ['finalAmount']) : { createdAt: 'desc' },
      include: {
        ...(include ?? {}),
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
        voucherUsages: true
      }
    })
  ]);
  const totalPages = Math.ceil(
    Object.entries(input)?.length > 2 ? (totalOrdersQuery == 0 ? 1 : totalOrdersQuery / limit) : totalOrders / limit
  );

  return {
    orders: orders.map(item => ({
      ...item,
      discountAmount: moneyToNumber(item?.discountAmount),
      finalAmount: moneyToNumber(item?.finalAmount),
      originalAmount: moneyToNumber(item?.originalAmount),
      taxAmount: moneyToNumber(item?.taxAmount),
      shippingAmount: moneyToNumber(item?.shippingAmount),
      orderItems: item.orderItems.map(orItem => ({
        ...orItem,
        price: moneyToNumber(orItem.price),
        product: {
          ...orItem.product,
          price: moneyToNumber(orItem.product.price),
          discount: moneyToNumber(orItem.product.discount)
        }
      })),
      voucherUsages: item.voucherUsages.map(vs => ({ ...vs, discount: moneyToNumber(vs.discount) }))
    })),
    pagination: {
      hasNext: Boolean(totalPages > page),
      totalPages
    }
  };
};

export const upsertOrderService = async (db: PrismaClient, input: OrderInput) => {
  const { id, userId, paymentId, vouchers, orderItems, delivery, ...data } = input;
  const result = await db.$transaction(async tx => {
    const oldData = id ? await tx.order.findUnique({ where: { id }, include: { orderItems: true } }) : null;
    const newData = await tx.order.upsert({
      where: { id: id || 'new-item-' + Math.random() },
      create: {
        ...data,
        user: {
          connect: {
            id: userId ?? ''
          }
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
        user: {
          connect: {
            id: userId
          }
        },
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

    if (vouchers.length > 0) {
      await reserveVoucherService(tx, {
        userId,
        orderId: newData.id,
        vouchers: vouchers.map(v => ({
          voucherId: v.voucherId,
          discountAmount: v.discountAmount
        }))
      });
    }

    return {
      oldData: oldData && {
        ...oldData,
        discountAmount: moneyToNumber(oldData?.discountAmount),
        finalAmount: moneyToNumber(oldData?.finalAmount),
        originalAmount: moneyToNumber(oldData?.originalAmount),
        taxAmount: moneyToNumber(oldData?.taxAmount),
        shippingAmount: moneyToNumber(oldData?.shippingAmount),
        orderItems: oldData?.orderItems.map(orItem => ({ ...orItem, price: moneyToNumber(orItem.price) }))
      },
      newData: {
        ...newData,
        discountAmount: moneyToNumber(newData?.discountAmount),
        finalAmount: moneyToNumber(newData?.finalAmount),
        originalAmount: moneyToNumber(newData?.originalAmount),
        taxAmount: moneyToNumber(newData?.taxAmount),
        shippingAmount: moneyToNumber(newData?.shippingAmount),
        orderItems: newData?.orderItems.map(orItem => ({ ...orItem, price: moneyToNumber(orItem.price) }))
      }
    };
  });
  if (result?.oldData && result?.oldData?.id != result.newData?.id) {
    db.order.deleteMany({ where: { id: result.newData?.id } });
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Rất tiêc đơn hàng không hợp lệ.'
    });
  }

  //statistics
  if (result?.newData && result.newData.status === OrderStatus.COMPLETED) {
    updatepointUser(db, input.userId, Number(input.finalAmount) || 0);
    updateRevenue(db, result.newData.status, input.userId, {
      originalAmount: moneyToNumber(result.newData?.originalAmount),
      discountAmount: moneyToNumber(result.newData?.discountAmount),
      finalAmount: moneyToNumber(result.newData?.finalAmount),
      createdAt: data?.createdAt
    });
    await Promise.all(
      result.newData?.orderItems?.map((orderItem: NonNullable<(typeof result)['newData']>['orderItems'][number]) => {
        return updateSales(db, result.newData.status, orderItem.productId, orderItem?.quantity);
      })
    );
  }
  return {
    metaData: {
      before: result.oldData ?? {},
      after: result.newData
    }
  };
};
export const updateOrderService = async (
  db: PrismaClient,
  input: {
    where: any;
    data: any;
  }
) => {
  const order = await db.order.update({
    where: input.where as Prisma.OrderWhereUniqueInput,
    data: input.data,
    include: {
      orderItems: true
    }
  });

  if (order && order.status === OrderStatus.COMPLETED && order.userId) {
    updateRevenue(db, order.status, order.userId, {
      originalAmount: moneyToNumber(order?.originalAmount),
      discountAmount: moneyToNumber(order?.discountAmount),
      finalAmount: moneyToNumber(order?.finalAmount),
      createdAt: input?.data?.createdAt
    });
    updatepointUser(db, order.userId, moneyToNumber(order.finalAmount));
    await Promise.all(
      order?.orderItems?.map((orderItem: any) => {
        return updateSales(db, order.status, orderItem.productId, orderItem?.quantity);
      })
    );
  }
  return {
    ...order,
    orderItems: order.orderItems.map(orItem => ({ ...orItem, price: moneyToNumber(orItem.price) })),
    discountAmount: moneyToNumber(order?.discountAmount),
    finalAmount: moneyToNumber(order?.finalAmount),
    originalAmount: moneyToNumber(order?.originalAmount),
    taxAmount: moneyToNumber(order?.taxAmount),
    shippingAmount: moneyToNumber(order?.shippingAmount)
  };
};
export const deleteOrderService = async (db: PrismaClient, input: { id: string }) => {
  const deleted = await db.order.update({
    where: { id: input.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: {
            select: {
              fullAddress: true
            }
          }
        }
      },
      payment: {
        select: {
          name: true
        }
      }
    },
    data: {
      status: OrderStatus.CANCELLED
    }
  });
  if (deleted) {
    try {
      await upsertInvoiceService(
        db,
        {
          invoiceNumber: generateInvoiceNumber(),
          status: 'CANCELLED',
          buyerName: deleted.user?.name ?? 'Khách hàng',
          buyerEmail: deleted?.user?.email ?? null,
          buyerPhone: deleted?.user?.phone ?? null,
          buyerAddress: deleted?.user?.address?.fullAddress ?? 'Đang cập nhật',
          buyerTaxCode: '13254',
          subTotal: moneyToNumber(deleted.finalAmount),
          taxAmount: moneyToNumber(deleted?.taxAmount),
          discountAmount: moneyToNumber(deleted?.discountAmount),
          totalAmount: moneyToNumber(deleted.originalAmount),
          currency: 'VND',
          paymentMethod: deleted.payment?.name ?? null,
          pdfUrl: '',
          note: '',
          sellerId: 'cmfgrmpbt0000emt09bftxjo3',
          customerId: deleted.userId,
          orderId: deleted.id,
          issuedAt: dayjs().utc().toDate(),
          paidAt: dayjs().utc().toDate(),
          dueDate: dayjs().utc().toDate()
        },
        {
          orderId: deleted.id
        }
      );
    } catch (error) {
      throw error;
    }
  }

  return {
    metaData: {
      before: deleted ?? {},
      after: {}
    }
  };
};

export const getFilterOrderService = async (
  db: PrismaClient,
  input: { s: string; period?: number; include?: Prisma.OrderInclude }
) => {
  const { s, period, include } = input;
  const searchQuery = s?.trim();
  const where = {
    AND: [
      period
        ? {
            createdAt: {
              gte: dayjs().utc().subtract(period, 'day').startOf('day').toISOString(),
              lte: dayjs().utc().toISOString()
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
              OR: [{ email: searchQuery }, { id: searchQuery }]
            }
          }
        ]
      }
    ].filter(Boolean)
  };
  const orders = await db.order.findMany({
    where: where as any,
    include: {
      ...(include ?? {}),
      orderItems: {
        include: {
          product: {
            include: {
              imageForEntities: { include: { image: true } }
            }
          }
        }
      },
      voucherUsages: true,
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

  return orders.map(item => ({
    ...item,
    orderItems: item.orderItems.map(orItem => ({
      ...orItem,
      price: moneyToNumber(orItem.price),
      product: {
        ...orItem.product,
        price: moneyToNumber(orItem.product.price),
        discount: moneyToNumber(orItem.product.discount)
      }
    })),
    voucherUsages: item.voucherUsages.map(vs => ({ ...vs, discount: moneyToNumber(vs.discount) })),
    discountAmount: moneyToNumber(item?.discountAmount),
    finalAmount: moneyToNumber(item?.finalAmount),
    originalAmount: moneyToNumber(item?.originalAmount),
    taxAmount: moneyToNumber(item?.taxAmount),
    shippingAmount: moneyToNumber(item?.shippingAmount)
  }));
};
export const getOneOrderService = async (db: PrismaClient, input: { key: string; include?: Prisma.OrderInclude }) => {
  const { key, include } = input;
  const order = await db.order.findFirst({
    where: {
      OR: [
        {
          id: key
        }
      ]
    },
    include: {
      ...(include ?? {}),
      orderItems: {
        include: {
          product: {
            include: {
              imageForEntities: { include: { image: true } }
            }
          }
        }
      },
      voucherUsages: true,
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
  if (!order) throw new TRPCError({ code: 'NOT_FOUND', message: 'Oops! Có vẻ như đơn hàng không tồn tại.' });
  return {
    ...order,
    orderItems: order.orderItems.map(orItem => ({
      ...orItem,
      price: moneyToNumber(orItem.price),
      product: {
        ...orItem.product,
        price: moneyToNumber(orItem.product.price),
        discount: moneyToNumber(orItem.product.discount)
      }
    })),
    voucherUsages: order.voucherUsages.map(vs => ({ ...vs, discount: moneyToNumber(vs.discount) })),
    discountAmount: moneyToNumber(order?.discountAmount),
    finalAmount: moneyToNumber(order?.finalAmount),
    originalAmount: moneyToNumber(order?.originalAmount),
    taxAmount: moneyToNumber(order?.taxAmount),
    shippingAmount: moneyToNumber(order?.shippingAmount)
  };
};
export const getAllOrderService = async (
  db: PrismaClient,
  input?: {
    include?: Prisma.OrderInclude;
  }
) => {
  const orders = await db.order.findMany({
    include: {
      ...(input?.include ? input.include : {}),
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
      voucherUsages: true,
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
  return orders.map(item => ({
    ...item,
    orderItems: item.orderItems.map(orItem => ({
      ...orItem,
      price: moneyToNumber(orItem.price),
      product: {
        ...orItem.product,
        price: moneyToNumber(orItem.product.price),
        discount: moneyToNumber(orItem.product.discount)
      }
    })),
    voucherUsages: item.voucherUsages.map(vs => ({ ...vs, discount: moneyToNumber(vs.discount) })),
    discountAmount: moneyToNumber(item?.discountAmount),
    finalAmount: moneyToNumber(item?.finalAmount),
    originalAmount: moneyToNumber(item?.originalAmount),
    taxAmount: moneyToNumber(item?.taxAmount),
    shippingAmount: moneyToNumber(item?.shippingAmount)
  }));
};
