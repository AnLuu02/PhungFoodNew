import { OrderStatus } from '@prisma/client';
import { z } from 'zod';
import { LocalOrderStatus } from '~/lib/zod/EnumType';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export async function updateRevenue(ctx: any, status: OrderStatus, userId: string, orderTotal: number) {
  const now = new Date();
  const date = now.getDate();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  await ctx.db.revenue.upsert({
    where: { userId_year_month_date: { userId, year, month, date } },
    update: {
      totalSpent: status === LocalOrderStatus.COMPLETED ? { increment: orderTotal } : { decrement: orderTotal },
      totalOrders: status === LocalOrderStatus.COMPLETED ? { increment: 1 } : { decrement: 1 }
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
  getTotalSpentInYearByUser: publicProcedure
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
  getTotalSpentByMonth: publicProcedure
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
        year: z.number().optional(),
        limit: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const revenues = await ctx.db.revenue.groupBy({
        by: ['userId'],
        where: input.year ? { year: input.year } : {},
        _sum: { totalSpent: true },
        orderBy: { _sum: { totalSpent: 'desc' } },
        take: input.limit || 5
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
  }),
  getRevenueByDuringDate: publicProcedure
    .input(
      z.object({
        period: z.enum(['7 ngày', '30 ngày', '3 tháng']).optional(),
        categoryId: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { period, categoryId } = input;
      const now = new Date();
      let startDate = new Date();

      if (period === '7 ngày') {
        startDate.setDate(now.getDate() - 7);
      } else if (period === '30 ngày') {
        startDate.setDate(now.getDate() - 30);
      } else if (period === '3 tháng') {
        startDate.setMonth(now.getMonth() - 3);
      }

      const revenues = await ctx.db.revenue.findMany({
        where: {
          createdAt: { gte: startDate },
          ...(categoryId && { categoryId })
        },
        select: {
          date: true,
          month: true,
          year: true,
          totalSpent: true
        },
        orderBy: { createdAt: 'asc' }
      });

      return revenues.map(item => ({
        date: `${item.year}-${String(item.month).padStart(2, '0')}-${String(item.date).padStart(2, '0')}`,
        sales: item.totalSpent
      }));
    })
});
