import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import {
  createRevenueService,
  getAllRevenueService,
  getDistributionProductsService,
  getOneRevenueService,
  getOverviewDetailRevenueService,
  getOverviewRevenueService,
  getRevenueByCategoryService,
  getRevenueOrderStatusService,
  getTopProductsService,
  getTopUsersService,
  getTotalSpentInMonthByUserService,
  updateRevenueService
} from '~/server/services/revenue.service';

export const revenueRouter = createTRPCRouter({
  getTotalSpentInMonthByUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        year: z.number()
      })
    )

    .query(async ({ ctx, input }) => await getTotalSpentInMonthByUserService(ctx.db, input)),

  getTopUsers: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional(),
        limit: z.number().optional().optional()
      })
    )
    .query(async ({ ctx, input }) => await getTopUsersService(ctx.db, input)),
  getTopProducts: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => await getTopProductsService(ctx.db, input)),
  getDistributionProducts: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => await getDistributionProductsService(ctx.db, input)),
  getRevenueOrderStatus: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => await getRevenueOrderStatusService(ctx.db, input)),
  getRevenueByCategory: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => await getRevenueByCategoryService(ctx.db, input)),

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
    .mutation(async ({ ctx, input }) => await createRevenueService(ctx.db, input)),
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
    .mutation(async ({ ctx, input }) => await updateRevenueService(ctx.db, input)),
  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => await getOneRevenueService(ctx.db, input)),
  getAll: publicProcedure.query(async ({ ctx }) => await getAllRevenueService(ctx.db)),
  getOverview: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => await getOverviewRevenueService(ctx.db, input)),
  getOverviewDetail: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => getOverviewDetailRevenueService(ctx.db, input))
});
