import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { Session } from 'next-auth';
import { ManageTagVi } from '~/lib/FuncHandler/CreateTag-vi';
import { CategoryInput } from '~/shared/schema/category.schema';

export const findCategoryService = async (db: PrismaClient, input: { skip: number; take: number; s?: string }) => {
  const { skip, take, s } = input;
  const searchQuery = s?.trim();
  const startPageItem = skip > 0 ? (skip - 1) * take : 0;
  const [totalCategories, totalCategoriesQuery, categories] = await db.$transaction([
    db.category.count(),
    db.category.count({
      where: {
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
      }
    }),
    db.category.findMany({
      skip: startPageItem,
      take,
      where: {
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
        : totalCategoriesQuery / take
      : totalCategories / take
  );
  const currentPage = skip ? Math.floor(skip / take + 1) : 1;

  return {
    categories,
    pagination: {
      currentPage,
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

  return {
    metaData: {
      before: category ?? {},
      after: {}
    }
  };
};

export const getFilterCategoryService = async (db: PrismaClient, input: { s?: string }) => {
  const searchQuery = input.s?.trim();
  const category = await db.category.findMany({
    where: {
      OR: [{ id: searchQuery }, { name: searchQuery }, { tag: searchQuery }]
    }
  });

  return category;
};

export const getOneCategoryService = async (db: PrismaClient, input: { s?: string }) => {
  const searchQuery = input.s?.trim();
  const category = await db.category.findFirst({
    where: {
      OR: [{ id: searchQuery }, { name: searchQuery }, { tag: searchQuery }]
    }
  });
  return category;
};

export const getAllCategoryService = async (db: PrismaClient) => {
  let category = await db.category.findMany({
    include: {
      subCategory: {
        include: {
          imageForEntity: { include: { image: true } },
          product: {
            where: {
              isActive: true
            },
            include: {
              imageForEntities: { include: { image: true } }
            }
          }
        }
      }
    }
  });
  return category;
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
