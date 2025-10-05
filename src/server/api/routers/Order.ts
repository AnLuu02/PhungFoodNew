import { OrderStatus, Prisma } from '@prisma/client';
import { z } from 'zod';

import { buildSortFilter, updatepointUser, updateRevenue, updateSales } from '~/lib/func-handler/PrismaHelper';
import { LocalOrderStatus } from '~/lib/zod/EnumType';
import { deliverySchema } from '~/lib/zod/zodShcemaForm';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { ResponseTRPC } from '~/types/ResponseFetcher';

export const orderRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional(),
        filter: z.string().optional().nullable(),
        sort: z.array(z.string()).optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, s, filter, sort } = input;

      const startPageItem = skip > 0 ? (skip - 1) * take : 0;
      const [totalOrders, totalOrdersQuery, orders] = await ctx.db.$transaction([
        ctx.db.order.count(),
        ctx.db.order.count({
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
                  equals: filter?.trim() as LocalOrderStatus
                }
              : undefined
          },
          orderBy: sort && sort.length > 0 ? buildSortFilter(sort, ['finalTotal']) : undefined
        }),
        ctx.db.order.findMany({
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
                  equals: filter?.trim() as LocalOrderStatus
                }
              : undefined
          },
          orderBy: sort && sort.length > 0 ? buildSortFilter(sort, ['finalTotal']) : undefined,
          include: {
            payment: true,
            user: {
              include: {
                image: true,
                address: true
              }
            },
            delivery: { include: { address: true } },
            orderItems: {
              include: {
                product: {
                  include: {
                    images: true
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
    }),
  create: publicProcedure
    .input(
      z.object({
        originalTotal: z.number().default(0),
        discountAmount: z.number().default(0),
        finalTotal: z.number().default(0),
        status: z.nativeEnum(OrderStatus),
        userId: z.string(),
        note: z.string().optional(),
        paymentId: z.string().optional(),
        delivery: deliverySchema.optional(),
        transactionId: z.string().optional(),
        orderItems: z.array(
          z.object({
            productId: z.string(),
            quantity: z.number().default(1),
            note: z.string().optional(),
            price: z.number().default(0)
          })
        ),
        vouchers: z.array(z.string()).default([])
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const order = await ctx.db.order.create({
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
                  address: {
                    create: input.delivery.address
                  }
                } as any
              }
            : undefined,
          transactionId: input.transactionId,
          orderItems: {
            createMany: {
              data: input.orderItems
            }
          },
          vouchers: {
            connect: input.vouchers.map(voucherId => ({ id: voucherId }))
          }
        },
        include: {
          orderItems: true
        }
      });
      if (!order) {
        return {
          code: 'ERROR',
          message: 'Tạo đơn hàng không thành cong.',
          data: order
        };
      }

      //test admin
      if (order && order.status === LocalOrderStatus.COMPLETED) {
        updatepointUser(ctx, input.userId, Number(input.finalTotal) || 0);
        updateRevenue(ctx, order.status, input.userId, order);
        await Promise.all(
          order?.orderItems?.map((orderItem: any) => {
            return updateSales(ctx, order.status, orderItem.productId, orderItem?.quantity);
          })
        );
      }
      return {
        code: 'OK',
        message: 'Tạo đơn hàng thành công.',
        data: order
      };
    }),
  update: publicProcedure
    .input(
      z.object({
        where: z.record(z.string(), z.any()),
        data: z.record(z.string(), z.any()),
        orderId: z.string()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const order: any = await ctx.db.order.update({
        where: input.where as Prisma.OrderWhereUniqueInput,
        data: input.data,
        include: {
          orderItems: true
        }
      });

      if (order && order.status === LocalOrderStatus.COMPLETED) {
        updateRevenue(ctx, order.status, order.userId, order);
        updatepointUser(ctx, order.userId, order.finalTotal);
        await Promise.all(
          order?.orderItems?.map((orderItem: any) => {
            return updateSales(ctx, order.status, orderItem.productId, orderItem?.quantity);
          })
        );
      }
      return {
        code: 'OK',
        message: 'Cập nhật đơn hàng thành công.',
        data: order
      };
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const order = await ctx.db.order.delete({
        where: { id: input.id }
      });

      return {
        code: 'OK',
        message: 'Tạo đơn hàng thành công.',
        data: order
      };
    }),

  getFilter: publicProcedure
    .input(
      z.object({
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findMany({
        where: {
          OR: [
            {
              id: input.s?.trim()
            },
            {
              user: {
                email: {
                  equals: input.s?.trim()
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
                  images: true
                }
              }
            }
          },
          vouchers: true,
          user: {
            include: {
              image: true,
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
    }),
  getOne: publicProcedure
    .input(
      z.object({
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.order.findFirst({
        where: {
          OR: [
            {
              id: input.s?.trim()
            },
            {
              user: {
                email: {
                  contains: input.s?.trim(),
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
                  images: true
                }
              }
            }
          },
          vouchers: true,
          user: {
            include: {
              image: true,
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
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const order = await ctx.db.order.findMany({
      include: {
        orderItems: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    return order;
  })
});
