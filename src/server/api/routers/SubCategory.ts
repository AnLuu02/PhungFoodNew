import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { activityLogger, createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import {
  deleteSubCategoryService,
  findSubCategoryService,
  getAllSubCategoryService,
  getOneSubCategoryService,
  upsertSubCategoryService
} from '~/server/services/subCategory.service';
import { subCategoryInputSchema } from '~/shared/schema/subCategory.schema';

export const subCategoryRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(5),
        filters: z
          .object({
            s: z.string().optional(),
            status: z.enum(['active', 'inactive']).optional(),
            category: z.string().optional()
          })
          .optional(),
        include: z.custom<Prisma.SubCategoryInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await findSubCategoryService(ctx.db, input)),
  delete: publicProcedure
    .use(requirePermission('delete:subCategory'))
    .use(activityLogger)
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteSubCategoryService(ctx.db, input)),
  getOne: publicProcedure
    .input(
      z.object({
        key: z.string(),
        include: z.custom<Prisma.SubCategoryInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await getOneSubCategoryService(ctx.db, input)),
  getAll: publicProcedure
    .input(
      z
        .object({
          include: z.custom<Prisma.SubCategoryInclude>().optional()
        })
        .optional()
    )
    .query(async ({ ctx, input }) => await getAllSubCategoryService(ctx.db, input)),
  upsert: publicProcedure
    .use(requirePermission('update:subCategory'))
    .use(requirePermission('create:subCategory'))
    .use(activityLogger)
    .input(subCategoryInputSchema)
    .mutation(async ({ ctx, input }) => await upsertSubCategoryService(ctx.db, input))
});
