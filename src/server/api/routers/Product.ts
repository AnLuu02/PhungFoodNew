import { z } from 'zod';

import { activityLogger, createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import {
  deleteProductService,
  findProductService,
  getAllProductService,
  getOneProductService,
  upsertProductToCloudinaryService
} from '~/server/services/product.service';
import { productFromDbSchema } from '~/shared/schema/product.schema';

export const productRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional(),
        filter: z.string().optional(),
        sort: z.array(z.string()).optional(),
        'nguyen-lieu': z.array(z.string()).optional(),
        discount: z.boolean().optional(),
        bestSaler: z.boolean().optional(),
        newProduct: z.boolean().optional(),
        rating: z.number().optional(),
        hotProduct: z.boolean().optional(),
        'danh-muc': z.string().optional(),
        'loai-san-pham': z.string().optional(),
        price: z
          .object({
            min: z.number().optional(),
            max: z.number().optional()
          })
          .optional(),
        userRole: z.string().optional()
      })
    )
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
    .query(async ({ ctx, input }) => await getAllProductService(ctx.db, input))
});
