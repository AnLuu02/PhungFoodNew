import { PrismaClient } from '@prisma/client';

export const searchService = async (db: PrismaClient, input: { s?: string }) => {
  const { s } = input;
  const [products, categories, subCategories] = await db.$transaction([
    db.product.findMany({
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
    db.category.findMany({
      skip: 0,
      take: 2,
      where: {
        OR: [{ name: { contains: s, mode: 'insensitive' } }, { tag: { contains: s, mode: 'insensitive' } }]
      }
    }),
    db.subCategory.findMany({
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
};
export const searchGlobalService = async (
  db: PrismaClient,
  input: {
    skip: number;
    take: number;
    s?: string;
  }
) => {
  const { skip, take, s } = input;

  const startPageItem = skip > 0 ? (skip - 1) * take : 0;
  const [products, categories, subCategories, users] = await db.$transaction([
    db.product.findMany({
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
    db.category.findMany({
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
    db.subCategory.findMany({
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
    db.user.findMany({
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
};
