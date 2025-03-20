import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const reviewRouter = createTRPCRouter({
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
      const [totalReviews, totalReviewsQuery, reviews] = await ctx.db.$transaction([
        ctx.db.review.count(),
        ctx.db.review.count({
          where: query?.trim()
            ? {
                OR: [
                  {
                    comment: {
                      contains: query?.trim(),
                      mode: 'insensitive'
                    }
                  },
                  {
                    user: {
                      name: {
                        contains: query?.trim(),
                        mode: 'insensitive'
                      }
                    }
                  },
                  {
                    product: {
                      name: {
                        contains: query?.trim(),
                        mode: 'insensitive'
                      }
                    }
                  }
                ]
              }
            : undefined
        }),
        ctx.db.review.findMany({
          skip: startPageItem,
          take,
          where: query?.trim()
            ? {
                OR: [
                  {
                    comment: {
                      contains: query?.trim(),
                      mode: 'insensitive'
                    }
                  },
                  {
                    user: {
                      name: {
                        contains: query?.trim(),
                        mode: 'insensitive'
                      }
                    }
                  },
                  {
                    product: {
                      name: {
                        contains: query?.trim(),
                        mode: 'insensitive'
                      }
                    }
                  }
                ]
              }
            : undefined,
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true
              }
            },
            product: {
              select: {
                id: true,
                name: true,
                tag: true,
                images: true
              }
            }
          }
        })
      ]);
      const totalPages = Math.ceil(
        query?.trim() ? (totalReviewsQuery == 0 ? 1 : totalReviewsQuery / take) : totalReviews / take
      );
      const currentPage = skip ? Math.floor(skip / take + 1) : 1;

      return {
        reviews,
        pagination: {
          currentPage,
          totalPages
        }
      };
    }),
  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        productId: z.string(),
        rating: z.number().default(0.0),
        comment: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.db.review.create({
        data: {
          userId: input.userId,
          productId: input.productId,
          rating: input.rating,
          comment: input.comment
        }
      });

      const starReview = await ctx.db.review.findMany({
        where: { productId: input.productId }
      });

      const averageRating = starReview.reduce((acc, review) => acc + review.rating, 0) / starReview.length;

      await ctx.db.product.update({
        where: { id: input.productId },
        data: {
          rating: averageRating,
          totalRating: starReview.length
        }
      });

      return {
        success: true,
        message: 'Đánh giá thành công.',
        record: review
      };
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.db.review.delete({
        where: { id: input.id }
      });
      const starReview = await ctx.db.review.findMany({
        where: { productId: review.productId }
      });

      const averageRating = starReview.reduce((acc, review) => acc + review.rating, 0) / starReview.length || 0;

      await ctx.db.product.update({
        where: { id: review.productId },
        data: {
          totalRating: {
            decrement: 1
          },
          rating: averageRating
        }
      });
      return {
        success: true,
        message: 'Xóa bình luận thành công.',
        record: review
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
      const review = await ctx.db.review.findMany({
        where: {
          OR: [{ id: { equals: input.query?.trim() } }, { productId: { equals: input.query?.trim() } }]
        },
        include: {
          user: {
            include: {
              image: true
            }
          }
        }
      });

      return review;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const review = await ctx.db.review.findMany();
    return review;
  }),

  update: publicProcedure
    .input(
      z.object({
        reviewId: z.string(),
        userId: z.string(),
        productId: z.string(),
        rating: z.number().default(0.0),
        comment: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.db.review.update({
        where: { id: input?.reviewId },
        data: {
          userId: input.userId,
          productId: input.productId,
          rating: input.rating,
          comment: input.comment
        }
      });

      const starReview = await ctx.db.review.findMany({
        where: { productId: input.productId }
      });

      const averageRating = starReview.reduce((acc, review) => acc + review.rating, 0) / starReview.length;

      await ctx.db.product.update({
        where: { id: input.productId },
        data: {
          rating: averageRating,
          totalRating: starReview.length
        }
      });

      return {
        success: true,
        message: 'Cập nhật đánh giá thành công.',
        record: review
      };
    })
});
