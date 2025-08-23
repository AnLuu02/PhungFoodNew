import { OrderStatus, Prisma } from '@prisma/client';
import { z } from 'zod';

import { redis } from '~/lib/cache/redis';
import { LocalOrderStatus } from '~/lib/zod/EnumType';
import { deliverySchema } from '~/lib/zod/zodShcemaForm';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { updatepointUser, updateSales } from './Product';
import { updateRevenue } from './Revenue';

export const orderRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, s } = input;

      const startPageItem = skip > 0 ? (skip - 1) * take : 0;
      const [totalOrders, totalOrdersQuery, orders] = await ctx.db.$transaction([
        ctx.db.order.count(),
        ctx.db.order.count({
          where: s?.trim()
            ? {
                OR: [
                  {
                    payment: {
                      OR: [
                        {
                          name: {
                            contains: s?.trim(),
                            mode: 'insensitive'
                          }
                        },
                        {
                          tag: {
                            contains: s?.trim(),
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
                            contains: s?.trim(),
                            mode: 'insensitive'
                          }
                        },
                        {
                          email: {
                            contains: s?.trim(),
                            mode: 'insensitive'
                          }
                        }
                      ]
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
                ]
              }
            : undefined
        }),
        ctx.db.order.findMany({
          skip: startPageItem,
          take,
          where: s?.trim()
            ? {
                OR: [
                  {
                    payment: {
                      OR: [
                        {
                          name: {
                            contains: s?.trim(),
                            mode: 'insensitive'
                          }
                        },
                        {
                          tag: {
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
                ]
              }
            : undefined,
          include: {
            payment: true,
            user: {
              include: {
                image: true,
                address: true
              }
            },
            delivery: true,
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
        s?.trim() ? (totalOrdersQuery == 0 ? 1 : totalOrdersQuery / take) : totalOrders / take
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
    .mutation(async ({ ctx, input }) => {
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
                }
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
        }
      });
      if (!order) {
        return {
          success: false,
          message: 'Tạo đơn hàng khóa.',
          record: order
        };
      }
      if (order && order.status === LocalOrderStatus.COMPLETED) {
        updatepointUser(ctx, input.userId, Number(input.finalTotal) || 0);
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
        data: z.record(z.string(), z.any()),
        orderId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      redis.del(`order:${input.orderId}`);
      const order: any = await ctx.db.order.update({
        where: input.where as Prisma.OrderWhereUniqueInput,
        data: input.data,
        include: {
          orderItems: true
        }
      });

      if (order && order.status === LocalOrderStatus.COMPLETED) {
        updateRevenue(ctx, order.status, order.userId, order.finalTotal);
        updatepointUser(ctx, order.userId, order.finalTotal);
        await Promise.all(
          order?.orderItems?.map((orderItem: any) => {
            return updateSales(ctx, order.status, orderItem.productId, orderItem?.quantity);
          })
        );
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

      return order;
    }),
  getOne: publicProcedure
    .input(
      z.object({
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      // return await withRedisCache(
      //   `order:${input.s}`,
      //   async () => {
      //     return await ctx.db.order.findFirst({
      //       where: {
      //         OR: [
      //           {
      //             id: input.s?.trim()
      //           },
      //           {
      //             user: {
      //               email: {
      //                 contains: input.s?.trim(),
      //                 mode: 'insensitive'
      //               }
      //             }
      //           }
      //         ]
      //       },
      //       include: {
      //         orderItems: {
      //           include: {
      //             product: {
      //               include: {
      //                 images: true
      //               }
      //             }
      //           }
      //         },
      //         vouchers: true,
      //         user: {
      //           include: {
      //             image: true,
      //             address: true
      //           }
      //         },
      //         payment: true,
      //         delivery: {
      //           include: {
      //             address: true
      //           }
      //         }
      //       }
      //     });
      //   },
      //   60 * 60
      // );
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
