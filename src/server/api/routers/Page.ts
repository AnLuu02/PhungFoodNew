import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import {
  getInitAboutUs,
  getInitAdminPageService,
  getInitPageService,
  getInitProductDetailPageService,
  getInitReportPageService
} from '~/server/services/page.service';
import { Period } from '~/shared/types';

export const pageRouter = createTRPCRouter({
  getInit: publicProcedure.query(async ({ ctx }) => await getInitPageService(ctx.db)),
  getInitAboutUs: publicProcedure.query(async ({ ctx }) => await getInitAboutUs(ctx.db)),
  getInitProductDetail: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => await getInitProductDetailPageService(ctx.db, input)),
  getInitAdmin: publicProcedure.query(async ({ ctx }) => await getInitAdminPageService(ctx.db)),
  getInitReport: publicProcedure
    .input(
      z.object({
        startTime: z.number().optional(),
        endTime: z.number().optional(),
        period: z.custom<Period>()
      })
    )
    .query(async ({ ctx, input }) => await getInitReportPageService(ctx.db, input))
});
