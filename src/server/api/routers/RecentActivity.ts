import { z } from 'zod';
import { getRecentActivityAppService, getRecentActivityService } from '~/server/services/recentActivity.service';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const recentActivityRouter = createTRPCRouter({
  getRecentActivity: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => await getRecentActivityService(ctx.db, input)),
  getRecentActivityApp: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => await getRecentActivityAppService(ctx.db, input))
});
