import { Prisma, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { delCache } from '~/lib/CacheConfig/withRedisCache';
import { buildSortFilter } from '~/lib/FuncHandler/PrismaHelper';
import { ReviewInput } from '~/shared/schema/review.schema';

type ReviewScalarFieldEnum = 'userId' | 'productId' | 'id' | 'rating';

export const findReviewService = async (
  db: PrismaClient,
  input: {
    page: number;
    limit: number;
    s?: string;
    relationId?: string;
    sort?: string[];
    include?: Prisma.ReviewInclude;
    options?: {
      distinct?: Prisma.Enumerable<ReviewScalarFieldEnum>;
    };
  }
) => {
  const { page, limit, s, relationId, sort, include, options } = input;
  const searchQuery = s?.trim();
  const filterStar = s?.includes('-star') ? +s?.split('-')?.[0]! : undefined;
  const where: Prisma.ReviewWhereInput = {
    ...(filterStar
      ? {
          AND: [
            {
              rating: {
                gte: Number(filterStar)
              }
            },
            {
              rating: {
                lt: Number(filterStar) + 1
              }
            }
          ]
        }
      : {}),
    ...(searchQuery || relationId
      ? {
          OR: [
            {
              comment: {
                contains: searchQuery,
                mode: 'insensitive'
              }
            },
            {
              user: {
                OR: [
                  {
                    name: {
                      contains: searchQuery,
                      mode: 'insensitive'
                    }
                  },
                  {
                    id: relationId
                  }
                ]
              }
            },
            {
              product: {
                OR: [
                  {
                    name: {
                      contains: searchQuery,
                      mode: 'insensitive'
                    }
                  },
                  {
                    id: relationId
                  }
                ]
              }
            }
          ]
        }
      : {})
  };
  const [totalReviews, totalReviewsQuery, reviews] = await db.$transaction([
    db.review.count(),
    db.review.count({
      where,
      orderBy: sort && sort?.length > 0 ? buildSortFilter(sort, ['rating']) : { createdAt: 'desc' }
    }),
    db.review.findMany({
      skip: (page - 1) * limit,
      take: limit,
      distinct: options?.distinct ? options.distinct : undefined,
      where,
      orderBy: sort && sort?.length > 0 ? buildSortFilter(sort, ['rating']) : { createdAt: 'desc' },
      include: {
        ...(include ?? {}),
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            level: true,
            pointUser: true,
            imageForEntity: { include: { image: true } }
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            tag: true,
            imageForEntities: { include: { image: true } }
          }
        }
      }
    })
  ]);
  const totalPages = Math.ceil(
    Object.entries(input)?.length > 2 ? (totalReviewsQuery == 0 ? 1 : totalReviewsQuery / limit) : totalReviews / limit
  );

  return {
    reviews,
    pagination: {
      hasNext: Boolean(totalPages > page),
      totalPages
    }
  };
};
export const deleteReviewService = async (db: PrismaClient, input: { id: string }) => {
  try {
    const deleted = await db.review.delete({
      where: { id: input.id }
    });
    const starReview = await db.review.findMany({
      where: { productId: deleted.productId }
    });

    const averageRating = starReview.reduce((acc, review) => acc + review.rating, 0) / starReview.length || 0;

    await db.product.update({
      where: { id: deleted.productId },
      data: {
        totalRating: {
          decrement: 1
        },
        rating: averageRating
      }
    });
    return {
      metaData: {
        before: deleted ?? {},
        after: {}
      }
    };
  } catch {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Oops! Đợi chút nhé!. Có vấn đề rồi.'
    });
  }
};
export const getReviewForOwnerService = async (
  db: PrismaClient,
  input: { ownerId: string; include?: Prisma.ReviewInclude }
) => {
  try {
    const { ownerId, include } = input;
    return await db.review.findMany({
      where: {
        OR: [
          {
            productId: ownerId
          },
          {
            userId: ownerId
          }
        ]
      },
      include: {
        ...(include ?? {}),
        user: {
          include: {
            imageForEntity: { include: { image: true } }
          }
        }
      }
    });
  } catch {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Oops! Đợi chút nhé!. Có vấn đề rồi.'
    });
  }
};
export const getOneReviewService = async (db: PrismaClient, input: { id: string; include?: Prisma.ReviewInclude }) => {
  try {
    return await db.review.findUnique({
      where: {
        id: input.id || ''
      },
      include: {
        ...(input.include ?? {}),
        user: {
          include: {
            imageForEntity: { include: { image: true } }
          }
        }
      }
    });
  } catch {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Oops! Đợi chút nhé!. Có vấn đề rồi.'
    });
  }
};
export const getAllReviewService = async (
  db: PrismaClient,
  input?: {
    include?: Prisma.ReviewInclude;
  }
) => {
  try {
    return await db.review.findMany({ include: input?.include });
  } catch {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Oops! Đợi chút nhé!. Có vấn đề rồi.'
    });
  }
};
export const upsertReviewService = async (db: PrismaClient, input: ReviewInput) => {
  const { id, ...data } = input;
  const result = await db.$transaction(async tx => {
    const oldData = id ? await tx.review.findUnique({ where: { id } }) : null;
    const newData = await db.review.upsert({
      where: { id: id || '' },
      create: data,
      update: data
    });
    return { oldData, newData };
  });

  const starReview = await db.review.findMany({
    where: { productId: input.productId }
  });

  const averageRating = starReview.reduce((acc, review) => acc + review.rating, 0) / starReview.length;

  await Promise.all([
    db.product.update({
      where: { id: input.productId },
      data: {
        rating: averageRating,
        totalRating: starReview.length
      }
    }),
    delCache(`product:detail:${data.productId}`)
  ]);

  return {
    metaData: {
      before: result.oldData ?? {},
      after: result.newData ?? {}
    }
  };
};
