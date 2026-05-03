import { z } from 'zod';

import { activityLogger, createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import {
  deleteProductService,
  findInfiniteProductService,
  findProductService,
  getAllProductService,
  getOneProductService,
  upsertProductToCloudinaryService
} from '~/server/services/product.service';
import { productFilterSchema } from '~/shared/schema/product.filter.schema';
import { productFromDbSchema } from '~/shared/schema/product.schema';

export const productRouter = createTRPCRouter({
  find: publicProcedure
    .input(productFilterSchema)
    .query(async ({ ctx, input }) => await findProductService(ctx.db, input)),
  upsertToCloudinary: publicProcedure
    .use(requirePermission('update:product'))
    .use(requirePermission('create:product'))
    .use(activityLogger)
    .input(productFromDbSchema) //
    .mutation(async ({ ctx, input }) => await upsertProductToCloudinaryService(ctx.db, input)),

  delete: publicProcedure
    .use(requirePermission('delete:product'))
    .use(activityLogger)
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteProductService(ctx.db, input)),
  getOne: publicProcedure
    .input(
      z.object({
        s: z.string(),
        hasCategory: z.boolean().default(false).optional(),
        hasCategoryChild: z.boolean().default(false).optional(),
        hasReview: z.boolean().default(false).optional(),
        hasUser: z.boolean().default(false).optional(),
        userRole: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => await getOneProductService(ctx.db, input)),
  getAll: publicProcedure
    .input(
      z.object({
        hasCategory: z.boolean().default(false).optional(),
        hasCategoryChild: z.boolean().default(false).optional(),
        hasReview: z.boolean().default(false).optional(),
        userRole: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => await getAllProductService(ctx.db, input)),
  findInfiniteProduct: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        filters: z
          .object({
            search: z.string().optional(),
            'danh-muc': z.string().nullish()
          })
          .optional()
      })
    )
    .query(async ({ ctx, input }) => await findInfiniteProductService(ctx.db, input))
});
