import { z } from 'zod';
import { CreateTagVi } from '~/lib/FuncHandler/CreateTag-vi';
import { createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import {
  deleteCategoryService,
  findCategoryService,
  getAllCategoryService,
  getFilterCategoryService,
  getOneCategoryService,
  upsertCategoryService
} from '~/server/services/category.service';
import { baseCategorySchema } from '~/shared/schema/category.schema';
import { ResponseTRPC } from '~/types/ResponseFetcher';
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

  delete: publicProcedure
    .use(requirePermission('delete:category'))
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteCategoryService(ctx.db, input)),

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
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const existingTags = await ctx.db.category.findMany({
        where: {
          tag: { in: input.data.map(item => item.tag) }
        },
        select: { tag: true }
      });

      const existingTagSet = new Set(existingTags.map(item => item.tag));
      const newData = input.data.filter(item => !existingTagSet.has(item.tag));

      if (newData.length === 0) {
        return { code: 'CONFLICT', message: 'Tất cả danh mục đều đã tồn tại.', data: [] };
      }

      const categories = await ctx.db.category.createMany({
        data: newData
      });

      if (newData?.length > 0) {
        for (const category of newData) {
          await CreateTagVi({ old: [], new: [category] });
        }
      }

      return {
        code: 'OK',
        message: `Đã thêm ${categories.count} danh mục mới.`,
        data: newData
      };
    }),
  upsert: publicProcedure
    .use(requirePermission('update:category'))
    .use(requirePermission('create:category'))
    .input(baseCategorySchema)
    .mutation(async ({ ctx, input }) => await upsertCategoryService(ctx.db, input))
});
