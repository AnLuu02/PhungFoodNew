import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const favouriteFoodRouter = createTRPCRouter({
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
      const [totalFavoirites, totalFavouriteQuery, favoirites] = await ctx.db.$transaction([
        ctx.db.favouriteFood.count(),
        ctx.db.favouriteFood.count({
          where: {
            OR: [
              {
                product: {
                  OR: [
                    {
                      tag: { contains: query?.trim(), mode: 'insensitive' }
                    },
                    {
                      name: { contains: query?.trim(), mode: 'insensitive' }
                    }
                  ]
                }
              },
              {
                user: {
                  OR: [
                    {
                      email: { contains: query?.trim(), mode: 'insensitive' }
                    },
                    {
                      name: { contains: query?.trim(), mode: 'insensitive' }
                    }
                  ]
                }
              }
            ]
          }
        }),
        ctx.db.favouriteFood.findMany({
          skip: startPageItem,
          take,
          where: {
            OR: [
              {
                product: {
                  OR: [
                    {
                      tag: { contains: query?.trim(), mode: 'insensitive' }
                    },
                    {
                      name: { contains: query?.trim(), mode: 'insensitive' }
                    }
                  ]
                }
              },
              {
                user: {
                  OR: [
                    {
                      email: { contains: query?.trim(), mode: 'insensitive' }
                    },
                    {
                      name: { contains: query?.trim(), mode: 'insensitive' }
                    }
                  ]
                }
              }
            ]
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                images: true
              }
            },
            product: {
              include: {
                images: true
              }
            }
          }
        })
      ]);
      const totalPages = Math.ceil(
        query?.trim() ? (totalFavouriteQuery == 0 ? 1 : totalFavouriteQuery / take) : totalFavoirites / take
      );
      const currentPage = skip ? Math.floor(skip / take + 1) : 1;

      return {
        favoirites,
        pagination: {
          currentPage,
          totalPages
        }
      };
    }),
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
        query: z.string(),
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
            { id: input.query?.trim() },
            {
              product: {
                OR: [
                  {
                    tag: input.query?.trim()
                  },
                  {
                    name: input.query?.trim()
                  }
                ]
              }
            },
            {
              user: {
                OR: [
                  {
                    email: input.query?.trim()
                  },
                  {
                    name: input.query?.trim()
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
              images: true
            }
          }
        }
      });

      return favourite_food;
    }),
  getOne: publicProcedure
    .input(
      z.object({
        query: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const favourite_food = await ctx.db.favouriteFood.findFirst({
        where: {
          OR: [
            { id: input.query?.trim() },
            {
              product: {
                OR: [
                  {
                    tag: input.query?.trim()
                  },
                  {
                    name: input.query?.trim()
                  }
                ]
              }
            },
            {
              user: {
                OR: [
                  {
                    email: input.query?.trim()
                  },
                  {
                    name: input.query?.trim()
                  }
                ]
              }
            }
          ]
        }
      });

      return favourite_food;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const favourite_food = await ctx.db.favouriteFood.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            images: true
          }
        },
        product: {
          include: {
            favouriteFood: true,
            images: true
          }
        }
      }
    });
    return favourite_food;
  }),
  update: publicProcedure
    .input(
      z.object({
        favouriteId: z.string(),
        productId: z.string(),
        userId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const favourite_food = await ctx.db.favouriteFood.update({
        where: { id: input?.favouriteId },
        data: {
          productId: input.productId,
          userId: input.userId
        }
      });
      return {
        success: true,
        message: 'Cập nhật  thành công.',
        record: favourite_food
      };
    })
});
