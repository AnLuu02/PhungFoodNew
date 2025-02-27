import { OrderStatus, Prisma } from '@prisma/client';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { updatePointLevel } from './Product';
import { updateRevenue } from './Revenue';

export const orderRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        query: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, query } = input;

      const startPageItem = skip > 0 ? (skip - 1) * take : 0;
      const [totalOrders, totalOrdersQuery, orders] = await ctx.db.$transaction([
        ctx.db.order.count(),
        ctx.db.order.count({
          where: query?.trim()
            ? {
                OR: [
                  {
                    payment: {
                      OR: [
                        {
                          name: {
                            contains: query?.trim(),
                            mode: 'insensitive'
                          }
                        },
                        {
                          tag: {
                            contains: query?.trim(),
                            mode: 'insensitive'
                          }
                        }
                      ]
                    }
                  },
                  {
                    user: {
                      OR: [
                        {
                          name: {
                            contains: query?.trim(),
                            mode: 'insensitive'
                          }
                        },
                        {
                          email: {
                            contains: query?.trim(),
                            mode: 'insensitive'
                          }
                        }
                      ]
                    }
                  },
                  {
                    total: {
                      equals: Number(query?.trim()) || 0
                    }
                  }
                ]
              }
            : undefined
        }),
        ctx.db.order.findMany({
          skip: startPageItem,
          take,
          where: query?.trim()
            ? {
                OR: [
                  {
                    payment: {
                      OR: [
                        {
                          name: {
                            contains: query?.trim(),
                            mode: 'insensitive'
                          }
                        },
                        {
                          tag: {
                            contains: query?.trim(),
                            mode: 'insensitive'
                          }
                        }
                      ]
                    }
                  },
                  {
                    user: {
                      name: {
                        contains: query?.trim(),
                        mode: 'insensitive'
                      }
                    }
                  },
                  {
                    total: {
                      equals: Number(query?.trim()) || 0
                    }
                  }
                ]
              }
            : undefined,
          include: {
            payment: true,
            user: {
              include: {
                images: true
              }
            },
            delivery: true,
            orderItems: {
              include: {
                product: true
              }
            }
          }
        })
      ]);
      const totalPages = Math.ceil(
        query?.trim() ? (totalOrdersQuery == 0 ? 1 : totalOrdersQuery / take) : totalOrders / take
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
        total: z.any().default(0),
        status: z.nativeEnum(OrderStatus),
        userId: z.string(),
        paymentId: z.string().optional(),
        deliveryId: z.string().optional(),
        transactionId: z.string().optional(),
        orderItems: z.array(
          z.object({
            productId: z.string(),
            quantity: z.number().default(1),
            price: z.number().default(0)
          })
        ),
        vouchers: z.array(z.string()).default([])
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.create({
        data: {
          total: Number(input.total) || 0,
          status: input.status,
          userId: input.userId,
          paymentId: input.paymentId,
          deliveryId: input?.deliveryId,
          transactionId: input.transactionId,
          orderItems: {
            createMany: {
              data: input.orderItems
            }
          },
          vouchers: {
            connect: input.vouchers.map(voucherId => ({ id: voucherId }))
          }
        }
      });
      if (!order) {
        return {
          success: false,
          message: 'Tạo đơn hàng khóa.',
          record: order
        };
      }
      // updateRevenue(ctx, order.status, order.userId, order.total);
      if (order && order.status === OrderStatus.COMPLETED) {
        updatePointLevel(ctx, input.userId, Number(input.total) || 0);
      }
      return {
        success: true,
        message: 'Tạo đơn hàng thành công.',
        record: order
      };
    }),
  update: publicProcedure
    .input(
      z.object({
        where: z.record(z.string(), z.any()),
        data: z.record(z.string(), z.any())
      })
    )
    .mutation(async ({ ctx, input }) => {
      // const order = await ctx.db.order.update({
      //   where: { id: input?.id },
      //   data: {
      //     total: input.total,
      //     status: input.status,
      //     userId: input.userId,
      //     paymentId: input.paymentId,
      //     transactionId: input.transactionId,
      //     orderItems: {
      //       upsert: input.orderItems.map(item => ({
      //         where: {
      //           id: item.id
      //         },
      //         update: {
      //           productId: item.productId,
      //           quantity: item.quantity,
      //           price: item.price
      //         },
      //         create: {
      //           productId: item.productId,
      //           quantity: item.quantity,
      //           price: item.price
      //         }
      //       })),
      //       deleteMany: {
      //         productId: {
      //           notIn: input.orderItems.map(item => item.productId)
      //         }
      //       }
      //     }
      //   }
      // });
      const order: any = await ctx.db.order.update({
        where: input.where as Prisma.OrderWhereUniqueInput,
        data: input.data
      });
      updateRevenue(ctx, order.status, order.userId, order.total);
      if (order && order.status === OrderStatus.COMPLETED) {
        updatePointLevel(ctx, order.userId, order.total);
      }
      return {
        success: true,
        message: 'Cập nhật đơn hàng thành công.',
        record: order
      };
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.delete({
        where: { id: input.id }
      });

      return {
        success: true,
        message: 'Tạo đơn hàng thành công.',
        record: order
      };
    }),

  getFilter: publicProcedure
    .input(
      z.object({
        query: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findMany({
        where: {
          OR: [
            {
              id: input.query?.trim()
            },
            {
              user: {
                email: {
                  contains: input.query?.trim(),
                  mode: 'insensitive'
                }
              }
            }
          ]
        },
        include: {
          orderItems: {
            include: {
              product: true
            }
          },
          vouchers: true,
          user: {
            include: {
              images: true
            }
          },
          payment: true,
          delivery: true
        }
      });

      if (!order) {
        throw new Error(`Stock with ID ${input.query} not found.`);
      }
      return order;
    }),
  getOne: publicProcedure
    .input(
      z.object({
        query: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findFirst({
        where: {
          OR: [
            {
              id: input.query?.trim()
            },
            {
              user: {
                email: {
                  contains: input.query?.trim(),
                  mode: 'insensitive'
                }
              }
            }
          ]
        },
        include: {
          orderItems: {
            include: {
              product: true
            }
          },
          vouchers: true,
          user: {
            include: {
              images: true
            }
          },
          payment: true,
          delivery: true
        }
      });

      if (!order) {
        throw new Error(`Stock with ID ${input.query} not found.`);
      }
      return order;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const order = await ctx.db.order.findMany();
    return order;
  })
});
