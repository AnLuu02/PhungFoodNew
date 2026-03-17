import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import {
  getInitAdminPageService,
  getInitPageService,
  getInitProductDetailPageService,
  getInitReportPageService
} from '~/server/services/page.service';

export const pageRouter = createTRPCRouter({
  getInit: publicProcedure.query(async ({ ctx }) => await getInitPageService(ctx.db)),
  getInitProductDetail: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => await getInitProductDetailPageService(ctx.db, input)),
  getInitAdmin: publicProcedure.query(async ({ ctx }) => await getInitAdminPageService(ctx.db)),
  getInitReport: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => await getInitReportPageService(ctx.db, input))
});
