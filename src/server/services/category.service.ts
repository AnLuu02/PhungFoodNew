import { Prisma, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { Session } from 'next-auth';
import { delCache } from '~/lib/CacheConfig/withRedisCache';
import { ManageTagVi } from '~/lib/FuncHandler/CreateTag-vi';
import { CATEGORY_KEY } from '~/shared/constants/redis-keys';
import { CategoryInput } from '~/shared/schema/category.schema';

export const findCategoryService = async (db: PrismaClient, input: { page: number; limit: number; s?: string }) => {
  const { page, limit, s } = input;
  const searchQuery = s?.trim();
  const where: Prisma.CategoryWhereInput = {
    OR: [
      {
        name: { contains: searchQuery, mode: 'insensitive' }
      },
      {
        tag: { contains: searchQuery, mode: 'insensitive' }
      },
      {
        description: { contains: searchQuery, mode: 'insensitive' }
      }
    ]
  };
  const [totalCategories, totalCategoriesQuery, categories] = await db.$transaction([
    db.category.count(),
    db.category.count({
      where
    }),
    db.category.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        subCategory: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
  ]);
  const totalPages = Math.ceil(
    Object.entries(input)?.length > 2
      ? totalCategoriesQuery == 0
        ? 1
        : totalCategoriesQuery / limit
      : totalCategories / limit
  );

  return {
    categories,
    pagination: {
      hasNext: Boolean(totalPages > page),
      totalPages
    }
  };
};

export const deleteCategoryService = async (db: PrismaClient, input: { id: string }, session: Session | null) => {
  const category = await db.category.delete({
    where: { id: input.id }
  });

  if (!category) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Đã có lỗi xảy ra. Hãy thử lại sau.'
    });
  }

  ManageTagVi('delete', { oldTag: category.tag });
  await Promise.all([delCache(CATEGORY_KEY.only), delCache(CATEGORY_KEY.withRelationBase)]);
  return {
    metaData: {
      before: category ?? {},
      after: {}
    }
  };
};

export const getBasicCategoryService = async (db: PrismaClient, input: { key: string }) => {
  const { key } = input;
  return await db.category.findFirst({
    where: {
      OR: [{ id: key }, { tag: key }]
    },
    include: {
      subCategory: {
        select: {
          name: true,
          tag: true,
          isActive: true
        }
      }
    }
  });
};

export const getCategoriesOnlyService = async (db: PrismaClient) => {
  return await db.category.findMany({});
};

export const getCategoriesWithRelationBasicService = async (db: PrismaClient) => {
  return db.category.findMany({
    include: {
      subCategory: {
        select: {
          name: true,
          tag: true,
          isActive: true,
          _count: {
            select: { products: true }
          },
          imageForEntity: {
            select: {
              id: true,
              type: true,
              altText: true,
              image: {
                select: {
                  url: true
                }
              }
            }
          }
        }
      }
    }
  });
};

export const upsertCategoryService = async (db: PrismaClient, input: CategoryInput) => {
  const { id, ...data } = input;
  const [existed, existedTag] = await db.$transaction([
    db.category.findUnique({ where: { id: input.id || '' } }),
    db.category.findUnique({ where: { tag: input.tag || '' } })
  ]);
  if (existedTag && existedTag.id !== id) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Tên định danh (tag) này đã tồn tại.'
    });
  }
  const upserted = await db.category.upsert({
    where: {
      id: id || 'DEFAULT_ID'
    },
    create: data,
    update: data
  });

  ManageTagVi('upsert', {
    oldTag: existed?.tag,
    newTag: upserted.tag,
    newName: upserted.name
  });
  await Promise.all([delCache(CATEGORY_KEY.only), delCache(CATEGORY_KEY.withRelationBase)]);
  return {
    metaData: {
      before: existed ?? {},
      after: upserted
    }
  };
};

export const createManyCategoryService = async (db: PrismaClient, input: { data: CategoryInput[] }) => {
  const existingTags = await db.category.findMany({
    where: {
      tag: { in: input.data.map(item => item.tag) }
    },
    select: { tag: true }
  });

  const existingTagSet = new Set(existingTags.map(item => item.tag));
  const newData = input.data.filter(item => !existingTagSet.has(item.tag));

  if (newData.length === 0) {
    throw new TRPCError({ code: 'CONFLICT', message: 'Tất cả danh mục đều đã tồn tại.' });
  }

  await db.category.createMany({
    data: newData
  });

  if (newData?.length > 0) {
    for (const category of newData) {
      await ManageTagVi('upsert', { oldTag: undefined, newTag: category.tag, newName: category.name });
    }
  }

  return newData;
};
