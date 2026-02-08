import { Prisma, PrismaClient } from '@prisma/client';
import { CreateTagVi } from '~/lib/FuncHandler/CreateTag-vi';
import { ResponseTRPC } from '~/types/ResponseFetcher';

export const findExistingCategory = async (db: PrismaClient, tag: string) => {
  return await db.category.findFirst({ where: { tag } });
};

export async function findCategories(db: PrismaClient, input: { skip: number; take: number; s?: string }) {
  const { skip, take, s } = input;
  const startPageItem = skip > 0 ? (skip - 1) * take : 0;

  const where = s
    ? {
        OR: [
          { name: { contains: s.trim(), mode: 'insensitive' } },
          { tag: { contains: s.trim(), mode: 'insensitive' } },
          { description: { contains: s.trim(), mode: 'insensitive' } }
        ]
      }
    : undefined;

  try {
    const [total, totalQuery, categories] = await db.$transaction([
      db.category.count(),
      db.category.count({
        where: where as any
      }),
      db.category.findMany({
        skip: startPageItem,
        take,
        where: where as any,
        include: {
          subCategories: {
            select: { id: true, name: true }
          }
        }
      })
    ]);

    const totalPages = Math.ceil(s ? (totalQuery === 0 ? 1 : totalQuery / take) : total / take);
    const currentPage = skip ? Math.floor(skip / take + 1) : 1;

    return {
      categories,
      pagination: { currentPage, totalPages }
    };
  } catch (e) {}
}

export const getAllCategories = async (db: PrismaClient) => {
  return await db.category.findMany({
    include: {
      subCategories: {
        include: {
          image: true,
          products: {
            where: { isActive: true },
            include: { images: true }
          }
        }
      }
    }
  });
};

export const getOneCategory = async (db: PrismaClient, s: string) => {
  return await db.category.findFirst({
    where: {
      OR: [{ id: s }, { name: s }, { tag: s }]
    }
  });
};
export const getFilterCategory = async (db: PrismaClient, s: string) => {
  return await db.category.findMany({
    where: {
      OR: [{ id: { equals: s?.trim() } }, { name: { equals: s?.trim() } }, { tag: { equals: s?.trim() } }]
    }
  });
};
export const createCategory = async (db: PrismaClient, input: any): Promise<ResponseTRPC> => {
  const exists = await findExistingCategory(db, input.tag);
  if (exists) {
    return { code: 'CONFLICT', message: 'Danh mục đã tồn tại.', data: [] };
  }

  const category = await db.category.create({ data: input });

  if (category?.tag) {
    await CreateTagVi({ old: [], new: category });
  }

  return {
    code: 'OK',
    message: 'Tạo danh mục thành công.',
    data: category
  };
};

export const updateCategory = async (
  db: PrismaClient,
  where: Prisma.CategoryWhereUniqueInput,
  data: Prisma.CategoryUpdateInput
): Promise<ResponseTRPC> => {
  const exists = await findExistingCategory(db, data.tag as string);

  if (exists && exists.id !== where.id) {
    return { code: 'CONFLICT', message: 'Danh mục đã tồn tại.', data: [] };
  }

  const updated = await db.category.update({ where, data });

  await CreateTagVi({ old: exists, new: updated });

  return {
    code: 'OK',
    message: 'Cập nhật danh mục thành công.',
    data: updated
  };
};

export const deleteCategory = async (db: PrismaClient, id: string): Promise<ResponseTRPC> => {
  try {
    await db.category.delete({ where: { id } });
    return {
      code: 'OK',
      message: 'Xóa danh mục thành công.',
      data: null
    };
  } catch (e) {
    return {
      code: 'ERROR',
      message: 'Có lỗi xảy ra' + e,
      data: null
    };
  }
};
