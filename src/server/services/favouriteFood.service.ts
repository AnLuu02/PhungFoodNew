import { PrismaClient } from '@prisma/client';

export const createFavouriteFoodService = async (db: PrismaClient, input: { productId: string; userId: string }) => {
  const favourite_food = await db.favouriteFood.create({
    data: {
      productId: input.productId,
      userId: input.userId
    }
  });
  return favourite_food;
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

  return favourite_food;
};

export const getFilterFavouriteFoodService = async (db: PrismaClient, input: any) => {
  const searchQuery = input.s?.trim();
  const favourite_food = await db.favouriteFood.findMany({
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
          images: true,
          subCategory: true
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
};
