import { EntityType, ImageType, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { del } from '@vercel/blob';
import { ManageTagVi } from '~/lib/FuncHandler/CreateTag-vi';
import { tokenBlobVercel } from '~/lib/FuncHandler/handle-file-base64';
import { SubCategoryReq } from '~/shared/schema/subCategory.schema';
import { uploadImageToVercel } from './image.service';

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
  await Promise.all([
    subCategory?.image?.url && del(subCategory?.image?.url, { token: tokenBlobVercel }),
    ManageTagVi('delete', { oldTag: deletedSubCategory.tag })
  ]);

  return deletedSubCategory;
};
export const getFilterSubCategoryService = async (db: PrismaClient, input: any) => {
  const subCategory = await db.subCategory.findMany({
    where: {
      OR: [{ id: { contains: input.s, mode: 'insensitive' } }]
    }
  });

  return subCategory;
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
export const upsertSubCategoryService = async (db: PrismaClient, input: SubCategoryReq) => {
  // const subs = await db.subCategory.findMany();
  // const format = subs.map(s => ({
  //   oldTag: s.tag.split('danh-muc-')[1],
  //   newTag: s.tag,
  //   newName: s.name
  // }));

  // await ManageTagVi('upsert', format);

  const [existedTag, existed] = await db.$transaction([
    db.subCategory.findUnique({
      where: {
        tag_categoryId: {
          tag: input.tag,
          categoryId: input.categoryId
        }
      },
      include: { category: true, image: true }
    }),
    db.subCategory.findUnique({
      where: {
        id: input.id || ''
      },
      include: { category: true, image: true }
    })
  ]);

  if (!existedTag || existedTag.id === input.id) {
    const oldImage = existedTag?.image;
    let { imgURL } = await uploadImageToVercel(oldImage, {
      fileName: input?.image?.fileName || '',
      base64: input?.image?.base64 || ''
    });
    const { id, ...data } = input;
    const updateSubCategory = await db.subCategory.upsert({
      where: {
        id: id || 'Default_ID'
      },
      create: {
        ...data,
        image: imgURL
          ? {
              create: {
                entityType: EntityType.CATEGORY,
                altText: `Ảnh ${input.name}`,
                url: imgURL,
                type: ImageType.THUMBNAIL
              }
            }
          : undefined
      },
      update: {
        ...data,
        image: imgURL
          ? {
              upsert: {
                where: oldImage && oldImage.id ? { id: oldImage.id } : { id: 'unknown' },
                update: {
                  entityType: EntityType.CATEGORY,
                  altText: `Ảnh ${input.name}`,
                  url: imgURL,
                  type: ImageType.THUMBNAIL
                } as any,
                create: {
                  entityType: EntityType.CATEGORY,
                  altText: `Ảnh ${input.name}`,
                  url: imgURL,
                  type: ImageType.THUMBNAIL
                } as any
              }
            }
          : oldImage?.id
            ? {
                delete: {
                  id: oldImage?.id
                }
              }
            : undefined
      }
    });

    if (updateSubCategory?.tag) {
      await ManageTagVi('upsert', {
        oldTag: existed?.tag,
        newTag: updateSubCategory.tag,
        newName: updateSubCategory.name
      });
    }
    return updateSubCategory;
  }

  throw new TRPCError({
    code: 'CONFLICT',
    message: 'Rất tiếc danh mục đã tồn tại.'
  });
};
