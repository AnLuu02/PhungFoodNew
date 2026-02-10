import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import {
  create,
  getAll,
  getDistributionProducts,
  getOne,
  getOverview,
  getOverviewDetail,
  getRevenueByCategory,
  getRevenueOrderStatus,
  getTopProducts,
  getTopUsers,
  getTotalSpentInMonthByUser,
  update
} from '~/server/services/revenue.service';

export const revenueRouter = createTRPCRouter({
  getTotalSpentInMonthByUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        year: z.number()
      })
    )

    .query(async ({ ctx, input }) => getTotalSpentInMonthByUser(ctx.db, input)),

  getTopUsers: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional(),
        limit: z.number().optional().optional()
      })
    )
    .query(async ({ ctx, input }) => getTopUsers(ctx.db, input)),
  getTopProducts: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => getTopProducts(ctx.db, input)),
  getDistributionProducts: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => getDistributionProducts(ctx.db, input)),
  getRevenueOrderStatus: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => getRevenueOrderStatus(ctx.db, input)),
  getRevenueByCategory: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => getRevenueByCategory(ctx.db, input)),

  create: publicProcedure
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
    .mutation(async ({ ctx, input }) => create(ctx.db, input)),
  update: publicProcedure
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
    .mutation(async ({ ctx, input }) => update(ctx.db, input)),
  getOne: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => getOne(ctx.db, input)),
  getAll: publicProcedure.query(async ({ ctx }) => getAll(ctx.db)),
  getOverview: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => getOverview(ctx.db, input)),
  getOverviewDetail: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => getOverviewDetail(ctx.db, input))
});
