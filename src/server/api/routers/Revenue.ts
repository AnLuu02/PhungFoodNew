import { z } from 'zod';
import { getCompare } from '~/lib/func-handler/PrismaHelper';

import { createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';

export const revenueRouter = createTRPCRouter({
  getTotalSpentInMonthByUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        year: z.number()
      })
    )

    .query(async ({ ctx, input }) => {
      const revenues = await ctx.db.revenue.groupBy({
        by: ['month'],
        where: { userId: input.userId, year: input.year || 2025 },
        _sum: { totalSpent: true },
        orderBy: { month: 'asc' }
      });
      return revenues?.map(item => {
        return {
          month: item.month,
          totalSpent: item._sum.totalSpent,
          year: input.year
        };
      });
    }),

  getTopUsers: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional(),
        limit: z.number().optional().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { startTime, endTime } = input;
      const startTimeToDate = startTime && new Date(startTime);
      const endTimeToDate = endTime && new Date(endTime);
      const where = {
        createdAt: {
          gte: startTimeToDate,
          lte: endTimeToDate
        }
      };
      const revenues = await ctx.db.revenue.groupBy({
        by: ['userId'],
        where: where as any,
        _sum: { totalSpent: true, totalOrders: true },
        orderBy: { _sum: { totalSpent: 'desc' } },
        take: input.limit || 5
      });
      const userIds = revenues.map(revenue => revenue.userId);

      const users =
        userIds?.length > 0
          ? await ctx.db.user.findMany({
              where: {
                id: { in: userIds }
              },
              select: {
                id: true,
                name: true,
                email: true
              }
            })
          : [];
      return revenues.map(item => {
        const user = users.find((user: any) => user.id === item.userId);
        return {
          userId: item.userId,
          totalSpent: item._sum.totalSpent,
          totalOrders: item._sum.totalOrders,
          user: user
        };
      });
    }),
  getTopProducts: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { startTime, endTime } = input;
      const startTimeToDate = startTime && new Date(startTime);
      const endTimeToDate = endTime && new Date(endTime);
      const where = {
        createdAt: {
          gte: startTimeToDate,
          lte: endTimeToDate
        }
      };
      const data = await ctx.db.orderItem.findMany({
        where: where as any,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              subCategory: {
                select: {
                  name: true
                }
              },
              price: true,
              soldQuantity: true
            }
          }
        }
      });

      const topProducts = data.reduce((acc: any, item: any) => {
        const existed = acc.find((it: any) => it?.product?.id === item?.product?.id);
        if (!existed) {
          acc.push({
            product: item?.product,
            soldQuantity: item?.quantity,
            profit: item?.product?.price * item?.quantity || 0
          });
        } else {
          existed.soldQuantity += item?.quantity || 0;
          existed.profit += item?.product?.price * item?.quantity || 0;
        }
        return acc;
      }, []);

      return topProducts;
    }),
  getDistributionProducts: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { startTime, endTime } = input;
      const startTimeToDate = startTime && new Date(startTime);
      const endTimeToDate = endTime && new Date(endTime);
      const data = await ctx.db.category.findMany({
        include: {
          subCategory: {
            select: {
              name: true,
              product: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });
      const distributionProducts = data.reduce((acc: any, item: any) => {
        item?.subCategory?.forEach((subCategory: any) => {
          if (!acc[item?.name]) {
            acc[item?.name] = subCategory?.product?.length || 0;
          } else {
            acc[item?.name] += subCategory?.product?.length || 0;
          }
        });
        return acc;
      }, {});

      return distributionProducts;
    }),
  getRevenueOrderStatus: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { startTime, endTime } = input;
      const startTimeToDate = startTime && new Date(startTime);
      const endTimeToDate = endTime && new Date(endTime);
      const where = {
        createdAt: {
          gte: startTimeToDate,
          lte: endTimeToDate
        }
      };
      const data = await ctx.db.order.findMany({
        where: where as any,
        include: {
          orderItems: true
        }
      });
      const revenueByOrderStatus = data.reduce((acc: any, item: any) => {
        const existed = acc.find((it: any) => it?.status === item?.status);
        if (!existed) {
          acc.push({
            status: item?.status,
            totalOrders: 1,
            profit: item?.finalTotal || 0
          });
        } else {
          existed.totalOrders += 1;
          existed.profit += item?.finalTotal || 0;
        }
        return acc;
      }, []);
      return revenueByOrderStatus;
    }),
  getRevenueByCategory: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { startTime, endTime } = input;
      const startTimeToDate = startTime && new Date(startTime);
      const endTimeToDate = endTime && new Date(endTime);
      const where = {
        createdAt: {
          gte: startTimeToDate,
          lte: endTimeToDate
        }
      };
      const data = await ctx.db.orderItem.findMany({
        where: where as any,
        include: {
          product: {
            select: {
              subCategory: true
            }
          }
        }
      });

      const revenueByCategory = data.reduce((acc: any, item: any) => {
        const categoryName = item?.product?.subCategory?.name || 'Khác';
        const total = item.price * item.quantity;

        if (!acc[categoryName]) {
          acc[categoryName] = 0;
        }
        acc[categoryName] += total;
        return acc;
      }, {});

      return revenueByCategory;
    }),

  create: publicProcedure
    .use(requirePermission('create:revenue'))
    .input(
      z.object({
        userId: z.string(),
        totalSpent: z.number(),
        totalOrders: z.number(),
        day: z.number(),
        year: z.number(),
        month: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.revenue.create({
        data: {
          userId: input.userId,
          totalSpent: input.totalSpent,
          totalOrders: input.totalOrders,
          day: input.day,
          year: input.year,
          month: input.month
        }
      });
    }),
  update: publicProcedure
    .use(requirePermission('update:revenue'))
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
        totalSpent: z.number(),
        totalOrders: z.number(),
        day: z.number(),
        year: z.number(),
        month: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.revenue.update({
        where: {
          id: input.id
        },
        data: {
          userId: input.userId,
          totalSpent: input.totalSpent,
          totalOrders: input.totalOrders,
          day: input.day,
          year: input.year,
          month: input.month
        }
      });
    }),
  getOne: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return await ctx.db.revenue.findUnique({
      where: {
        id: input.id
      }
    });
  }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.revenue.findMany({});
  }),
  getOverview: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { startTime, endTime } = input;
      let startTimeToDate, endTimeToDate, firstRevenue: any;
      if (startTime && endTime) {
        startTimeToDate = startTime ? new Date(startTime) : undefined;
        endTimeToDate = endTime ? new Date(endTime) : undefined;
      } else {
        firstRevenue = await ctx.db.restaurant.findFirst();
        startTimeToDate = firstRevenue?.createdAt;
        endTimeToDate = new Date();
      }
      const where = startTimeToDate &&
        endTimeToDate && {
          createdAt: {
            gte: startTimeToDate,
            lte: endTimeToDate
          }
        };

      const [totalFinal, totalUsers, totalOrders, totalProducts, revenues, users, orders] = await Promise.allSettled([
        getCompare({
          db: ctx.db,
          model: 'revenue',
          mode: 'sum',
          field: 'totalSpent',
          startDate: startTimeToDate,
          endDate: endTimeToDate
        }),
        getCompare({
          db: ctx.db,
          model: 'user',
          mode: 'count',
          field: 'id',
          startDate: startTimeToDate,
          endDate: endTimeToDate
        }),
        getCompare({
          db: ctx.db,
          model: 'order',
          mode: 'count',
          field: 'id',
          startDate: startTimeToDate,
          endDate: endTimeToDate
        }),
        getCompare({
          db: ctx.db,
          model: 'product',
          mode: 'count',
          field: 'id',
          startDate: startTimeToDate,
          endDate: endTimeToDate
        }),
        ctx.db.revenue.groupBy({
          by: ['day', 'month', 'year'],
          _sum: { totalSpent: true, totalOrders: true },
          where: where as any
        }),
        ctx.db.user.findMany({
          where: where as any
        }),
        ctx.db.order.findMany({
          where: where as any,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        })
      ]);

      return {
        revenues:
          revenues.status === 'fulfilled'
            ? revenues.value.map((item: any) => {
                return {
                  day: item.day,
                  month: item.month,
                  year: item.year,
                  totalSpent: item._sum.totalSpent,
                  totalOrders: item._sum.totalOrders,
                  createdAt: firstRevenue?.updatedAt || new Date()
                };
              })
            : null,
        totalUsers:
          totalUsers.status === 'fulfilled'
            ? totalUsers.value
            : { currentValue: 0, previousValue: 0, changeRate: null },
        totalOrders:
          totalOrders.status === 'fulfilled'
            ? totalOrders.value
            : { currentValue: 0, previousValue: 0, changeRate: null },
        totalProducts:
          totalProducts.status === 'fulfilled'
            ? totalProducts.value
            : { currentValue: 0, previousValue: 0, changeRate: null },
        totalFinalRevenue:
          totalFinal.status === 'fulfilled'
            ? totalFinal.value
            : { currentValue: 0, previousValue: 0, changeRate: null },
        users: users.status === 'fulfilled' ? users.value : [],
        orders: orders.status === 'fulfilled' ? orders.value : []
      };
    }),
  getOverviewDetail: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { startTime, endTime } = input;
      let startTimeToDate, endTimeToDate;
      if (startTime && endTime) {
        startTimeToDate = startTime ? new Date(startTime) : undefined;
        endTimeToDate = endTime ? new Date(endTime) : undefined;
      }
      const where = startTimeToDate &&
        endTimeToDate && {
          createdAt: {
            gte: startTimeToDate,
            lte: endTimeToDate
          }
        };

      const [totalFinal, totalUsers, totalOrders, revenues, users, orders, categories, revenueByUser] =
        await Promise.allSettled([
          ctx.db.revenue.aggregate({
            _sum: { totalSpent: true, totalOrders: true },
            where: where as any
          }),
          ctx.db.user.aggregate({
            _count: { id: true },
            where: where as any
          }),
          ctx.db.order.aggregate({
            _count: { id: true },
            where: where as any
          }),
          ctx.db.revenue.groupBy({
            by: ['day', 'month', 'year'],
            _sum: { totalSpent: true, totalOrders: true },
            where: where as any
          }),
          ctx.db.user.findMany({
            where: where as any
          }),
          ctx.db.order.findMany({
            where: where as any,
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }),
          ctx.db.orderItem.findMany({
            include: {
              product: {
                select: {
                  subCategory: true
                }
              }
            }
          }),
          ctx.db.revenue.groupBy({
            by: ['userId'],
            where: where as any,
            _sum: { totalSpent: true, totalOrders: true },
            orderBy: { _sum: { totalSpent: 'desc' } },
            take: 5
          })
        ]);

      //revenue by day

      let period = -1;
      let labels: string[] = [];

      if (startTime && endTime) {
        period = !(endTime - startTime) ? 1 : (endTime - startTime) / (24 * 60 * 60 * 1000) + 1;
        labels = Array.from({ length: +period }, (_, i) => {
          const currentDate = new Date(endTime - (period !== 1 ? (+period - i - 1) * 24 * 60 * 60 * 1000 : 0));
          return `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
        });
      }
      const summaryRevenue: Record<string, number> = {};
      labels.forEach(label => {
        summaryRevenue[label] = 0;
      });
      revenues.status === 'fulfilled' &&
        revenues.value.forEach((revenue: any) => {
          const day = +revenue.day;
          const month = +revenue.month;
          const year = +revenue.year;
          const key = `${day}/${month}/${year}`;
          if (labels.includes(key)) {
            summaryRevenue[key]! += Number(revenue._sum.totalSpent);
          }
        });

      //revenue by category

      const revenueByCategory =
        categories.status === 'fulfilled'
          ? categories.value.reduce((acc: any, item: any) => {
              const categoryName = item?.product?.subCategory?.name || 'Khác';
              const total = item.price * item.quantity;
              const existed = acc.find((item: { category: string; revenue: number }) => item.category === categoryName);
              if (!existed) {
                acc.push({
                  category: categoryName,
                  revenue: total
                });
              } else {
                existed.revenue += total;
              }
              return acc;
            }, [])
          : [];

      //top user
      const userIds =
        (revenueByUser.status === 'fulfilled' && revenueByUser.value.map(revenue => revenue.userId)) || [];

      const userData =
        userIds?.length > 0
          ? await ctx.db.user.findMany({
              where: {
                id: { in: userIds }
              },
              select: {
                id: true,
                name: true,
                email: true
              }
            })
          : [];
      const topUsers =
        (revenueByUser.status === 'fulfilled' &&
          revenueByUser.value.map(item => {
            const user = userData.find((user: any) => user.id === item.userId);
            return {
              totalSpent: item._sum.totalSpent,
              totalOrders: item._sum.totalOrders,
              name: user?.name || 'Đang cập nhật'
            };
          })) ||
        [];
      return {
        revenuePeriod: labels.map(label => ({
          date: `Ngày ${label}`,
          revenue: summaryRevenue[label] || 0
        })),
        totalUsers: totalUsers.status === 'fulfilled' ? totalUsers.value._count.id : 0,
        totalOrders: totalOrders.status === 'fulfilled' ? totalOrders.value._count.id : 0,
        totalFinalRevenue: totalFinal.status === 'fulfilled' ? totalFinal.value._sum.totalSpent : 0,
        recentUsers: users.status === 'fulfilled' ? users.value : [],
        recentOrders: orders.status === 'fulfilled' ? orders.value : [],
        revenueByCategory,
        topUsers
      };
    })
});
