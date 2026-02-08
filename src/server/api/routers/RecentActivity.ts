import { z } from 'zod';
import { getRecentActivity, getRecentActivityApp } from '~/server/services/recentActivity.service';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const recentActivityRouter = createTRPCRouter({
  getRecentActivity: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => getRecentActivity(ctx.db, input)),
  getRecentActivityApp: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => getRecentActivityApp(ctx.db, input))
});
