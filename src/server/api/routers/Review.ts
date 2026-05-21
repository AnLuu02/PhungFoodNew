import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { activityLogger, createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import {
  deleteReviewService,
  findReviewService,
  getAllReviewService,
  getOneReviewService,
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
        sort: z.array(z.string()).optional(),
        include: z.custom<Prisma.ReviewInclude>().optional()
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

  //getFilter
  getForOwner: publicProcedure
    .input(
      z.object({
        ownerId: z.string(),
        include: z.custom<Prisma.ReviewInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await getReviewForOwnerService(ctx.db, input)),
  getOne: publicProcedure
    .input(
      z.object({
        id: z.string(),
        include: z.custom<Prisma.ReviewInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await getOneReviewService(ctx.db, input)),
  getAll: publicProcedure
    .input(
      z
        .object({
          include: z.custom<Prisma.ReviewInclude>().optional()
        })
        .optional()
    )
    .query(async ({ ctx, input }) => await getAllReviewService(ctx.db, input)),

  upsert: publicProcedure
    .use(requirePermission('update:review'))
    .use(requirePermission('create:review'))
    .use(activityLogger)
    .input(baseReviewSchema)
    .mutation(async ({ ctx, input }) => await upsertReviewService(ctx.db, input))
});
