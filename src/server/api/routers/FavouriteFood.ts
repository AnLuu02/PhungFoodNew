import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const favouriteFoodRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        userId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const favourite_food = await ctx.db.favouriteFood.create({
        data: {
          productId: input.productId,
          userId: input.userId
        }
      });
      return {
        success: true,
        message: 'Tạo  thành công.',
        record: favourite_food
      };
    }),
  delete: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        productId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, productId } = input;
      const favourite_food = await ctx.db.favouriteFood.delete({
        where: {
          userId_productId: {
            userId,
            productId
          }
        }
      });

      return {
        success: true,
        message: 'Xóa  thành công.',
        record: favourite_food
      };
    }),

  getFilter: publicProcedure
    .input(
      z.object({
        s: z.string(),
        hasReview: z.boolean().optional(),
        hasUser: z.boolean().optional(),
        hasCategory: z.boolean().optional(),
        hassubCategory: z.boolean().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const favourite_food = await ctx.db.favouriteFood.findMany({
        where: {
          OR: [
            { id: input.s?.trim() },
            {
              product: {
                OR: [
                  {
                    tag: input.s?.trim()
                  },
                  {
                    name: input.s?.trim()
                  }
                ]
              }
            },
            {
              user: {
                OR: [
                  {
                    email: input.s?.trim()
                  },
                  {
                    name: input.s?.trim()
                  }
                ]
              }
            }
          ]
        },
        include: {
          product: {
            include: {
              favouriteFood: true,
              review: true,
              images: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      });

      return favourite_food;
    })
});
