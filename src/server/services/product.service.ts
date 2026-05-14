import { ManageTagVi } from '~/lib/FuncHandler/CreateTag-vi';

import { EntityType, ImageType, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { buildSortFilter } from '~/lib/FuncHandler/PrismaHelper';
import { UserRole } from '~/shared/constants/user';
import { StatusImage } from '~/shared/schema/image.info.schema';
import { FilterProductOptions } from '~/shared/schema/product.filter.schema';
import { ProductFromDb, ServiceOptions } from '~/shared/schema/product.schema';

const buildFilter = (input: FilterProductOptions) => {
  const {
    s,
    filter,
    rating,
    'nguyen-lieu': nguyenLieu,
    minPrice,
    maxPrice,
    loai,
    'danh-muc': danhMuc,
    'loai-san-pham': loaiSanPham,
    userRole
  } = input;
  const search = s?.trim();
  return [
    userRole && userRole != UserRole.CUSTOMER
      ? undefined
      : {
          isActive: true
        },
    loaiSanPham || danhMuc
      ? {
          subCategory: {
            tag: {
              equals: loaiSanPham
            },
            category: {
              tag: {
                equals: danhMuc
              }
            }
          }
        }
      : undefined,
    search
      ? {
          OR: [
            {
              materials: {
                some: {
                  category: { equals: search }
                }
              }
            },
            {
              tags: {
                has: search
              }
            },
            { name: { contains: search, mode: 'insensitive' } },
            {
              subCategory: {
                OR: [
                  { tag: { equals: search } },
                  {
                    category: {
                      OR: [
                        { tag: { contains: search, mode: 'insensitive' } },
                        { name: { contains: search, mode: 'insensitive' } }
                      ]
                    }
                  }
                ]
              }
            },
            {
              region: { contains: search, mode: 'insensitive' }
            }
          ],
          isActive: filter === 'ACTIVE@#@$@@' ? true : filter === 'INACTIVE@#@$@@' ? false : undefined
        }
      : undefined,
    loai == 'san-pham-giam-gia' ? { discount: { gt: 0 } } : undefined,
    loai == 'san-pham-ban-chay' ? { soldQuantity: { gt: 20 } } : undefined,
    loai == 'san-pham-moi' ? { updatedAt: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) } } : undefined,
    loai == 'san-pham-hot' ? { rating: { gte: 4 } } : undefined,
    rating ? { rating: { gte: rating } } : undefined,
    nguyenLieu && nguyenLieu?.length > 0
      ? {
          materials: {
            some: {
              tag: {
                in: nguyenLieu
              }
            }
          }
        }
      : undefined,
    minPrice || maxPrice
      ? {
          price: {
            gte: minPrice ?? 0,
            lte: maxPrice ?? 0
          }
        }
      : undefined
  ].filter(Boolean);
};

export const findProductService = async (db: PrismaClient, input: FilterProductOptions) => {
  const { page, limit, sort } = input;

  const filterParams = buildFilter(input);
  const [totalProducts, totalProductsQuery, products] = await db.$transaction([
    db.product.count(),
    db.product.count({
      where: {
        AND: filterParams.length > 0 ? filterParams : undefined
      } as any
    }),
    db.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        AND: filterParams.length > 0 ? filterParams : undefined
      } as any,
      include: {
        imageForEntities: { include: { image: true } },
        materials: true,
        subCategory: {
          select: {
            id: true,
            tag: true,
            name: true,
            category: true,
            imageForEntity: { include: { image: true } }
          }
        },
        review: true,
        favouriteFood: true
      },
      orderBy:
        sort && sort?.length > 0
          ? buildSortFilter(sort, ['rating', 'updatedAt', 'soldQuantity', 'price', 'name'])
          : undefined
    })
  ]);
  const totalPages = Math.ceil(
    Object.entries(input).length > 2
      ? totalProductsQuery == 0
        ? 1
        : totalProductsQuery / limit
      : totalProducts / limit
  );

  return {
    products,
    pagination: {
      currentPage: page,
      totalPages,
      totalProducts: totalProductsQuery
    }
  };
};

export const deleteProductService = async (db: PrismaClient, input: { id: string }) => {
  const productDeleted = await db.product.delete({
    where: { id: input.id },
    include: {
      imageForEntities: { include: { image: true } }
    }
  });
  return {
    metaData: {
      before: productDeleted ?? {},
      after: {}
    }
  };
};
export const getFilterProductService = async (db: PrismaClient, input: ServiceOptions) => {
  const { s, hasCategory, hasCategoryChild, hasReview, userRole }: any = input;
  const search = s?.trim();
  const product = await db.product.findMany({
    where: {
      ...(userRole && userRole != UserRole.CUSTOMER
        ? {}
        : {
            isActive: true
          }),
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
      imageForEntities: { include: { image: true } },
      materials: true,
      subCategory: {
        include: {
          imageForEntity: { include: { image: true } },
          ...(hasCategoryChild
            ? {
                category: hasCategory ? true : false
              }
            : false)
        }
      },
      review: hasReview ? true : false,
      favouriteFood: true
    }
  });

  return product;
};
export const getOneProductService = async (db: PrismaClient, input: ServiceOptions) => {
  const { s, hasCategory, hasCategoryChild, hasReview, hasUser, userRole }: any = input;
  return await db.product.findFirst({
    where: {
      ...(userRole && userRole != UserRole.CUSTOMER
        ? {}
        : {
            isActive: true
          }),

      OR: [{ id: s }, { tag: s }]
    },
    include: {
      imageForEntities: {
        include: { image: true }
      },
      materials: true,
      subCategory: {
        include: {
          imageForEntity: { include: { image: true } },
          ...(hasCategoryChild
            ? {
                category: hasCategory ? true : false
              }
            : false)
        }
      },
      review: {
        ...(hasReview
          ? {
              include: {
                user: {
                  ...(hasUser
                    ? {
                        select: {
                          id: true,
                          name: true,
                          imageForEntity: { include: { image: true } }
                        }
                      }
                    : false)
                }
              }
            }
          : false)
      },
      favouriteFood: true
    }
  });
};
export const getAllProductService = async (db: PrismaClient, input: ServiceOptions) => {
  const { hasCategory, hasCategoryChild, hasReview, userRole }: any = input;
  const product = await db.product.findMany({
    where: {
      ...(userRole && userRole != UserRole.CUSTOMER ? {} : { isActive: true })
    },
    include: {
      imageForEntities: { include: { image: true } },
      materials: true,
      subCategory: {
        include: {
          imageForEntity: { include: { image: true } },
          ...(hasCategoryChild
            ? {
                category: hasCategory ? true : false
              }
            : undefined)
        }
      },
      review: hasReview ? true : undefined,
      favouriteFood: true
    }
  });
  return product;
};

export const upsertProductToCloudinaryService = async (db: PrismaClient, input1: ProductFromDb) => {
  const { id, subCategoryId, imageForEntities, ...data } = input1;
  const existed = id
    ? await db.product.findUnique({
        where: { id },
        include: { imageForEntities: { include: { image: true } } }
      })
    : null;

  if (!id || (existed && existed.tag !== data.tag)) {
    const duplicateProduct = await db.product.findUnique({
      where: { tag_subCategoryId: { tag: data.tag, subCategoryId } }
    });

    if (duplicateProduct) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Sản phẩm đã tồn tại.' });
    }
  }

  const inputImageForEntities = [...(imageForEntities || [])];
  const newImages = inputImageForEntities.filter(i => i?.status === StatusImage.NEW) || [];
  const deleteImages = inputImageForEntities.filter(i => i?.status === StatusImage.DELETED) || [];
  const upserted = await db.product.upsert({
    where: {
      id: id || ''
    },
    create: {
      ...data,
      tag: data.tag || 'san-pham',
      subCategory: {
        connect: {
          id: subCategoryId
        }
      },
      materials: data.materials ? { connect: data.materials.map((item: any) => ({ id: item })) } : undefined,
      imageForEntities: newImages?.length
        ? {
            create: newImages.map(({ status, ...item }: any) => ({
              id: undefined,
              entityType: EntityType.PRODUCT,
              altText: `Ảnh  ${data.name}`,
              type: item?.image?.type || ImageType.THUMBNAIL,
              image: {
                connectOrCreate: {
                  where: {
                    publicId: item?.image?.publicId
                  },
                  create: {
                    ...(item?.image ?? {}),
                    url: item?.image?.url || '',
                    altText: item?.image?.altText || 'Ảnh của sản phẩm ' + (data?.name || ''),
                    type: item?.image?.type || ImageType.THUMBNAIL
                  }
                }
              }
            }))
          }
        : undefined
    },
    update: {
      ...data,
      subCategory: {
        connect: {
          id: subCategoryId
        }
      },
      materials: data.materials ? { connect: data.materials.map((item: any) => ({ id: item })) } : undefined,
      imageForEntities: {
        ...(newImages?.length
          ? {
              upsert: newImages.map(({ status, ...item }: any) => ({
                where: {
                  id: item?.id || 'default_id'
                },
                create: {
                  entityType: EntityType.PRODUCT,
                  altText: `Ảnh  ${data.name}`,
                  type: item?.image?.type || ImageType.THUMBNAIL,
                  image: {
                    connectOrCreate: {
                      where: {
                        publicId: item?.image?.publicId
                      },
                      create: {
                        ...(item?.image ?? {}),
                        url: item?.image?.url || '',
                        altText: item?.image?.altText || 'Ảnh của sản phẩm ' + (data?.name || ''),
                        type: item?.image?.type || ImageType.THUMBNAIL
                      }
                    }
                  }
                },
                update: {
                  entityType: EntityType.PRODUCT,
                  altText: `Ảnh  ${data.name}`,
                  type: item?.image?.type || ImageType.THUMBNAIL,
                  image: {
                    connectOrCreate: {
                      where: {
                        publicId: item?.image?.publicId
                      },
                      create: {
                        ...(item?.image ?? {}),
                        url: item?.image?.url || '',
                        altText: item?.image?.altText || 'Ảnh của sản phẩm ' + (data?.name || ''),
                        type: item?.image?.type || ImageType.THUMBNAIL
                      }
                    }
                  }
                }
              }))
            }
          : {}),
        delete: deleteImages ? deleteImages?.map(item => ({ id: item?.id })) : undefined
      }
    },
    include: { imageForEntities: { include: { image: true } } }
  });

  if (upserted?.tag) {
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

export const findInfiniteProductService = async (
  db: PrismaClient,
  input: {
    limit?: number | null;
    cursor?: string | null;
    filters?: {
      search?: string;
      'danh-muc'?: string | null;
    };
  }
) => {
  const danhMuc = input.filters?.['danh-muc'];
  const search = input.filters?.search?.trim() ?? '';
  const limit = input.limit ?? 50;
  const { cursor } = input;
  const items = await db.product.findMany({
    take: limit + 1,
    where: {
      subCategory: danhMuc
        ? {
            tag: {
              equals: danhMuc
            }
          }
        : undefined
    },
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: {
      createdAt: 'asc'
    }
  });
  let nextCursor: typeof cursor | undefined = undefined;
  if (items.length > limit) {
    const nextItem = items.pop();
    nextCursor = nextItem!.id;
  }

  return {
    items,
    nextCursor
  };
};
