import { PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { ResponseTRPC } from '~/types/ResponseFetcher';

export async function createFavouriteFood(
  db: PrismaClient<
    {
      log: 'error'[];
    },
    'error',
    DefaultArgs
  >,
  input: { userId: string; productId: string }
): Promise<ResponseTRPC> {
  const favouriteFood = await db.favouriteFood.create({
    data: {
      userId: input.userId,
      productId: input.productId
    }
  });

  return {
    code: 'OK',
    message: 'Tạo thành công.',
    data: favouriteFood
  };
}

export async function deleteFavouriteFood(
  db: PrismaClient<
    {
      log: 'error'[];
    },
    'error',
    DefaultArgs
  >,
  input: { userId: string; productId: string }
): Promise<ResponseTRPC> {
  const favouriteFood = await db.favouriteFood.delete({
    where: {
      userId_productId: {
        userId: input.userId,
        productId: input.productId
      }
    }
  });

  return {
    code: 'OK',
    message: 'Xóa thành công.',
    data: favouriteFood
  };
}

export const filterFavouriteFoods = (
  db: PrismaClient<
    {
      log: 'error'[];
    },
    'error',
    DefaultArgs
  >,
  input: {
    s: string;
    hasReview?: boolean;
    hasUser?: boolean;
    hasCategory?: boolean;
    hassubCategory?: boolean;
  }
) => {
  const keyword = input.s.trim();

  return db.favouriteFood.findMany({
    where: {
      OR: [
        { id: keyword },
        {
          product: {
            OR: [{ tag: keyword }, { name: keyword }]
          }
        },
        {
          user: {
            OR: [{ email: keyword }, { name: keyword }]
          }
        }
      ]
    },
    include: {
      product: {
        include: {
          favouriteFoods: true,
          reviews: true,
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
};
