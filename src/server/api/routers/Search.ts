import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const searchRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        s: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { s } = input;
      const [products, categories, subCategories] = await ctx.db.$transaction([
        ctx.db.product.findMany({
          skip: 0,
          take: 10,
          where: {
            OR: [
              { name: { contains: s, mode: 'insensitive' } },
              { tag: { contains: s, mode: 'insensitive' } },
              { price: isNaN(Number(s || 0)) ? undefined : { equals: Number(s || 0) } }
            ]
          },
          include: {
            images: true,
            materials: true,
            subCategory: {
              select: {
                id: true,
                tag: true,
                name: true
              }
            }
          }
        }),
        ctx.db.category.findMany({
          skip: 0,
          take: 2,
          where: {
            OR: [{ name: { contains: s, mode: 'insensitive' } }, { tag: { contains: s, mode: 'insensitive' } }]
          }
        }),
        ctx.db.subCategory.findMany({
          skip: 0,
          take: 2,
          where: {
            OR: [{ name: { contains: s, mode: 'insensitive' } }, { tag: { contains: s, mode: 'insensitive' } }]
          }
        })
      ]);

      return {
        products,
        categories,
        subCategories
      };
    }),
  searchGlobal: publicProcedure
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
      const [products, categories, subCategories, users] = await ctx.db.$transaction([
        ctx.db.product.findMany({
          skip: 0,
          take: 10,
          where: {
            OR: [
              { name: { contains: s, mode: 'insensitive' } },
              { tag: { contains: s, mode: 'insensitive' } },
              { price: isNaN(Number(s || 0)) ? undefined : { equals: Number(s || 0) } }
            ]
          },
          include: {
            images: true,
            materials: true,
            subCategory: {
              select: {
                id: true,
                tag: true,
                name: true
              }
            }
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
        }),
        ctx.db.subCategory.findMany({
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
                  OR: [
                    { tag: { contains: s?.trim(), mode: 'insensitive' } },
                    {
                      name: { contains: s?.trim(), mode: 'insensitive' }
                    }
                  ]
                }
              }
            ]
          },
          include: {
            category: true,
            image: true,
            product: {
              where: {
                isActive: true
              },
              include: {
                favouriteFood: true,
                images: true
              }
            }
          }
        }),
        ctx.db.user.findMany({
          skip: startPageItem,
          take,
          where: {
            AND: {
              OR: [
                {
                  name: { contains: s, mode: 'insensitive' }
                },
                {
                  address: {
                    detail: { contains: s, mode: 'insensitive' }
                  }
                },
                {
                  phone: { contains: s, mode: 'insensitive' }
                },
                {
                  email: { contains: s, mode: 'insensitive' }
                }
              ]
            }
          },
          include: {
            role: true
          }
        })
      ]);

      return {
        products,
        categories,
        subCategories,
        users
      };
    })
});
