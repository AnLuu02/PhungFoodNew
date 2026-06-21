import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { activityLogger, createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import {
  deleteProductService,
  findInfiniteProductService,
  findProductService,
  getAllProductService,
  getFilterProductService,
  getOneProductService,
  upsertProductToCloudinaryService
} from '~/server/services/product.service';
import { TUserRole } from '~/shared/constants/user.constants';
import { productFilterSchema } from '~/shared/schema/product.filter.schema';
import { productFromDbSchema } from '~/shared/schema/product.schema';

export const productRouter = createTRPCRouter({
  find: publicProcedure
    .input(productFilterSchema.extend({ include: z.custom<Prisma.ProductInclude>().optional() }))
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
        key: z.string(),
        userRole: z.custom<TUserRole>().optional()
      })
    )
    .query(async ({ ctx, input }) => await getOneProductService(ctx.db, input)),
  getFilter: publicProcedure
    .input(
      z.object({
        keys: z.array(z.string()).optional(),
        s: z.string().optional(),
        excludes: z.array(z.string()).optional(),
        userRole: z.custom<TUserRole>().optional()
      })
    )
    .query(async ({ ctx, input }) => await getFilterProductService(ctx.db, input)),
  getAll: publicProcedure
    .input(
      z.object({
        include: z.custom<Prisma.ProductInclude>().optional(),
        userRole: z.custom<TUserRole>().optional()
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
          .optional(),
        include: z.custom<Prisma.ProductInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await findInfiniteProductService(ctx.db, input))
});
