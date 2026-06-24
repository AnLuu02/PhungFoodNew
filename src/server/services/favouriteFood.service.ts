import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { moneyToNumber } from '~/lib/FuncHandler/Format';
export const toggleFavouriteFoodService = async (db: PrismaClient, input: { productId: string; userId: string }) => {
  const { userId, productId } = input;
  const favourite_food = await db.$transaction(async tx => {
    const existed = await tx.favouriteFood.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });
    return existed
      ? await tx.favouriteFood.delete({
          where: {
            userId_productId: {
              userId,
              productId
            }
          }
        })
      : await tx.favouriteFood.create({
          data: {
            productId,
            userId
          }
        });
  });
  return {
    metaData: {
      before: {},
      after: favourite_food
    }
  };
};
export const syncFavouriteFoodService = async (db: PrismaClient, input: { productIds: string[]; userId: string }) => {
  const favourite_foods = await db.favouriteFood.createMany({
    data: input.productIds.map(productId => ({
      productId: productId,
      userId: input.userId
    })),
    skipDuplicates: true
  });
  return {
    metaData: {
      before: {},
      after: favourite_foods
    }
  };
};
export const createFavouriteFoodService = async (db: PrismaClient, input: { productId: string; userId: string }) => {
  const favourite_food = await db.favouriteFood.create({
    data: {
      productId: input.productId,
      userId: input.userId
    }
  });
  return {
    metaData: {
      before: {},
      after: favourite_food
    }
  };
};
export const deleteFavouriteFoodService = async (db: PrismaClient, input: { productId: string; userId: string }) => {
  const { userId, productId } = input;
  const favourite_food = await db.favouriteFood.delete({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  });

  return {
    metaData: {
      before: favourite_food ?? {},
      after: {}
    }
  };
};

export const getFilterFavouriteFoodService = async (db: PrismaClient, input: { s?: string; keys: string[] }) => {
  const searchQuery = input.s?.trim();
  const keys = input?.keys;
  const favourite_foods = await db.favouriteFood.findMany({
    where: {
      OR: [
        {
          productId: {
            in: keys
          }
        },
        {
          userId: {
            in: keys
          }
        }
      ],
      ...(searchQuery
        ? {
            OR: [
              { id: searchQuery },
              {
                product: {
                  OR: [
                    {
                      tag: searchQuery
                    },
                    {
                      name: searchQuery
                    }
                  ]
                }
              },
              {
                user: {
                  OR: [
                    {
                      email: searchQuery
                    },
                    {
                      name: searchQuery
                    }
                  ]
                }
              }
            ]
          }
        : {})
    },
    include: {
      product: {
        include: {
          favouriteFoods: true,
          review: true,
          imageForEntities: { include: { image: true } },
          subCategory: true
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          imageForEntity: { include: { image: true } }
        }
      }
    }
  });

  return favourite_foods.map(ff => ({
    ...ff,
    product: {
      ...ff.product,
      price: moneyToNumber(ff.product.price),
      discount: moneyToNumber(ff.product.discount)
    }
  }));
};

export const getProductOwnerService = async (db: PrismaClient, input: { userId: string; productId: string }) => {
  const { userId, productId } = input;
  const favouriteFood = await db.favouriteFood.findUnique({
    where: {
      userId_productId: {
        userId,
        productId
      }
    },
    include: {
      product: {
        include: {
          imageForEntities: { include: { image: true } },
          subCategory: {
            include: { category: true }
          }
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          imageForEntity: { include: { image: true } }
        }
      }
    }
  });

  if (!favouriteFood)
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Opps! Có vẻ như bạn chưa thêm sản phẩm này vào mục yêu thích./'
    });

  return {
    ...favouriteFood,
    product: {
      ...favouriteFood.product,
      price: moneyToNumber(favouriteFood.product.price),
      discount: moneyToNumber(favouriteFood.product.discount)
    }
  };
};

export const getFilterFavouriteFoodIdsService = async (db: PrismaClient, input: { s?: string; keys?: string[] }) => {
  const searchQuery = input.s?.trim();
  const keys = input?.keys;
  const favourite_foods = await db.favouriteFood.findMany({
    where: {
      ...(keys && keys.length > 0
        ? {
            OR: [
              {
                productId: {
                  in: keys
                }
              },
              {
                userId: {
                  in: keys
                }
              }
            ]
          }
        : {}),
      ...(searchQuery
        ? {
            OR: [
              { id: searchQuery },
              {
                product: {
                  OR: [
                    {
                      tag: searchQuery
                    },
                    {
                      name: searchQuery
                    }
                  ]
                }
              },
              {
                user: {
                  OR: [
                    {
                      email: searchQuery
                    },
                    {
                      name: searchQuery
                    }
                  ]
                }
              }
            ]
          }
        : {})
    },
    select: {
      productId: true,
      userId: true
    }
  });

  return favourite_foods;
};
