import { EntityType, ImageType } from '@prisma/client';
import { z } from 'zod';
import {
  deleteImageFromFirebase,
  getFileNameFromFirebaseFile,
  uploadToFirebase
} from '~/app/lib/utils/func-handler/handle-file-upload';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export async function updatePointLevel(ctx: any, userId: string, orderTotal: number) {
  await ctx.db.user.update({
    where: { id: userId },
    update: {
      pointLevel: { increment: orderTotal >= 10000 ? orderTotal / 10000 : 0 }
    }
  });
}

type FilterOptions = {
  query?: string;
  discount?: boolean;
  bestSaler?: boolean;
  newProduct?: boolean;
  hotProduct?: boolean;
  price?: { min?: number; max?: number };
  sort?: { price?: string; name?: string };
  'danh-muc'?: string;
  'loai-san-pham'?: string;
};

const buildSortFilter = (sort: any) => {
  const orderBy: any[] = [];

  if (sort?.price) {
    orderBy.push({
      price: sort.price === 'price-asc' ? 'asc' : 'desc'
    });
  }

  if (sort?.name) {
    orderBy.push({
      name: sort.name === 'name-asc' ? 'asc' : 'desc'
    });
  }
  return orderBy?.map(item => item).filter(Boolean);
};
const buildFilter = (input: FilterOptions) => {
  const {
    query,
    discount,
    bestSaler,
    newProduct,
    hotProduct,
    price,
    'danh-muc': danhMuc,
    'loai-san-pham': loaiSanPham
  } = input;
  return [
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
    query
      ? {
          OR: [
            { name: { contains: query?.trim(), mode: 'insensitive' } },
            { subCategory: { tag: { equals: query?.trim() } } },
            {
              region: { contains: query?.trim(), mode: 'insensitive' }
            }
          ]
        }
      : undefined,
    discount ? { discount: { gt: 0 } } : undefined,
    bestSaler ? { soldQuantity: { gt: 20 } } : undefined,
    newProduct ? { createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) } } : undefined,
    hotProduct ? { rating: { gte: 4 } } : undefined,

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
        query: z.string().optional(),
        sort: z
          .object({
            price: z.string().optional(),
            name: z.string().optional()
          })
          .optional(),
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
          .optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const {
        skip,
        take,
        query,
        sort,
        price,
        discount,
        bestSaler,
        newProduct,
        hotProduct,

        'danh-muc': danhMuc,
        'loai-san-pham': loaiSanPham
      } = input;

      const startPageItem = skip > 0 ? (skip - 1) * take : 0;

      const filter = buildFilter({
        query,
        discount,
        bestSaler,
        newProduct,
        hotProduct,
        price,
        sort,
        'danh-muc': danhMuc,
        'loai-san-pham': loaiSanPham
      });
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
            subCategory: {
              select: {
                id: true,
                tag: true,
                name: true,
                category: true,
                images: true
              }
            },
            review: true,
            favouriteFood: true
          },
          orderBy: sort ? buildSortFilter(sort) : undefined
        })
      ]);
      const totalPages = Math.ceil(
        query || danhMuc || loaiSanPham || sort || discount || price
          ? totalProductsQuery == 0
            ? 1
            : totalProductsQuery / take
          : totalProducts / take
      );

      const currentPage = skip ? Math.floor(skip / take + 1) : 1;
      // const pagination = paginate(totalProductsQuery || totalProducts, take, skip);

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
        subCategoryId: z.string().optional()
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
        thumbnailURL = await uploadToFirebase(input.thumbnail.fileName, input.thumbnail.base64);
      }

      const galleryURLs = await Promise.all(
        (input.gallery ?? []).map(async item => {
          const uploadedUrl = await uploadToFirebase(item.fileName, item.base64);
          return uploadedUrl ? { fileName: uploadedUrl, type: ImageType.GALLERY } : null;
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
          images: {
            create: [
              ...(thumbnailURL
                ? [{ url: thumbnailURL, type: ImageType.THUMBNAIL, entityType: EntityType.PRODUCT }]
                : []),
              ...galleryURLs.map(item => ({
                url: item.fileName,
                type: item.type,
                entityType: EntityType.PRODUCT
              }))
            ]
          }
        }
      });

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
        subCategoryId: z.string().optional()
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
      const oldThumbnail = oldImages.find(img => img.type === ImageType.THUMBNAIL);
      const oldGallery = oldImages.filter(img => img.type === ImageType.GALLERY);

      // handle thumbnail
      let newThumbnail: any = oldThumbnail;
      if (input.thumbnail?.fileName) {
        const filenameImgFromDb = oldThumbnail ? getFileNameFromFirebaseFile(oldThumbnail.url) : null;
        if (filenameImgFromDb !== input.thumbnail.fileName) {
          newThumbnail = {
            url: await uploadToFirebase(input.thumbnail.fileName, input.thumbnail.base64),
            type: ImageType.THUMBNAIL,
            altText: `Ảnh ${input.thumbnail.fileName} loại ${ImageType.THUMBNAIL}`,
            entityType: EntityType.PRODUCT
          };

          if (oldThumbnail) await deleteImageFromFirebase(oldThumbnail.url);
        }
      }

      // handle gallery
      const anh_trong_db_dang_filename = oldGallery.map(item => ({
        id: item.id,
        fileName: getFileNameFromFirebaseFile(item.url)
      }));

      const anh_moi =
        input.gallery?.filter(item => !anh_trong_db_dang_filename.some(anhdb => anhdb.fileName === item.fileName)) ??
        [];

      const anh_xoa = oldGallery.filter(
        item => !input.gallery?.some(img => img.fileName === getFileNameFromFirebaseFile(item.url))
      );

      const results = await Promise.all([
        ...anh_xoa.map(img => deleteImageFromFirebase(img.url).then(() => null)),
        ...anh_moi.map(async item => {
          try {
            const uploadedImage = await uploadToFirebase(item.fileName, item.base64);
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

      const newImages = [newThumbnail, ...oldGallery, ...newGallery].filter(
        (item: any) => !anh_xoa.some(img => img.url === item.url)
      );

      const updatedProduct = await ctx.db.product.update({
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
          images: {
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
                  entityType: img.entityType,
                  type: img.type
                }
              },
              update: {
                id: img.id,
                url: img.url,
                type: img.type,
                altText: img.altText,
                entityType: img.entityType
              },
              create: {
                url: img.url,
                type: img.type,
                altText: img.altText,
                entityType: img.entityType
              }
            }))
          }
        },
        include: { images: true }
      });

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
        await Promise.all(product.images.map(image => deleteImageFromFirebase(image.url)));
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
        query: z.string().optional(),
        hasCategory: z.boolean().default(false).optional(),
        hasCategoryChild: z.boolean().default(false).optional(),
        hasReview: z.boolean().default(false).optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, hasCategory, hasCategoryChild, hasReview }: any = input;
      const product = await ctx.db.product.findMany({
        where: {
          OR: [
            { id: query?.trim() },
            { tag: query?.trim() },
            {
              subCategory: {
                OR: [
                  {
                    tag: query?.trim()
                  },
                  {
                    category: {
                      tag: query?.trim()
                    }
                  }
                ]
              }
            }
          ]
        },
        include: {
          images: true,
          subCategory: {
            include: {
              images: true,
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
      if (!product) {
        throw new Error(`Stock with ID ${input.query} not found.`);
      }
      return product;
    }),

  getOne: publicProcedure
    .input(
      z.object({
        query: z.string(),
        hasCategory: z.boolean().default(false).optional(),
        hasCategoryChild: z.boolean().default(false).optional(),
        hasReview: z.boolean().default(false).optional(),
        hasUser: z.boolean().default(false).optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, hasCategory, hasCategoryChild, hasReview, hasUser }: any = input;

      const product = await ctx.db.product.findFirst({
        where: {
          OR: [{ id: { equals: query } }, { tag: { equals: query?.trim() } }]
        },
        include: {
          images: true,
          subCategory: {
            include: {
              images: true,
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
                              images: true
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
        hasReview: z.boolean().default(false).optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { hasCategory, hasCategoryChild, hasReview }: any = input;
      const product = await ctx.db.product.findMany({
        include: {
          images: true,
          subCategory: {
            include: {
              images: true,
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
    })
});
