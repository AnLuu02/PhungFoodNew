import { z } from 'zod';

import { createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import {
  deleteReviewService,
  findReviewService,
  getAllReviewService,
  getFilterReviewService,
  getOneReviewService,
  upsertReviewService
} from '~/server/services/review.service';
import { baseReviewSchema } from '~/shared/schema/review.schema';

export const reviewRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional(),
        sort: z.array(z.string()).optional()
      })
    )
    .query(async ({ ctx, input }) => await findReviewService(ctx.db, input)),

  delete: publicProcedure
    .use(requirePermission('delete:review'))
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteReviewService(ctx.db, input)),

  getFilter: publicProcedure
    .input(
      z.object({
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => await getFilterReviewService(ctx.db, input)),
  getOne: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ ctx, input }) => await getOneReviewService(ctx.db, input)),
  getAll: publicProcedure.query(async ({ ctx }) => await getAllReviewService(ctx.db)),

  upsert: publicProcedure
    .use(requirePermission('update:review'))
    .use(requirePermission('create:review'))
    .input(baseReviewSchema)
    .mutation(async ({ ctx, input }) => await upsertReviewService(ctx.db, input))
});
