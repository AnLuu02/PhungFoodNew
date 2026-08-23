import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { activityLogger, createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import {
  deleteReviewService,
  findReviewService,
  getBaseReviewService,
  getReviewForOwnerService,
  upsertReviewService
} from '~/server/services/review.service';
import { baseReviewSchema } from '~/shared/schema/review.schema';

export const reviewRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(5),
        s: z.string().optional(),
        relationId: z.string().optional(),
        sort: z.array(z.string()).optional()
      })
    )
    .query(async ({ ctx, input }) => await findReviewService(ctx.db, input)),

  delete: publicProcedure
    .use(activityLogger)
    .use(requirePermission('delete:review'))
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteReviewService(ctx.db, input)),

  getForOwner: publicProcedure
    .input(
      z.object({
        ownerId: z.string(),
        include: z.custom<Prisma.ReviewInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await getReviewForOwnerService(ctx.db, input)),
  getReviewsOnlyForOwner: publicProcedure
    .input(
      z.object({
        ownerId: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.review.findMany({
        where: {
          OR: [
            { productId: input.ownerId },
            {
              userId: input.ownerId
            }
          ]
        }
      });
    }),

  getReviewsOnly: publicProcedure.query(async ({ ctx, input }) => {
    return await ctx.db.review.findMany({});
  }),

  getBase: publicProcedure
    .input(
      z.object({
        key: z.string()
      })
    )
    .query(async ({ ctx, input }) => await getBaseReviewService(ctx.db, input)),

  upsert: publicProcedure
    .use(requirePermission('update:review'))
    .use(requirePermission('create:review'))
    .use(activityLogger)
    .input(baseReviewSchema)
    .mutation(async ({ ctx, input }) => await upsertReviewService(ctx.db, input))
});
