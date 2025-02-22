import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

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
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Name is required'),
        description: z.string().optional(),
        tag: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingCategory = await ctx.db.category.findMany({
        where: {
          tag: input.tag
        }
      });

      if (!existingCategory?.length) {
        const category = await ctx.db.category.create({
          data: {
            name: input.name,
            tag: input.tag,
            description: input.description
          }
        });
        return {
          success: true,
          message: 'Tạo danh mục thành công.',
          record: category
        };
      }
      return {
        success: false,
        message: 'Danh mục đã tồn tại. Hãy thử lại.',
        record: existingCategory
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
      if (!category) {
        throw new Error(`Stock with ID ${input.id} not found.`);
      }

      return {
        success: true,
        message: 'Xóa danh mục thành công.',
        record: category
      };
    }),
  //
  //
  //
  //
  //
  //
  //----------------------------------------------------get filter
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
            { id: { contains: input.query, mode: 'insensitive' } }
            // { name: { contains: input.query, mode: 'insensitive' } }
          ]
        }
      });
      if (!category) {
        throw new Error(`Stock with ID ${input.query} not found.`);
      }
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
            { id: { contains: input.query, mode: 'insensitive' } }
            // { name: { contains: input.query, mode: 'insensitive' } }
          ]
        }
      });
      if (!category) {
        throw new Error(`Stock with ID ${input.query} not found.`);
      }
      return category;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const category = await ctx.db.category.findMany({
      include: {
        subCategory: true
      }
    });
    return category;
  }),

  update: publicProcedure
    .input(
      z.object({
        categoryId: z.string(),
        name: z.string().min(1, 'Name is required'),
        tag: z.string().min(1, 'Tag is required'),
        description: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingCategory: any = await ctx.db.category.findFirst({
        where: {
          tag: input.tag
        }
      });

      if (!existingCategory || (existingCategory && existingCategory?.id == input?.categoryId)) {
        const category = await ctx.db.category.update({
          where: { id: input?.categoryId },
          data: {
            name: input.name,
            description: input.description,
            tag: input.tag
          }
        });
        return {
          success: true,
          message: 'Cập nhật danh mục thành công.',
          record: category
        };
      }

      return {
        success: false,
        message: 'Danh mục đã tồn tại. Hãy thử lại.',
        record: existingCategory
      };
    })
});
