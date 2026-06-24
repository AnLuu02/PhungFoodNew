import { ManageTagVi } from '~/lib/FuncHandler/CreateTag-vi';

import { EntityType, ImageType, Prisma, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { moneyToNumber } from '~/lib/FuncHandler/Format';
import { buildSortFilter } from '~/lib/FuncHandler/PrismaHelper';
import { TUserRole, UserRole } from '~/shared/constants/user.constants';
import { StatusImage } from '~/shared/schema/image.info.schema';
import { FilterProductOptions } from '~/shared/schema/product.filter.schema';
import { ProductFromDb } from '~/shared/schema/product.schema';

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
            lte: maxPrice
          }
        }
      : undefined
  ].filter(Boolean);
};

export const findProductService = async (
  db: PrismaClient,
  input: FilterProductOptions & { include?: Prisma.ProductInclude }
) => {
  const { page, limit, sort, include } = input;

  const filterParams = buildFilter(input);
  const where: Prisma.ProductWhereInput = {
    AND: filterParams.length > 0 ? filterParams : undefined
  } as any;
  const [totalProducts, totalProductsQuery, products] = await db.$transaction([
    db.product.count(),
    db.product.count({
      where
    }),
    db.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
      include: {
        ...(include ?? {}),
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
        favouriteFoods: true
      },
      orderBy:
        sort && sort?.length > 0
          ? buildSortFilter(sort, ['rating', 'updatedAt', 'soldQuantity', 'price', 'name'])
          : { createdAt: 'desc' }
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
    products: products.map(p => ({ ...p, discount: moneyToNumber(p.discount), price: moneyToNumber(p.price) })),
    pagination: {
      currentPage: page,
      totalPages,
      totalProducts: totalProductsQuery,
      hasNext: Boolean(totalPages > page)
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
      before: productDeleted
        ? {
            ...productDeleted,
            discount: moneyToNumber(productDeleted.discount),
            price: moneyToNumber(productDeleted.price)
          }
        : {},
      after: {}
    }
  };
};
export const getFilterProductService = async (
  db: PrismaClient,
  input: {
    s?: string;
    keys: string[];
    userRole?: TUserRole;
    excludes?: string[];
    include?: Prisma.ProductInclude;
  }
) => {
  const { s, excludes, userRole } = input;
  const keys = input?.keys;
  const search = s?.trim();
  const products = await db.product.findMany({
    where: {
      OR: [
        {
          id: {
            in: keys
          }
        },
        {
          tag: {
            in: keys
          }
        },
        {
          subCategoryId: {
            in: keys
          }
        },
        {
          subCategory: {
            OR: [
              {
                tag: {
                  in: keys
                }
              },
              {
                categoryId: {
                  in: keys
                }
              },
              {
                category: {
                  tag: {
                    in: keys
                  }
                }
              }
            ]
          }
        }
      ],
      ...(userRole && userRole != UserRole.CUSTOMER
        ? {}
        : {
            isActive: true
          }),
      ...(search
        ? {
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
                      id: search
                    },
                    {
                      tag: search
                    },

                    {
                      category: {
                        OR: [
                          {
                            tag: search
                          },
                          {
                            id: search
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        : {}),
      ...(excludes && excludes.length > 0
        ? {
            NOT: {
              OR: [{ id: { in: excludes } }, { tag: { in: excludes } }]
            }
          }
        : {})
    },
    include: {
      imageForEntities: { include: { image: true } },
      materials: true,
      subCategory: {
        include: {
          imageForEntity: { include: { image: true } },
          category: true
        }
      },
      review: true,
      favouriteFoods: true
      // ...(include ?? {})
    }
  });

  return products.map(p => ({ ...p, discount: moneyToNumber(p.discount), price: moneyToNumber(p.price) }));
};
export const getOneProductService = async (
  db: PrismaClient,
  input: {
    key: string;
    userRole?: TUserRole;
  }
) => {
  const { key, userRole } = input;

  const product = await db.product.findFirst({
    where: {
      ...(userRole && userRole != UserRole.CUSTOMER
        ? {}
        : {
            isActive: true
          }),

      OR: [{ id: key }, { tag: key }]
    },
    include: {
      imageForEntities: {
        include: { image: true }
      },
      materials: true,
      subCategory: {
        include: {
          imageForEntity: { include: { image: true } },
          category: true
        }
      }
    }
  });
  if (!product) throw new TRPCError({ code: 'NOT_FOUND', message: 'Opps! Có vẻ như sản phẩm không tồn tại.' });
  return {
    ...product,
    price: moneyToNumber(product.price),
    discount: moneyToNumber(product.discount)
  };
};
export const getAllProductService = async (
  db: PrismaClient,
  input: {
    userRole?: TUserRole;
    include?: Prisma.ProductInclude;
  }
) => {
  const { include, userRole } = input;
  const products = await db.product.findMany({
    where: {
      ...(userRole && userRole != UserRole.CUSTOMER ? {} : { isActive: true })
    },
    include: {
      ...(include ?? {}),
      imageForEntities: { include: { image: true } },
      materials: true,
      favouriteFoods: true
    }
  });
  return products.map(p => ({ ...p, discount: moneyToNumber(p.discount), price: moneyToNumber(p.price) }));
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
      before: existed
        ? {
            ...existed,
            price: moneyToNumber(existed.price),
            discount: moneyToNumber(existed.discount)
          }
        : {},
      after: {
        ...upserted,
        discount: moneyToNumber(upserted.discount),
        price: moneyToNumber(upserted.price)
      }
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
    include?: Prisma.ProductInclude;
  }
) => {
  const danhMuc = input.filters?.['danh-muc'];
  const search = input.filters?.search?.trim() ?? '';
  const limit = input.limit ?? 50;
  const { cursor } = input;
  const items = await db.product.findMany({
    take: limit + 1,
    where: {
      ...(danhMuc
        ? {
            subCategory: {
              OR: [
                {
                  tag: danhMuc
                },
                {
                  category: {
                    tag: danhMuc
                  }
                }
              ]
            }
          }
        : {}),
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: 'insensitive'
                },
                description: {
                  contains: search,
                  mode: 'insensitive'
                }
              }
            ]
          }
        : {})
    },
    cursor: cursor ? { id: cursor } : undefined,
    include: {
      ...(input?.include ?? {}),
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
      favouriteFoods: true
    },
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
    items: items.map(p => ({ ...p, price: moneyToNumber(p.price), discount: moneyToNumber(p.discount) })),
    nextCursor
  };
};
