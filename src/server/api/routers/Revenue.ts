import { OrderStatus } from '@prisma/client';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export async function updateRevenue(ctx: any, status: OrderStatus, userId: string, orderTotal: number) {
  const now = new Date();
  const date = now.getDate();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  await ctx.db.revenue.upsert({
    where: { userId_year_month_date: { userId, year, month, date } },
    update: {
      totalSpent: status === OrderStatus.COMPLETED ? { increment: orderTotal } : { decrement: orderTotal },
      totalOrders: status === OrderStatus.COMPLETED ? { increment: 1 } : { decrement: 1 }
    },
    create: { userId, date, year, month, totalSpent: orderTotal, totalOrders: 1 }
  });

  const revenue = await ctx.db.revenue.findUnique({
    where: { userId_year_month: { userId, year, month } },
    select: { totalOrders: true }
  });

  if (revenue?.totalOrders === 0) {
    await ctx.db.revenue.delete({
      where: { userId_year_month: { userId, year, month } }
    });
  }
}

export const revenueRouter = createTRPCRouter({
  getOneUserTotalSpentByYear: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        year: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const revenues = await ctx.db.revenue.aggregate({
        _sum: { totalSpent: true },
        where: {
          userId: input.userId,
          year: input.year || 2025
        }
      });
      return {
        totalSpent: revenues._sum.totalSpent,
        year: input.year
      };
    }),
  getOneUserMonthlySpending: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        year: z.number()
      })
    )

    .query(async ({ ctx, input }) => {
      const revenues = await ctx.db.revenue.findMany({
        where: { userId: input.userId, year: input.year || 2025 },
        select: { month: true, totalSpent: true },
        orderBy: { month: 'asc' }
      });
      return revenues?.map(item => {
        return {
          month: item.month,
          totalSpent: item.totalSpent,
          year: input.year
        };
      });
    }),
  getTotalSpendingByMonth: publicProcedure
    .input(
      z.object({
        year: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const revenues = await ctx.db.revenue.groupBy({
        by: ['month'],
        where: { year: input.year || 2025 },
        _sum: { totalSpent: true },
        orderBy: { month: 'asc' }
      });
      return revenues;
    }),
  getTopUsers: publicProcedure
    .input(
      z.object({
        year: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const revenues = await ctx.db.revenue.groupBy({
        by: ['userId'],
        where: { year: input.year || 2025 },
        _sum: { totalSpent: true },
        orderBy: { _sum: { totalSpent: 'desc' } },
        take: 5
      });
      return revenues;
    }),
  getRevenueByUser: publicProcedure.query(async ({ ctx }) => {
    const revenues = await ctx.db.revenue.groupBy({
      by: ['userId'],
      _sum: { totalSpent: true, totalOrders: true }
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

    const result = revenues.map(revenue => {
      const user = users.find((user: any) => user.id === revenue.userId);
      return {
        userId: revenue.userId,
        totalSpent: revenue._sum.totalSpent,
        totalOrders: revenue._sum.totalOrders,
        user: user || null
      };
    });

    return result;
  }),
  getRevenueByDate: publicProcedure.query(async ({ ctx }) => {
    const revenues = await ctx.db.revenue.groupBy({
      by: ['date', 'month', 'year'],
      _sum: { totalSpent: true, totalOrders: true }
    });
    return revenues?.map((item: any) => {
      return {
        date: item.date,
        month: item.month,
        year: item.year,
        createdAt: new Date(`${item.year}-${item.month}-${item.date}`),
        totalSpent: item._sum.totalSpent,
        totalOrders: item._sum.totalOrders
      };
    });
  })
});
