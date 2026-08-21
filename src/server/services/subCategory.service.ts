import { EntityType, ImageType, Prisma, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { ManageTagVi } from '~/lib/FuncHandler/CreateTag-vi';
import { ImageInfoFromDb, StatusImage } from '~/shared/schema/image.info.schema';
import { SubCategoryInput } from '~/shared/schema/subCategory.schema';

const BASIC_INCLUDE = {
  category: { select: { name: true, tag: true } },
  imageForEntity: {
    select: {
      id: true,
      type: true,
      altText: true,
      image: { select: { url: true } }
    }
  }
};

export const findSubCategoryService = async (
  db: PrismaClient,
  input: {
    page: number;
    limit: number;
    filters?: {
      s?: string;
      status?: 'active' | 'inactive';
      category?: string;
    };
  }
) => {
  const { page, limit, filters } = input;
  const searchQuery = filters?.s?.trim();
  const where: Prisma.SubCategoryWhereInput = {
    ...(filters
      ? {
          ...(filters?.status
            ? {
                isActive: filters?.status === 'active' ? true : false
              }
            : {}),
          ...(filters?.category
            ? {
                category: {
                  OR: [
                    { tag: filters?.category },
                    {
                      name: filters?.category
                    }
                  ]
                }
              }
            : {}),
          OR: [
            {
              name: { contains: searchQuery, mode: 'insensitive' }
            },
            {
              tag: { contains: searchQuery, mode: 'insensitive' }
            },
            {
              description: { contains: searchQuery, mode: 'insensitive' }
            },
            {
              category: {
                OR: [
                  { tag: { contains: searchQuery, mode: 'insensitive' } },
                  {
                    name: { contains: searchQuery, mode: 'insensitive' }
                  }
                ]
              }
            }
          ]
        }
      : {})
  };
  const subCategories = await db.subCategory.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where,
    include: BASIC_INCLUDE,
    orderBy: {
      createdAt: 'desc'
    }
  });
  const totalPages = Math.ceil(subCategories.length / limit);

  return {
    subCategories,
    pagination: {
      hasNext: Boolean(totalPages > page),
      totalPages
    }
  };
};
export const deleteSubCategoryService = async (db: PrismaClient, input: { id: string }) => {
  const deletedSubCategory = await db.subCategory.delete({ where: { id: input.id } });
  ManageTagVi('delete', { oldTag: deletedSubCategory.tag });
  return {
    metaData: {
      before: deletedSubCategory ?? {},
      after: {}
    }
  };
};

export const getBasicSubCategoryService = async (
  db: PrismaClient,
  input: {
    key: string;
  }
) => {
  const { key } = input;
  return await db.subCategory.findFirst({
    where: {
      OR: [
        { id: key },
        {
          tag: key
        }
      ]
    },
    include: BASIC_INCLUDE
  });
};

export const getSubCategoriesWithRelationBasicService = async (db: PrismaClient) => {
  return db.subCategory.findMany({
    include: BASIC_INCLUDE
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
  const existed = id
    ? await db.subCategory.findUnique({
        where: { id },
        include: {
          imageForEntity: {
            include: {
              image: true
            }
          }
        }
      })
    : null;
  if (!id || (existed && existed.tag !== data.tag)) {
    const duplicateTag = await db.subCategory.findUnique({
      where: { tag_categoryId: { tag: data.tag, categoryId } }
    });
    if (duplicateTag) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Rất tiếc danh mục đã tồn tại.' });
    }
  }

  const upserted = await db.subCategory.upsert({
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

  if (upserted.tag) {
    ManageTagVi('upsert', {
      oldTag: existed?.tag,
      newTag: upserted.tag,
      newName: upserted.name
    });
  }
  return {
    metaData: {
      before: existed ?? {},
      after: upserted ?? {}
    }
  };
};
