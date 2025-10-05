import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { seedCategory } from '~/lib/data-test/seed';
import { CreateTagVi } from '~/lib/func-handler/CreateTag-vi';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
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
    .query(async ({ ctx, input }) => {
      const { skip, take, s } = input;

      const startPageItem = skip > 0 ? (skip - 1) * take : 0;
      const [totalCategories, totalCategoriesQuery, categories] = await ctx.db.$transaction([
        ctx.db.category.count(),
        ctx.db.category.count({
          where: {
            OR: [
              {
                name: { contains: s?.trim(), mode: 'insensitive' }
              },
              {
                tag: { contains: s?.trim(), mode: 'insensitive' }
              },
              {
                description: { contains: s?.trim(), mode: 'insensitive' }
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
                name: { contains: s?.trim(), mode: 'insensitive' }
              },
              {
                tag: { contains: s?.trim(), mode: 'insensitive' }
              },
              {
                description: { contains: s?.trim(), mode: 'insensitive' }
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
        Object.entries(input)?.length > 2
          ? totalCategoriesQuery == 0
            ? 1
            : totalCategoriesQuery / take
          : totalCategories / take
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
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const category = await ctx.db.category.delete({
        where: { id: input.id }
      });

      return {
        code: 'OK',
        message: 'Xóa danh mục thành công.',
        data: category
      };
    }),

  getFilter: publicProcedure
    .input(
      z.object({
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.category.findMany({
        where: {
          OR: [
            { id: { equals: input.s?.trim() } },
            { name: { equals: input.s?.trim() } },
            { tag: { equals: input.s?.trim() } }
          ]
        }
      });

      return category;
    }),
  getOne: publicProcedure
    .input(
      z.object({
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.category.findFirst({
        where: {
          OR: [
            { id: { equals: input.s?.trim() } },
            { name: { equals: input.s?.trim() } },
            { tag: { equals: input.s?.trim() } }
          ]
        }
      });

      return category;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    let category = await ctx.db.category.findMany({
      include: {
        subCategory: {
          include: {
            image: true,
            product: {
              where: {
                isActive: true
              },
              include: {
                images: true
              }
            }
          }
        }
      }
    });

    if (!category?.length) {
      await ctx.db.category.createMany({
        data: seedCategory
      });
      category = await ctx.db.category.findMany({
        include: {
          subCategory: {
            include: {
              image: true,
              product: {
                where: {
                  isActive: true
                },
                include: {
                  images: true
                }
              }
            }
          }
        }
      });
    }

    return category;
  }),
  create: publicProcedure
    .input(
      z.object({
        isActive: z.boolean().default(true),
        name: z.string().min(1, 'Tên danh mục không được để trống'),
        description: z.string().optional(),
        tag: z.string()
      })
    )
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
    .input(
      z.object({
        data: z.array(
          z.object({
            name: z.string().min(1, 'Tên danh mục không được để trống'),
            description: z.string().optional(),
            tag: z.string()
          })
        )
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
    .input(
      z.object({
        where: z.record(z.any()),
        data: z.record(z.any())
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const existingCategory = await findExistingCategory(ctx, input.data.tag);

      if (existingCategory && existingCategory.id !== input.where.id) {
        return { code: 'CONFLICT', message: 'Danh mục đã tồn tại.', data: [] };
      }

      const category = await ctx.db.category.update({
        where: input.where as Prisma.CategoryWhereUniqueInput,
        data: input.data as Prisma.CategoryUpdateInput
      });

      await CreateTagVi({ old: existingCategory, new: category });

      return { code: 'OK', message: 'Cập nhật danh mục thành công.', data: category };
    })
});
