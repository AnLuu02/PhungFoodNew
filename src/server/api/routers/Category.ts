import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { withRedisCache } from '~/lib/CacheConfig/withRedisCache';
import {
  activityLogger,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  requirePermission
} from '~/server/api/trpc';
import {
  createManyCategoryService,
  deleteCategoryService,
  findCategoryService,
  getAllCategoryService,
  getOneCategoryService,
  upsertCategoryService
} from '~/server/services/category.service';
import { baseCategorySchema } from '~/shared/schema/category.schema';
export const categoryRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(5),
        s: z.string().optional(),
        include: z.custom<Prisma.CategoryInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await findCategoryService(ctx.db, input)),

  delete: protectedProcedure
    .use(requirePermission('delete:category'))
    .use(activityLogger)
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteCategoryService(ctx.db, input, ctx.session)),

  getOne: publicProcedure
    .input(
      z.object({
        key: z.string(),
        include: z.custom<Prisma.CategoryInclude>().optional()
      })
    )
    .query(async ({ ctx, input }) => await getOneCategoryService(ctx.db, input)),
  getAll: publicProcedure
    .input(
      z
        .object({
          include: z.custom<Prisma.CategoryInclude>().optional()
        })
        .optional()
    )
    .query(
      async ({ ctx, input }) =>
        await withRedisCache('category:getAll', () => getAllCategoryService(ctx.db, input), 60 * 60 * 24)
    ),
  createMany: publicProcedure
    .use(requirePermission('create:category'))
    .input(
      z.object({
        data: z.array(baseCategorySchema)
      })
    )
    .mutation(async ({ ctx, input }) => await createManyCategoryService(ctx.db, input)),
  upsert: protectedProcedure
    .use(requirePermission('update:category'))
    .use(requirePermission('create:category'))
    .use(activityLogger)
    .input(baseCategorySchema)
    .mutation(async ({ ctx, input }) => await upsertCategoryService(ctx.db, input))
});
