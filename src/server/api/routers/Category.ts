import { Prisma, ProductStatus } from '@prisma/client';
import { z } from 'zod';
import { CreateTagVi } from '~/app/lib/utils/func-handler/CreateTag-vi';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
const findExistingCategory = async (ctx: any, tag: string) => {
  return await ctx.db.category.findFirst({ where: { tag } });
};
export const categoryRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        query: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, query } = input;

      const startPageItem = skip > 0 ? (skip - 1) * take : 0;
      const [totalCategories, totalCategoriesQuery, categories] = await ctx.db.$transaction([
        ctx.db.category.count(),
        ctx.db.category.count({
          where: {
            OR: [
              {
                name: { contains: query?.trim(), mode: 'insensitive' }
              },
              {
                tag: { contains: query?.trim(), mode: 'insensitive' }
              },
              {
                description: { contains: query?.trim(), mode: 'insensitive' }
              }
            ]
          }
        }),
        ctx.db.category.findMany({
          skip: startPageItem,
          take,
          where: {
            OR: [
              {
                name: { contains: query?.trim(), mode: 'insensitive' }
              },
              {
                tag: { contains: query?.trim(), mode: 'insensitive' }
              },
              {
                description: { contains: query?.trim(), mode: 'insensitive' }
              }
            ]
          },
          include: {
            subCategory: {
              select: {
                id: true,
                name: true
              }
            }
          }
        })
      ]);
      const totalPages = Math.ceil(
        query?.trim() ? (totalCategoriesQuery == 0 ? 1 : totalCategoriesQuery / take) : totalCategories / take
      );
      const currentPage = skip ? Math.floor(skip / take + 1) : 1;

      return {
        categories,
        pagination: {
          currentPage,
          totalPages
        }
      };
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db.category.delete({
        where: { id: input.id }
      });

      return {
        success: true,
        message: 'Xóa danh mục thành công.',
        record: category
      };
    }),

  getFilter: publicProcedure
    .input(
      z.object({
        query: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.category.findMany({
        where: {
          OR: [
            { id: { equals: input.query?.trim() } },
            { name: { equals: input.query?.trim() } },
            { tag: { equals: input.query?.trim() } }
          ]
        }
      });

      return category;
    }),
  getOne: publicProcedure
    .input(
      z.object({
        query: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.category.findFirst({
        where: {
          OR: [
            { id: { equals: input.query?.trim() } },
            { name: { equals: input.query?.trim() } },
            { tag: { equals: input.query?.trim() } }
          ]
        }
      });

      return category;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const category = await ctx.db.category.findMany({
      include: {
        subCategory: {
          include: {
            image: true,
            product: {
              where: {
                status: ProductStatus.ACTIVE
              }
            }
          }
        }
      }
    });
    return category;
  }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Name is required'),
        description: z.string().optional(),
        tag: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingCategory = await findExistingCategory(ctx, input.tag);
      if (existingCategory) {
        return { success: false, message: 'Danh mục đã tồn tại.' };
      }
      const category = await ctx.db.category.create({
        data: input
      });
      if (category?.tag) {
        await CreateTagVi({ old: [], new: category });
      }
      return { success: true, message: 'Tạo danh mục thành công.', record: category };
    }),
  update: publicProcedure
    .input(
      z.object({
        where: z.record(z.any()),
        data: z.record(z.any())
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingCategory = await findExistingCategory(ctx, input.data.tag);

      if (existingCategory && existingCategory.id !== input.where.id) {
        return { success: false, message: 'Danh mục đã tồn tại.' };
      }

      const category = await ctx.db.category.update({
        where: input.where as Prisma.CategoryWhereUniqueInput,
        data: input.data as Prisma.CategoryUpdateInput
      });

      await CreateTagVi({ old: existingCategory, new: category });

      return { success: true, message: 'Cập nhật danh mục thành công.', record: category };
    })
});
