import { z } from 'zod';
import { CreateTagVi } from '~/lib/func-handler/CreateTag-vi';
import { createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import { ResponseTRPC } from '~/types/ResponseFetcher';

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
              },
              {
                category: {
                  contains: s?.trim(),
                  mode: 'insensitive'
                }
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
              },
              {
                category: {
                  contains: s?.trim(),
                  mode: 'insensitive'
                }
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
    .use(requirePermission('create:material'))
    .input(
      z.object({
        name: z.string().min(1, 'Tên nguyên liệu không được để trống'),
        tag: z.string(),
        description: z.string().optional(),
        category: z.string().min(1, 'Danh mục không được để trống')
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
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
          code: 'OK',
          message: 'Tạo nguyên liệu thành công.',
          data: material
        };
      }
      return {
        code: 'CONFLICT',
        message: 'Nguyên liệu đã tồn tại. ',
        data: existingMaterial
      };
    }),
  createMany: publicProcedure
    .input(
      z.object({
        data: z.array(
          z.object({
            name: z.string().min(1, 'Tên nguyên liệu không được để trống'),
            tag: z.string(),
            description: z.string().optional(),
            category: z.string().min(1, 'Danh mục không được để trống')
          })
        )
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const existingTags = await ctx.db.material.findMany({
        where: {
          tag: { in: input.data.map(item => item.tag) }
        },
        select: { tag: true }
      });

      const existingTagSet = new Set(existingTags.map(item => item.tag));
      const newData = input.data.filter(item => !existingTagSet.has(item.tag));

      if (newData.length === 0) {
        return { code: 'CONFLICT', message: 'Tất cả nguyên liệu đều đã tồn tại.', data: [] };
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
        code: 'OK',
        message: `Đã thêm ${materials.count} nguyên liệu mới.`,
        data: newData
      };
    }),

  delete: publicProcedure
    .use(requirePermission('delete:material'))
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const material = await ctx.db.material.delete({
        where: { id: input.id }
      });
      return {
        code: 'OK',
        message: 'Xóa nguyên liệu thành công.',
        data: material
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
    const material = await ctx.db.material.findMany({
      include: {
        products: true
      }
    });

    return material;
  }),

  update: publicProcedure
    .use(requirePermission('update:material'))
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, 'Tên nguyên liệu không được để trống'),
        category: z.string().min(1, 'Danh mục không được để trống'),
        tag: z.string().min(1, 'Tag không được để trống'),
        description: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
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
          code: 'OK',
          message: 'Cập nhật nguyên liệu thành công.',
          data: material
        };
      }

      return {
        code: 'CONFLICT',
        message: 'Nguyên liệu đã tồn tại. ',
        data: existingMaterial
      };
    })
});
