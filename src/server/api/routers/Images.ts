import { EntityType, ImageType } from '@prisma/client';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const imageRouter = createTRPCRouter({
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
      const [totalImages, totalImagesQuery, images] = await ctx.db.$transaction([
        ctx.db.image.count(),
        ctx.db.image.count({
          where: {
            altText: { contains: query?.trim(), mode: 'insensitive' }
          }
        }),
        ctx.db.image.findMany({
          skip: startPageItem,
          take,
          where: {
            altText: { contains: query?.trim(), mode: 'insensitive' }
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
                name: true
              }
            },
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
        query?.trim() ? (totalImagesQuery == 0 ? 1 : totalImagesQuery / take) : totalImages / take
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
      if (!image) {
        throw new Error(`Stock with ID ${input.id} not found.`);
      }

      return {
        success: true,
        message: 'Xóa ảnh thành công.',
        record: image
      };
    }),
  getFilter: publicProcedure
    .input(
      z.object({
        query: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const image = await ctx.db.image.findMany({
        where: {
          OR: [
            { id: { contains: input.query?.trim(), mode: 'insensitive' } },
            { altText: { contains: input.query?.trim(), mode: 'insensitive' } },
            {
              type: input.query?.trim() as ImageType
            },
            {
              entityType: input.query?.trim() as EntityType
            }
          ]
        }
      });
      if (!image) {
        throw new Error(`Stock with ID ${input.query?.trim()} not found.`);
      }
      return image;
    }),
  getOne: publicProcedure
    .input(
      z.object({
        query: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const image = await ctx.db.image.findFirst({
        where: {
          OR: [
            { id: { contains: input.query?.trim(), mode: 'insensitive' } },
            { altText: { contains: input.query?.trim(), mode: 'insensitive' } },
            {
              type: input.query?.trim() as ImageType
            },
            {
              entityType: input.query?.trim() as EntityType
            }
          ]
        }
      });
      if (!image) {
        throw new Error(`Stock with ID ${input.query?.trim()} not found.`);
      }
      return image;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const image = await ctx.db.image.findMany({
      include: {
        product: true,
        user: true,
        subCategory: true
      }
    });
    return image;
  })
});
