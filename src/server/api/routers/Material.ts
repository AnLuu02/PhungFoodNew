import { z } from 'zod';
import { CreateTagVi } from '~/app/lib/utils/func-handler/CreateTag-vi';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const materialRouter = createTRPCRouter({
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
      const [totalMaterials, totalMaterialsQuery, materials] = await ctx.db.$transaction([
        ctx.db.material.count(),
        ctx.db.material.count({
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
        ctx.db.material.findMany({
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
            Products: true
          }
        })
      ]);
      const totalPages = Math.ceil(
        query?.trim() ? (totalMaterialsQuery == 0 ? 1 : totalMaterialsQuery / take) : totalMaterials / take
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

  getFilter: publicProcedure
    .input(
      z.object({
        query: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const material = await ctx.db.material.findMany({
        where: {
          OR: [
            { id: { equals: input.query?.trim() } },
            { name: { equals: input.query?.trim() } },
            { tag: { equals: input.query?.trim() } }
          ]
        }
      });
      return material;
    }),
  getOne: publicProcedure
    .input(
      z.object({
        query: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const material = await ctx.db.material.findFirst({
        where: {
          OR: [
            { id: { equals: input.query?.trim() } },
            { name: { equals: input.query?.trim() } },
            { tag: { equals: input.query?.trim() } }
          ]
        }
      });

      return material;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const material = await ctx.db.material.findMany({
      include: {
        Products: true
      }
    });
    return material;
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
