import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const imageRouter = createTRPCRouter({
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
      const [totalImages, totalImagesQuery, images] = await ctx.db.$transaction([
        ctx.db.image.count(),
        ctx.db.image.count({
          where: {
            altText: { contains: s?.trim(), mode: 'insensitive' }
          }
        }),
        ctx.db.image.findMany({
          skip: startPageItem,
          take,
          where: {
            altText: { contains: s?.trim(), mode: 'insensitive' }
          },
          include: {
            product: {
              select: {
                id: true,
                name: true
              }
            },
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            },
            subCategory: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        })
      ]);
      const totalPages = Math.ceil(
        s?.trim() ? (totalImagesQuery == 0 ? 1 : totalImagesQuery / take) : totalImages / take
      );
      const currentPage = skip ? Math.floor(skip / take + 1) : 1;

      return {
        images,
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
      const image = await ctx.db.image.delete({
        where: { id: input.id }
      });

      return {
        success: true,
        message: 'Xóa ảnh thành công.',
        record: image
      };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const image = await ctx.db.image.findMany({
      include: {
        product: true,
        user: {
          include: {
            image: true
          }
        },
        subCategory: true
      }
    });
    return image;
  })
});
