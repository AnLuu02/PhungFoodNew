import { EntityType, ImageType, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { ManageTagVi } from '~/lib/FuncHandler/CreateTag-vi';
import { ImageFromDb, StatusImage } from '~/shared/schema/image.schema';
import { SubCategoryFromDb } from '~/shared/schema/subCategory.schema';

export const findSubCategoryService = async (db: PrismaClient, input: any) => {
  const { skip, take, s } = input;
  const startPageItem = skip > 0 ? (skip - 1) * take : 0;
  const [totalSubCategory, totalSubCategoryQuery, subCategories] = await db.$transaction([
    db.subCategory.count(),
    db.subCategory.count({
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
    })
  ]);
  const totalPages = Math.ceil(
    s?.trim() ? (totalSubCategoryQuery == 0 ? 1 : totalSubCategoryQuery / take) : totalSubCategory / take
  );
  const currentPage = skip ? Math.floor(skip / take + 1) : 1;

  return {
    subCategories,
    pagination: {
      currentPage,
      totalPages
    }
  };
};
export const deleteSubCategoryService = async (db: PrismaClient, input: any) => {
  const subCategory = await db.subCategory.findUnique({
    where: { id: input.id },
    include: { image: true }
  });

  if (!subCategory) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Danh mục con không tồn tại.'
    });
  }

  const deletedSubCategory = await db.subCategory.delete({ where: { id: input.id } });
  ManageTagVi('delete', { oldTag: deletedSubCategory.tag });
  return deletedSubCategory;
};
export const getOneSubCategoryService = async (db: PrismaClient, input: { s?: string }) => {
  const searchQuery = input.s?.trim();
  const subCategory = await db.subCategory.findFirst({
    where: {
      OR: [
        { id: searchQuery },
        {
          tag: searchQuery
        },
        {
          category: {
            OR: [
              {
                tag: searchQuery
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
      category: true,
      image: true
    }
  });

  return subCategory;
};
export const getAllSubCategoryService = async (db: PrismaClient) => {
  return await db.subCategory.findMany({
    include: {
      image: true,
      category: true
    }
  });
};
export const upsertSubCategoryService = async (db: PrismaClient, input: SubCategoryFromDb) => {
  const { id, image, categoryId, ...data } = input;
  let imageDb: Omit<ImageFromDb, 'status'> | undefined, statusFromReq;
  if (image?.status) {
    const { status, ...rest } = image;
    imageDb = rest;
    statusFromReq = status;
  }
  const existingSubCategory = id
    ? await db.subCategory.findUnique({
        where: { id },
        include: {
          image: {
            include: {
              subCategories: {
                select: { id: true }
              }
            }
          }
        }
      })
    : null;
  if (!id || (existingSubCategory && existingSubCategory.tag !== data.tag)) {
    const duplicateTag = await db.subCategory.findUnique({
      where: { tag_categoryId: { tag: data.tag, categoryId } }
    });
    if (duplicateTag) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Rất tiếc danh mục đã tồn tại.' });
    }
  }
  const isDeleted = Boolean(statusFromReq === StatusImage.DELETED && imageDb && imageDb?.publicId);
  const updatedSubCategory = await db.subCategory.upsert({
    where: { id: id || 'NEW_ID' },
    create: {
      ...data,
      category: {
        connect: {
          id: categoryId
        }
      },
      image: {
        connectOrCreate:
          statusFromReq === StatusImage.NEW && imageDb
            ? {
                where: {
                  publicId: imageDb?.publicId || 'connect-or-create-image-id'
                },
                create: {
                  ...imageDb,
                  id: undefined,
                  entityType: EntityType.SUB_CATEGORY,
                  altText: `Ảnh ${data.name}`,
                  url: imageDb?.url || '',
                  type: ImageType.THUMBNAIL
                }
              }
            : undefined
      }
    },
    update: {
      ...data,
      category: {
        connect: {
          id: categoryId
        }
      },
      image: {
        connectOrCreate:
          statusFromReq === StatusImage.NEW && imageDb
            ? {
                where: {
                  publicId: imageDb?.publicId || 'connect-or-create-image-id'
                },
                create: {
                  ...imageDb,
                  id: undefined,
                  entityType: EntityType.SUB_CATEGORY,
                  altText: `Ảnh ${data.name}`,
                  url: imageDb?.url || '',
                  type: ImageType.THUMBNAIL
                }
              }
            : undefined,
        disconnect: isDeleted ? { publicId: imageDb?.publicId || '' } : undefined
      }
    },
    include: { image: true }
  });

  if (updatedSubCategory.tag) {
    ManageTagVi('upsert', {
      oldTag: existingSubCategory?.tag,
      newTag: updatedSubCategory.tag,
      newName: updatedSubCategory.name
    });
  }
  return updatedSubCategory;
};
