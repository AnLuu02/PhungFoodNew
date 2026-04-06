import { z } from 'zod';

import { createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import {
  deleteSubCategoryService,
  findSubCategoryService,
  getAllSubCategoryService,
  getOneSubCategoryService,
  upsertSubCategoryService
} from '~/server/services/subCategory.service';
import { subCategoryFromDbSchema } from '~/shared/schema/subCategory.schema';

export const subCategoryRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => await findSubCategoryService(ctx.db, input)),
  delete: publicProcedure
    .use(requirePermission('delete:subCategory'))

    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteSubCategoryService(ctx.db, input)),
  getOne: publicProcedure
    .input(
      z.object({
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => await getOneSubCategoryService(ctx.db, input)),
  getAll: publicProcedure.query(async ({ ctx }) => await getAllSubCategoryService(ctx.db)),
  upsert: publicProcedure
    .use(requirePermission('update:subCategory'))
    .use(requirePermission('create:subCategory'))
    .input(subCategoryFromDbSchema)
    .mutation(async ({ ctx, input }) => await upsertSubCategoryService(ctx.db, input))
});
