import { z } from 'zod';
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
  getFilterCategoryService,
  getOneCategoryService,
  upsertCategoryService
} from '~/server/services/category.service';
import { baseCategorySchema } from '~/shared/schema/category.schema';
export const categoryRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional()
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

  getFilter: publicProcedure
    .input(
      z.object({
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => await getFilterCategoryService(ctx.db, input)),
  getOne: publicProcedure
    .input(
      z.object({
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => await getOneCategoryService(ctx.db, input)),
  getAll: publicProcedure.query(async ({ ctx }) => await getAllCategoryService(ctx.db)),
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
