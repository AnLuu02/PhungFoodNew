import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { moneyToNumber } from '~/lib/FuncHandler/Format';

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

export const getFilterFavouriteFoodService = async (db: PrismaClient, input: { s: string }) => {
  const searchQuery = input.s?.trim();
  const favourite_foods = await db.favouriteFood.findMany({
    where: {
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
    },
    include: {
      product: {
        include: {
          favouriteFood: true,
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
