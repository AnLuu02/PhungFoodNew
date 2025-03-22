import { EntityType, ImageType, OrderStatus, ProductStatus } from '@prisma/client';
import { del, put } from '@vercel/blob';
import { z } from 'zod';
import { UserRole } from '~/app/lib/utils/constants/roles';
import { CreateTagVi } from '~/app/lib/utils/func-handler/CreateTag-vi';
import { getFileNameFromVercelBlob, tokenBlobVercel } from '~/app/lib/utils/func-handler/handle-file-upload';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export async function updateSales(ctx: any, status: OrderStatus, productId: string, soldQuantity: number) {
  await ctx.db.product.update({
    where: { id: productId },
    data: {
      soldQuantity: status === OrderStatus.COMPLETED ? { increment: soldQuantity } : { decrement: soldQuantity },
      availableQuantity: status === OrderStatus.COMPLETED ? { decrement: soldQuantity } : { increment: soldQuantity }
    }
  });
}

export async function updatePointLevel(ctx: any, userId: string, orderTotal: number) {
  await ctx.db.user.update({
    where: { id: userId },
    data: {
      pointLevel: { increment: orderTotal >= 10000 ? orderTotal / 10000 : 0 }
    }
  });
}

type FilterOptions = {
  s?: string;
  discount?: boolean;
  bestSaler?: boolean;
  newProduct?: boolean;
  hotProduct?: boolean;
  price?: { min?: number; max?: number };
  sort?: string[];
  'nguyen-lieu'?: string[];
  'danh-muc'?: string;
  'loai-san-pham'?: string;
};

const buildSortFilter = (sort: any) => {
  const orderBy: any[] = [];

  if (sort?.includes('price-asc') || sort?.includes('price-desc')) {
    orderBy.push({
      price: sort.includes('price-asc') ? 'asc' : 'desc'
    });
  }

  if (sort?.includes('name-asc') || sort?.includes('name-desc')) {
    orderBy.push({
      name: sort.includes('name-asc') ? 'asc' : 'desc'
    });
  }
  return orderBy?.map(item => item).filter(Boolean);
};
const buildFilter = (input: FilterOptions, userRole: any) => {
  const {
    s,
    discount,
    bestSaler,
    newProduct,
    hotProduct,
    sort,
    'nguyen-lieu': nguyenLieu,
    price,
    'danh-muc': danhMuc,
    'loai-san-pham': loaiSanPham
  } = input;
  return [
    userRole && userRole != UserRole.CUSTOMER
      ? undefined
      : {
          status: ProductStatus.ACTIVE
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
    s
      ? {
          OR: [
            {
              materials: {
                some: {
                  category: { equals: s?.trim() }
                }
              }
            },
            {
              tags: {
                has: s?.trim()
              }
            },
            { name: { contains: s?.trim(), mode: 'insensitive' } },
            { subCategory: { tag: { equals: s?.trim() } } },
            {
              region: { contains: s?.trim(), mode: 'insensitive' }
            }
          ]
        }
      : undefined,
    discount ? { discount: { gt: 0 } } : undefined,
    bestSaler ? { soldQuantity: { gt: 20 } } : undefined,
    newProduct ? { createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) } } : undefined,
    hotProduct ? { rating: { gte: 4 } } : undefined,
    sort && sort?.length > 0 && sort?.includes('best-seller')
      ? { soldQuantity: { gt: 20 } }
      : sort?.includes('old')
        ? { createdAt: { lte: new Date(new Date().setDate(new Date().getDate() - 7)) } }
        : sort?.includes('new')
          ? { createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) } }
          : undefined,
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

export const productRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional(),
        sort: z.array(z.string()).optional(),
        'nguyen-lieu': z.array(z.string()).optional(),
        discount: z.boolean().optional(),
        bestSaler: z.boolean().optional(),
        newProduct: z.boolean().optional(),
        hotProduct: z.boolean().optional(),
        'danh-muc': z.string().optional(),
        'loai-san-pham': z.string().optional(),
        price: z
          .object({
            min: z.number().optional(),
            max: z.number().optional()
          })
          .optional(),
        userRole: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const {
        skip,
        take,
        s,
        sort,
        price,
        discount,
        bestSaler,
        newProduct,
        hotProduct,
        'nguyen-lieu': nguyenLieu,
        'danh-muc': danhMuc,
        'loai-san-pham': loaiSanPham
      } = input;

      const startPageItem = skip > 0 ? (skip - 1) * take : 0;

      const filter = buildFilter(
        {
          s,
          discount,
          bestSaler,
          newProduct,
          hotProduct,
          price,
          sort,
          'nguyen-lieu': nguyenLieu,
          'danh-muc': danhMuc,
          'loai-san-pham': loaiSanPham
        },
        input.userRole
      );
      const [totalProducts, totalProductsQuery, products] = await ctx.db.$transaction([
        ctx.db.product.count(),
        ctx.db.product.count({
          where: {
            AND: filter.length > 0 ? filter : undefined
          } as any
        }),
        ctx.db.product.findMany({
          skip: startPageItem,
          take,
          where: {
            AND: filter.length > 0 ? filter : undefined
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
          orderBy: sort && sort?.length > 0 ? buildSortFilter(sort) : undefined
        })
      ]);
      const totalPages = Math.ceil(
        s || danhMuc || loaiSanPham || sort || discount || price
          ? totalProductsQuery == 0
            ? 1
            : totalProductsQuery / take
          : totalProducts / take
      );

      const currentPage = skip ? Math.floor(skip / take + 1) : 1;

      return {
        products,
        pagination: {
          currentPage,
          totalPages
        }
      };
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Tên không được để trống'),
        description: z.string().optional(),
        tag: z.string(),
        price: z.number().min(10000, 'Giá trị phải >= 10.000').default(10000),
        discount: z.number().min(0, 'Giảm giá không được âm').default(0),
        tags: z.array(z.string()).optional(),
        status: z.nativeEnum(ProductStatus).default(ProductStatus.ACTIVE),
        region: z.string().min(1, 'Món ăn này là của miền nào đây?'),
        thumbnail: z
          .object({
            fileName: z.string(),
            base64: z.string()
          })
          .optional(),
        gallery: z
          .array(
            z.object({
              fileName: z.string(),
              base64: z.string()
            })
          )
          .optional(),
        subCategoryId: z.string().optional(),
        materials: z.array(z.string()).optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.product.findFirst({
        where: { tag: input.tag }
      });

      if (existed) {
        return {
          success: false,
          message: 'Sản phẩm đã tồn tại. Hãy thử lại.',
          record: existed
        };
      }

      let thumbnailURL: string | null = null;
      if (input.thumbnail) {
        const buffer = Buffer.from(input.thumbnail.base64, 'base64');
        const blob = await put(input.thumbnail.fileName, buffer, { access: 'public', token: tokenBlobVercel });
        thumbnailURL = blob.url;
      }

      const galleryURLs = await Promise.all(
        (input.gallery ?? []).map(async item => {
          const buffer = Buffer.from(item.base64, 'base64');
          const blob = await put(item.fileName, buffer, { access: 'public', token: tokenBlobVercel });
          const uploadedUrl = blob.url;
          return uploadedUrl ? { url: uploadedUrl, type: ImageType.GALLERY } : null;
        })
      ).then(results => results.filter(item => item !== null));

      const product = await ctx.db.product.create({
        data: {
          name: input.name,
          description: input.description,
          tag: input.tag,
          price: input.price,
          discount: input.discount,
          subCategoryId: input.subCategoryId,
          region: input.region,
          tags: input.tags,
          status: input.status,
          materials: input.materials ? { connect: input.materials.map(item => ({ id: item })) } : undefined,
          images: {
            create: [
              ...(thumbnailURL
                ? [
                    {
                      url: thumbnailURL,
                      type: ImageType.THUMBNAIL,
                      entityType: EntityType.PRODUCT,
                      altText: `Ảnh ${input?.thumbnail?.fileName} loại ${ImageType.THUMBNAIL}`
                    }
                  ]
                : []),
              ...galleryURLs.map(item => ({
                url: item.url,
                type: item.type,
                entityType: EntityType.PRODUCT,
                altText: `Ảnh ${item?.url} loại ${ImageType.GALLERY}`
              }))
            ]
          }
        }
      });

      if (product?.tag) {
        await CreateTagVi({ old: [], new: product });
      }

      return {
        success: true,
        message: 'Tạo sản phẩm thành công.',
        record: product
      };
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, 'Tên không được để trống'),
        description: z.string().optional(),
        tag: z.string(),
        price: z.number().min(10000, 'Giá trị phải >= 10.000').default(10000),
        discount: z.number().min(0, 'Giảm giá không được âm').default(0),
        region: z.string().min(1, 'Món ăn này là của miền nào đây?'),
        tags: z.array(z.string()).optional(),
        status: z.nativeEnum(ProductStatus).default(ProductStatus.ACTIVE),
        thumbnail: z
          .object({
            fileName: z.string(),
            base64: z.string()
          })
          .optional(),
        gallery: z
          .array(
            z.object({
              fileName: z.string(),
              base64: z.string()
            })
          )
          .optional(),
        subCategoryId: z.string().optional(),
        materials: z.array(z.string()).optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingProduct = await ctx.db.product.findUnique({
        where: { id: input.id },
        include: { images: true }
      });

      if (!existingProduct) {
        return {
          success: false,
          message: 'Sản phẩm không tồn tại.',
          record: null
        };
      }

      const duplicateProduct = await ctx.db.product.findFirst({
        where: { tag: input.tag, id: { not: input.id } }
      });

      if (duplicateProduct) {
        return {
          success: false,
          message: 'Sản phẩm đã tồn tại.',
          record: duplicateProduct
        };
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
        input.gallery?.filter(item => !anh_trong_db_dang_filename.some(anhdb => anhdb.fileName === item.fileName)) ??
        [];

      const anh_xoa = oldGallery.filter(
        item => !input.gallery?.some(img => img?.fileName === getFileNameFromVercelBlob(item.url))
      );

      const results = await Promise.all([
        ...anh_xoa.map(img => del(img.url, { token: tokenBlobVercel }).then(() => null)),
        ...anh_moi.map(async item => {
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
          } catch (error) {
            console.error('Failed to upload image:', item.fileName, error);
            return null;
          }
        })
      ]);

      const newGallery = results.filter(Boolean);

      const newImages = [newThumbnail, ...oldGallery, ...newGallery]
        .filter((item: any) => !anh_xoa.some(img => img?.url === item.url))
        .filter(Boolean);

      const [product, updatedProduct] = await ctx.db.$transaction([
        ctx.db.product.findUnique({ where: { id: input.id } }),
        ctx.db.product.update({
          where: {
            id: input.id
          },
          data: {
            name: input.name,
            description: input.description,
            tag: input.tag,
            price: input.price,
            discount: input.discount,
            subCategoryId: input.subCategoryId,
            region: input.region,
            tags: input.tags,
            status: input.status,
            materials: input.materials ? { connect: input.materials.map(item => ({ id: item })) } : undefined,
            images:
              newImages?.length > 0
                ? {
                    deleteMany: {
                      productId: input.id,
                      url: {
                        notIn: newImages.map(img => img?.url)?.filter(Boolean)
                      }
                    },
                    upsert: newImages.map(img => ({
                      where: {
                        id_productId_entityType_type: {
                          id: img?.id || '',
                          productId: input.id,
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
                      } as any,
                      create: {
                        url: img?.url,
                        type: img?.type,
                        altText: img?.altText,
                        entityType: img?.entityType
                      } as any
                    }))
                  }
                : undefined
          },
          include: { images: true }
        })
      ]);

      if (updatedProduct?.tag && product?.tag) {
        await CreateTagVi({ old: product, new: updatedProduct });
      }

      return {
        success: true,
        message: 'Cập nhật sản phẩm thành công.',
        record: updatedProduct
      };
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.product.findFirst({
        where: { id: input.id },
        include: { images: true }
      });
      if (product?.images && product.images.length > 0) {
        await Promise.all(product.images.map(image => del(image.url, { token: tokenBlobVercel })));
      }
      const productDeleted = await ctx.db.product.delete({
        where: { id: input.id },
        include: { images: true }
      });
      return {
        success: true,
        message: 'Xóa sản phẩm thành công.',
        record: productDeleted
      };
    }),
  getFilter: publicProcedure
    .input(
      z.object({
        s: z.string().optional(),
        hasCategory: z.boolean().default(false).optional(),
        hasCategoryChild: z.boolean().default(false).optional(),
        hasReview: z.boolean().default(false).optional(),
        userRole: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { s, hasCategory, hasCategoryChild, hasReview, userRole }: any = input;
      const product = await ctx.db.product.findMany({
        where: {
          ...(userRole && userRole != UserRole.CUSTOMER
            ? {}
            : {
                status: ProductStatus.ACTIVE
              }),
          OR: [
            { id: s?.trim() },
            { tag: s?.trim() },
            {
              materials: {
                some: {
                  category: s?.trim()
                }
              }
            },
            {
              subCategory: {
                OR: [
                  {
                    tag: s?.trim()
                  },

                  {
                    category: {
                      tag: s?.trim()
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
    }),

  getOne: publicProcedure
    .input(
      z.object({
        s: z.string(),
        hasCategory: z.boolean().default(false).optional(),
        hasCategoryChild: z.boolean().default(false).optional(),
        hasReview: z.boolean().default(false).optional(),
        hasUser: z.boolean().default(false).optional(),
        userRole: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { s, hasCategory, hasCategoryChild, hasReview, hasUser, userRole }: any = input;

      const product = await ctx.db.product.findFirst({
        where: {
          ...(userRole && userRole != UserRole.CUSTOMER
            ? {}
            : {
                status: ProductStatus.ACTIVE
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

      return product;
    }),
  getAll: publicProcedure
    .input(
      z.object({
        hasCategory: z.boolean().default(false).optional(),
        hasCategoryChild: z.boolean().default(false).optional(),
        hasReview: z.boolean().default(false).optional(),
        userRole: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { hasCategory, hasCategoryChild, hasReview, userRole }: any = input;
      const product = await ctx.db.product.findMany({
        where: {
          ...(userRole && userRole != UserRole.CUSTOMER
            ? {}
            : {
                status: ProductStatus.ACTIVE
              })
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
    }),

  getTotalProductSales: publicProcedure.query(async ({ ctx }) => {
    const totalProductSales = await ctx.db.product.aggregate({
      _sum: {
        soldQuantity: true
      }
    });
    return totalProductSales._sum.soldQuantity;
  })
});
