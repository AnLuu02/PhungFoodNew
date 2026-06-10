import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import {
  getDistributionProductsService,
  getOverviewDetailRevenueService,
  getOverviewRevenueService,
  getRevenueByCategoryService,
  getRevenueOrderStatusService,
  getStatisticsSpentUserService,
  getTopProductsService,
  getTopUsersService
} from '~/server/services/revenue.service';
import { Period } from '~/shared/types';

export const revenueRouter = createTRPCRouter({
  getStatisticsSpentUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        startTime: z.number().optional(),
        endTime: z.number().optional(),
        period: z.custom<Period>()
      })
    )

    .query(async ({ ctx, input }) => await getStatisticsSpentUserService(ctx.db, input)),

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

  getOverview: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional(),
        period: z.custom<Period>()
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
