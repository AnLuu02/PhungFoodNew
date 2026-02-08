import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { CreateTagVi } from '~/lib/FuncHandler/CreateTag-vi';
import { categorySchema } from '~/lib/ZodSchema/schema';
import { createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import {
  deleteCategory,
  findCategories,
  getAllCategories,
  getFilterCategory,
  getOneCategory,
  updateCategory
} from '~/server/services/category.service';
import { ResponseTRPC } from '~/types/ResponseFetcher';
const findExistingCategory = async (ctx: any, tag: string) => {
  return await ctx.db.category.findFirst({ where: { tag } });
};
export const categoryRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => findCategories(ctx.db, input)),

  delete: publicProcedure
    .use(requirePermission('delete:category'))
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => deleteCategory(ctx.db, input.id)),

  getFilter: publicProcedure
    .input(
      z.object({
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => getFilterCategory(ctx.db, input.s)),
  getOne: publicProcedure
    .input(
      z.object({
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => getOneCategory(ctx.db, input.s)),
  getAll: publicProcedure.query(async ({ ctx }) => getAllCategories(ctx.db)),
  create: publicProcedure
    .use(requirePermission('create:category'))
    .input(categorySchema)
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const existingCategory = await findExistingCategory(ctx, input.tag);
      if (existingCategory) {
        return { code: 'CONFLICT', message: 'Danh mục đã tồn tại.', data: [] };
      }
      const category = await ctx.db.category.create({
        data: input
      });
      if (category?.tag) {
        await CreateTagVi({ old: [], new: category });
      }
      return {
        code: 'OK',
        message: 'Tạo danh mục thành công.',
        data: category
      };
    }),
  createMany: publicProcedure
    .use(requirePermission('create:category'))
    .input(
      z.object({
        data: z.array(categorySchema)
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

  update: publicProcedure
    .use(requirePermission('update:category'))
    .input(
      z.object({
        where: z.record(z.any()),
        data: z.record(z.any())
      })
    )
    .mutation(
      async ({ ctx, input }): Promise<ResponseTRPC> =>
        updateCategory(ctx.db, input.where as Prisma.CategoryWhereUniqueInput, input.data as Prisma.CategoryUpdateInput)
    )
});
