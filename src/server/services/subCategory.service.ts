import { EntityType, ImageType, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { ManageTagVi } from '~/lib/FuncHandler/CreateTag-vi';
import { ImageInfoFromDb, StatusImage } from '~/shared/schema/image.info.schema';
import { SubCategoryInput } from '~/shared/schema/subCategory.schema';

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
        imageForEntity: {
          select: {
            altText: true,
            image: {
              select: {
                publicId: true,
                url: true
              }
            }
          }
        },
        product: {
          where: {
            isActive: true
          },
          include: {
            favouriteFood: true,
            imageForEntities: { include: { image: true } }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
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
    where: { id: input.id }
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
      imageForEntity: {
        include: {
          image: true
        }
      }
    }
  });

  return subCategory;
};
export const getAllSubCategoryService = async (db: PrismaClient) => {
  return await db.subCategory.findMany({
    include: {
      imageForEntity: { include: { image: true } },
      category: true
    }
  });
};
export const upsertSubCategoryService = async (db: PrismaClient, input: SubCategoryInput) => {
  const { id, imageForEntity, categoryId, ...data } = input;
  let imageDb: Omit<ImageInfoFromDb, 'status'> | undefined, statusFromReq;
  if (imageForEntity?.status) {
    const { status, ...rest } = imageForEntity;
    imageDb = rest;
    statusFromReq = status;
  }
  const existingSubCategory = id
    ? await db.subCategory.findUnique({
        where: { id },
        include: {
          imageForEntity: {
            include: {
              image: true,
              subCategory: {
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

  const updatedSubCategory = await db.subCategory.upsert({
    where: { id: id ?? 'default_upsert_id' },
    create: {
      ...data,
      category: {
        connect: {
          id: categoryId
        }
      },
      imageForEntity: {
        create:
          statusFromReq === StatusImage.NEW && imageDb
            ? {
                ...imageDb,
                id: undefined,
                entityType: EntityType.CATEGORY,
                altText: `Ảnh ${data.name}`,
                type: ImageType.THUMBNAIL,
                image: {
                  connectOrCreate: {
                    where: {
                      publicId: imageDb?.image?.publicId
                    },
                    create: {
                      ...(imageDb?.image ?? {}),
                      url: imageDb?.image?.url || '',
                      altText: imageDb?.image?.altText || 'Ảnh của danh mục ' + (data?.name || ''),
                      type: imageDb?.image?.type || ImageType.THUMBNAIL
                    }
                  }
                }
              }
            : undefined
      }
    },
    update: {
      ...data,
      category: categoryId
        ? {
            connect: {
              id: categoryId
            }
          }
        : undefined,
      imageForEntity:
        statusFromReq === StatusImage.DELETED && imageDb?.id
          ? {
              delete: { id: imageDb.id }
            }
          : imageDb
            ? {
                upsert: {
                  where: { id: imageDb.id },
                  update: {
                    ...imageDb,
                    image:
                      statusFromReq === StatusImage.NEW && imageDb.image
                        ? {
                            connectOrCreate: {
                              where: {
                                publicId: imageDb.image.publicId
                              },
                              create: {
                                ...imageDb.image,
                                url: imageDb?.image?.url || '',
                                altText: imageDb?.image?.altText || 'Ảnh của danh mục ' + (data?.name || ''),
                                type: imageDb?.image?.type || ImageType.THUMBNAIL
                              }
                            }
                          }
                        : undefined
                  },
                  create: {
                    ...imageDb,
                    image:
                      statusFromReq === StatusImage.NEW && imageDb.image
                        ? {
                            connectOrCreate: {
                              where: {
                                publicId: imageDb.image.publicId
                              },
                              create: {
                                ...imageDb.image,
                                url: imageDb.image.url || '',
                                altText: imageDb?.image?.altText || 'Ảnh của danh mục ' + (data?.name || ''),
                                type: imageDb?.image?.type || ImageType.THUMBNAIL
                              }
                            }
                          }
                        : undefined
                  }
                }
              }
            : undefined
    },
    include: { imageForEntity: { include: { image: true } } }
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
