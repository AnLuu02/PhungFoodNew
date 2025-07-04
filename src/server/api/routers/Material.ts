import { z } from 'zod';
import { withRedisCache } from '~/lib/cache/withRedisCache';
import { CreateTagVi } from '~/lib/func-handler/CreateTag-vi';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const materialRouter = createTRPCRouter({
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
      const [totalMaterials, totalMaterialsQuery, materials] = await ctx.db.$transaction([
        ctx.db.material.count(),
        ctx.db.material.count({
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
        ctx.db.material.findMany({
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
            products: true
          }
        })
      ]);
      const totalPages = Math.ceil(
        s?.trim() ? (totalMaterialsQuery == 0 ? 1 : totalMaterialsQuery / take) : totalMaterials / take
      );
      const currentPage = skip ? Math.floor(skip / take + 1) : 1;

      return {
        materials,
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
        tag: z.string(),
        description: z.string().optional(),
        category: z.string().min(1, 'Category is required')
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingMaterial = await ctx.db.material.findMany({
        where: {
          tag: input.tag
        }
      });

      if (!existingMaterial?.length) {
        const material = await ctx.db.material.create({
          data: {
            name: input.name,
            tag: input.tag,
            description: input.description,
            category: input.category
          }
        });
        if (material?.tag) {
          await CreateTagVi({ old: [], new: material });
        }
        return {
          success: true,
          message: 'Tạo nguyên liệu thành công.',
          record: material
        };
      }
      return {
        success: false,
        message: 'Nguyên liệu đã tồn tại. ',
        record: existingMaterial
      };
    }),
  createMany: publicProcedure
    .input(
      z.object({
        data: z.array(
          z.object({
            name: z.string().min(1, 'Name is required'),
            tag: z.string(),
            description: z.string().optional(),
            category: z.string().min(1, 'Category is required')
          })
        )
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingTags = await ctx.db.material.findMany({
        where: {
          tag: { in: input.data.map(item => item.tag) }
        },
        select: { tag: true }
      });

      const existingTagSet = new Set(existingTags.map(item => item.tag));
      const newData = input.data.filter(item => !existingTagSet.has(item.tag));

      if (newData.length === 0) {
        return { success: false, message: 'Tất cả nguyên liệu đều đã tồn tại.' };
      }

      const materials = await ctx.db.material.createMany({
        data: newData
      });

      if (newData?.length > 0) {
        for (const material of newData) {
          await CreateTagVi({ old: [], new: material });
        }
      }

      return {
        success: true,
        message: `Đã thêm ${materials.count} nguyên liệu mới.`,
        record: newData
      };
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const material = await ctx.db.material.delete({
        where: { id: input.id }
      });

      return {
        success: true,
        message: 'Xóa nguyên liệu thành công.',
        record: material
      };
    }),

  getOne: publicProcedure
    .input(
      z.object({
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const material = await ctx.db.material.findFirst({
        where: {
          OR: [
            { id: { equals: input.s?.trim() } },
            { name: { equals: input.s?.trim() } },
            { tag: { equals: input.s?.trim() } }
          ]
        }
      });

      return material;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await withRedisCache(
      'material:getAll',
      async () => {
        const material = await ctx.db.material.findMany({
          include: {
            products: true
          }
        });

        return material;
      },
      60 * 60 * 24
    );
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, 'Name is required'),
        category: z.string().min(1, 'Category is required'),
        tag: z.string().min(1, 'Tag is required'),
        description: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingMaterial: any = await ctx.db.material.findFirst({
        where: {
          tag: input.tag
        }
      });

      if (!existingMaterial || (existingMaterial && existingMaterial?.id == input?.id)) {
        const [material, updateMaterial] = await ctx.db.$transaction([
          ctx.db.material.findUnique({
            where: { id: input?.id }
          }),
          ctx.db.material.update({
            where: { id: input?.id },
            data: {
              name: input.name,
              description: input.description,
              tag: input.tag,
              category: input.category
            }
          })
        ]);

        if (material?.tag && updateMaterial?.tag) {
          await CreateTagVi({ old: material, new: updateMaterial });
        }
        return {
          success: true,
          message: 'Cập nhật nguyên liệu thành công.',
          record: material
        };
      }

      return {
        success: false,
        message: 'Nguyên liệu đã tồn tại. ',
        record: existingMaterial
      };
    })
});
