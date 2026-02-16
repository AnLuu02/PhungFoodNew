import { PrismaClient } from '@prisma/client';
import { UserRole } from '~/constants';

export const getOneProduct = async (db: PrismaClient, input: { s: string; userRole?: string }) => {
  {
    const { s, userRole } = input;
    return await db.product.findFirst({
      where: {
        ...(userRole && userRole != UserRole.CUSTOMER
          ? {}
          : {
              isActive: true
            }),

        OR: [{ id: { equals: s } }, { tag: { equals: s?.trim() } }]
      },
      include: {
        images: true,
        materials: true,
        subCategory: {
          include: {
            image: true,
            category: true
          }
        },
        reviews: {
          include: {
            user: {
              include: {
                image: true
              },
              omit: {
                password: true
              }
            }
          }
        },
        favouriteFoods: true
      }
    });
  }
};

export const getFilterProduct = async (db: PrismaClient, input: { s?: string }) => {
  const { s } = input;
  const search = s?.trim();
  const product = await db.product.findMany({
    where: {
      isActive: true,
      OR: [
        { id: search },
        { tag: search },
        {
          materials: {
            some: {
              category: search
            }
          }
        },
        {
          subCategory: {
            OR: [
              {
                tag: search
              },

              {
                category: {
                  tag: search
                }
              }
            ]
          }
        }
      ]
    },
    include: {
      images: true,
      materials: true,

      subCategory: {
        include: {
          image: true,

          category: true
        }
      },
      reviews: true,
      favouriteFoods: true
    }
  });

  return product;
};

export const getAllProduct = async (db: PrismaClient, input: { userRole?: string }) => {
  const { userRole } = input;
  const product = await db.product.findMany({
    where: {
      ...(userRole && userRole != UserRole.CUSTOMER ? {} : { isActive: true })
    },
    include: {
      images: true,
      materials: true,
      subCategory: {
        include: {
          image: true,
          category: true
        }
      },
      reviews: true,
      favouriteFoods: true
    }
  });
  return product;
};
