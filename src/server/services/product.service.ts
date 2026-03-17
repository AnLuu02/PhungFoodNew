import { del, put } from '@vercel/blob';
import { ManageTagVi } from '~/lib/FuncHandler/CreateTag-vi';
import { getFileNameFromVercelBlob, tokenBlobVercel } from '~/lib/FuncHandler/handle-file-base64';

import { EntityType, ImageType, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { buildSortFilter } from '~/lib/FuncHandler/PrismaHelper';
import { NotifyError } from '~/lib/FuncHandler/toast';
import { UserRole } from '~/shared/constants/user';
import { FilterProductInput, FilterProductOptions, ProductReq, ServiceOptions } from '~/shared/schema/product.schema';

const buildFilter = (input: FilterProductOptions, userRole: any) => {
  const {
    s,
    filter,
    discount,
    bestSaler,
    newProduct,
    hotProduct,
    rating,
    'nguyen-lieu': nguyenLieu,
    price,
    'danh-muc': danhMuc,
    'loai-san-pham': loaiSanPham
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
    discount ? { discount: { gt: 0 } } : undefined,
    bestSaler ? { soldQuantity: { gt: 20 } } : undefined,
    newProduct ? { updatedAt: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) } } : undefined,
    hotProduct ? { rating: { gte: 4 } } : undefined,
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
    price
      ? {
          price: {
            gte: price.min,
            lte: price.max
          }
        }
      : undefined
  ].filter(Boolean);
};

export const findProductService = async (db: PrismaClient, input: FilterProductInput) => {
  const {
    skip,
    take,
    s,
    filter,
    sort,
    price,
    discount,
    bestSaler,
    newProduct,
    rating,
    hotProduct,
    'nguyen-lieu': nguyenLieu,
    'danh-muc': danhMuc,
    'loai-san-pham': loaiSanPham
  } = input;

  const startPageItem = skip > 0 ? (skip - 1) * take : 0;
  const filterParams = buildFilter(
    {
      s,
      filter,
      discount,
      bestSaler,
      newProduct,
      rating,
      hotProduct,
      price,
      'nguyen-lieu': nguyenLieu,
      'danh-muc': danhMuc,
      'loai-san-pham': loaiSanPham
    },
    input.userRole
  );
  const [totalProducts, totalProductsQuery, products] = await db.$transaction([
    db.product.count(),
    db.product.count({
      where: {
        AND: filterParams.length > 0 ? filterParams : undefined
      } as any
    }),
    db.product.findMany({
      skip: startPageItem,
      take,
      where: {
        AND: filterParams.length > 0 ? filterParams : undefined
      } as any,
      include: {
        images: true,
        materials: true,
        subCategory: {
          select: {
            id: true,
            tag: true,
            name: true,
            category: true,
            image: true
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
    Object.entries(input).length > 2 ? (totalProductsQuery == 0 ? 1 : totalProductsQuery / take) : totalProducts / take
  );

  const currentPage = skip ? Math.floor(skip / take + 1) : 1;
  return {
    products,
    pagination: {
      currentPage,
      totalPages,
      totalProducts: totalProductsQuery
    }
  };
};

export const upsertProductService = async (db: PrismaClient, input: ProductReq) => {
  const existingProduct = await db.product.findUnique({
    where: { id: input.id },
    include: { images: true }
  });

  if (!existingProduct) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Sản phẩm không tồn tại.' });
  }

  const duplicateProduct = await db.product.findFirst({
    where: { tag: input.tag, id: { not: input.id } }
  });

  if (duplicateProduct) {
    throw new TRPCError({ code: 'CONFLICT', message: 'Sản phẩm đã tồn tại.' });
  }

  const oldImages = existingProduct.images || [];
  const oldThumbnail = oldImages.find(img => img?.type === ImageType.THUMBNAIL);
  const oldGallery = oldImages.filter(img => img?.type === ImageType.GALLERY);

  let newThumbnail: any = oldThumbnail;
  if (input.thumbnail?.fileName) {
    const filenameImgFromDb = oldThumbnail ? getFileNameFromVercelBlob(oldThumbnail.url) : null;
    if (filenameImgFromDb !== input.thumbnail.fileName) {
      const url = (
        await put(input.thumbnail.fileName, Buffer.from(input.thumbnail.base64, 'base64'), {
          access: 'public',
          token: tokenBlobVercel
        })
      )?.url;
      newThumbnail = {
        url: url,
        type: ImageType.THUMBNAIL,
        altText: `Ảnh ${input.thumbnail.fileName} loại ${ImageType.THUMBNAIL}`,
        entityType: EntityType.PRODUCT
      };

      if (oldThumbnail) await del(oldThumbnail.url, { token: tokenBlobVercel });
    }
  }

  const anh_trong_db_dang_filename = oldGallery.map(item => ({
    id: item.id,
    fileName: getFileNameFromVercelBlob(item.url)
  }));

  const anh_moi =
    input.gallery?.filter((item: any) => !anh_trong_db_dang_filename.some(anhdb => anhdb.fileName === item.fileName)) ??
    [];

  const anh_xoa = oldGallery.filter(
    item => !input.gallery?.some((img: any) => img?.fileName === getFileNameFromVercelBlob(item.url))
  );

  const results = await Promise.all([
    ...anh_xoa.map(img => del(img.url, { token: tokenBlobVercel }).then(() => null)),
    ...anh_moi.map(async (item: any) => {
      try {
        const buffer = Buffer.from(item.base64, 'base64');
        const blob = await put(item.fileName, buffer, { access: 'public', token: tokenBlobVercel });
        const uploadedImage = blob.url;
        return {
          url: uploadedImage,
          type: ImageType.GALLERY,
          altText: `Ảnh ${item.fileName} loại ${ImageType.GALLERY}`,
          entityType: EntityType.PRODUCT
        };
      } catch {
        NotifyError('Có lỗi xảy ra khi tải ảnh lên Vercel Blob');
        return null;
      }
    })
  ]);

  const newGallery = results.filter(Boolean);

  const newImages = [newThumbnail, ...oldGallery, ...newGallery]
    .filter((item: any) => !anh_xoa.some(img => img?.url === item.url))
    .filter(Boolean);

  const updatedProduct = await db.product.upsert({
    where: {
      id: input.id
    },
    create: {
      ...input,
      tag: input.tag || 'san-pham',
      materials: input.materials ? { connect: input.materials.map((item: any) => ({ id: item })) } : undefined,
      images: {
        createMany: {
          data: newImages
        }
      }
    },
    update: {
      ...input,
      materials: input.materials ? { connect: input.materials.map((item: any) => ({ id: item })) } : undefined,
      images:
        newImages?.length > 0
          ? {
              deleteMany: {
                productId: input.id || '',
                url: {
                  notIn: newImages.map(img => img?.url)?.filter(Boolean)
                }
              },
              upsert: newImages.map(img => ({
                where: {
                  id_productId_entityType_type: {
                    id: img?.id || 'DEFAULT_IMAGES_ID',
                    productId: input?.id || 'DEFAULT_PRODUCT_ID',
                    entityType: img?.entityType,
                    type: img?.type
                  }
                },
                update: {
                  id: img?.id,
                  url: img?.url,
                  type: img?.type,
                  altText: img?.altText,
                  entityType: img?.entityType
                },
                create: {
                  url: img?.url,
                  type: img?.type,
                  altText: img?.altText,
                  entityType: img?.entityType
                }
              }))
            }
          : undefined
    },
    include: { images: true }
  });

  if (updatedProduct?.tag) {
    await ManageTagVi('upsert', {
      oldTag: existingProduct?.tag,
      newTag: updatedProduct.tag,
      newName: updatedProduct.name
    });
  }
  return updatedProduct;
};

export const deleteProductService = async (db: PrismaClient, input: { id: string }) => {
  const product = await db.product.findUnique({
    where: { id: input.id },
    include: { images: true }
  });
  if (product?.images && product.images.length > 0) {
    await Promise.all([
      ...product.images.map(image => del(image.url, { token: tokenBlobVercel })),
      ManageTagVi('delete', { oldTag: product.tag })
    ]);
  }
  const productDeleted = await db.product.delete({
    where: { id: input.id },
    include: { images: true }
  });
  return productDeleted;
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
      images: true,
      materials: true,

      subCategory: {
        include: {
          image: true,
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

      OR: [{ id: { equals: s } }, { tag: { equals: s?.trim() } }]
    },
    include: {
      images: true,
      materials: true,
      subCategory: {
        include: {
          image: true,
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
                          image: true
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
      images: true,
      materials: true,
      subCategory: {
        include: {
          image: true,
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
