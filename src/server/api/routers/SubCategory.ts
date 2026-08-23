import { z } from 'zod';
import { withRedisCache } from '~/lib/CacheConfig/withRedisCache';

import { activityLogger, createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import {
  deleteSubCategoryService,
  findSubCategoryService,
  getBasicSubCategoryService,
  getSubCategoriesWithRelationBasicService,
  upsertSubCategoryService
} from '~/server/services/subCategory.service';
import { SUBCATEGORY_KEY } from '~/shared/constants/redis-keys';
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
          .optional()
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

  getBasic: publicProcedure
    .input(
      z.object({
        key: z.string()
      })
    )
    .query(async ({ ctx, input }) => await getBasicSubCategoryService(ctx.db, input)),

  getSubCategoriesOnly: publicProcedure.query(async ({ ctx }) => {
    return await withRedisCache(SUBCATEGORY_KEY.only, () => ctx.db.subCategory.findMany({}), 60 * 60 * 24);
  }),

  getSubCategoriesWithRelationBasic: publicProcedure.query(
    async ({ ctx }) =>
      await withRedisCache(
        SUBCATEGORY_KEY.withRelationBase,
        () => getSubCategoriesWithRelationBasicService(ctx.db),
        60 * 60 * 24
      )
  ),

  upsert: publicProcedure
    .use(requirePermission('update:subCategory'))
    .use(requirePermission('create:subCategory'))
    .use(activityLogger)
    .input(subCategoryInputSchema)
    .mutation(async ({ ctx, input }) => await upsertSubCategoryService(ctx.db, input))
});
