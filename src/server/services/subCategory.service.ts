import { ImageType, Prisma, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { ManageTagVi } from '~/lib/FuncHandler/CreateTag-vi';
import { StatusImage } from '~/shared/schema/image.info.schema';
import { ImageClientInput } from '~/shared/schema/image.schema';
import { SubCategoryInput } from '~/shared/schema/subCategory.schema';

const BASIC_INCLUDE = {
  category: { select: { name: true, tag: true } },
  image: {
    select: {
      id: true,
      type: true,
      altText: true,
      url: true
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

  const [totalSubCategory, totalSubCategoryQuery, subCategories] = await db.$transaction([
    db.subCategory.count(),
    db.subCategory.count({
      where
    }),
    db.subCategory.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
      include: BASIC_INCLUDE,
      orderBy: {
        createdAt: 'desc'
      }
    })
  ]);
  const totalPages = Math.ceil(
    filters ? (totalSubCategoryQuery == 0 ? 1 : totalSubCategoryQuery / limit) : totalSubCategory / limit
  );

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
  const { id, image, categoryId, ...data } = input;
  let imageDb: ImageClientInput | undefined, statusFromReq;
  if (image?.status) {
    const { status, ...rest } = image;
    imageDb = rest;
    statusFromReq = status;
  }
  const existed = id
    ? await db.subCategory.findUnique({
        where: { id },
        include: {
          image: true
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
    where: { id: String(id) },
    create: {
      ...data,
      category: {
        connect: {
          id: categoryId
        }
      },
      image:
        statusFromReq === StatusImage.NEW && imageDb
          ? {
              connectOrCreate: {
                where: {
                  publicId: imageDb?.publicId
                },
                create: {
                  ...(imageDb ?? {}),
                  url: imageDb?.url || '',
                  altText: imageDb?.altText || 'Ảnh của danh mục ' + (data?.name || ''),
                  type: imageDb?.type || ImageType.THUMBNAIL
                }
              }
            }
          : undefined
    },
    update: {
      ...data,
      category: {
        connect: {
          id: categoryId
        }
      },
      image:
        statusFromReq === StatusImage.DELETED && imageDb?.id
          ? {
              disconnect: { id: imageDb.id }
            }
          : statusFromReq === StatusImage.NEW && imageDb
            ? {
                connectOrCreate: {
                  where: {
                    publicId: imageDb.publicId
                  },
                  create: {
                    ...imageDb,
                    url: imageDb?.url || '',
                    altText: imageDb?.altText || 'Ảnh của danh mục ' + (data?.name || ''),
                    type: imageDb?.type || ImageType.THUMBNAIL
                  }
                }
              }
            : undefined
    },
    include: { image: true }
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
