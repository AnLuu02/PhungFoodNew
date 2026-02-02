import { del, put } from '@vercel/blob';
import { z } from 'zod';
import { UserRole } from '~/constants';
import { CreateTagVi } from '~/lib/FuncHandler/CreateTag-vi';
import { getFileNameFromVercelBlob, tokenBlobVercel } from '~/lib/FuncHandler/handle-file-base64';
import { LocalEntityType, LocalImageType } from '~/lib/ZodSchema/enum';

import { buildSortFilter } from '~/lib/FuncHandler/PrismaHelper';
import { NotifyError } from '~/lib/FuncHandler/toast';
import { imageReqSchema, productSchema } from '~/lib/ZodSchema/schema';
import { createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import { ResponseTRPC } from '~/types/ResponseFetcher';
import { createCaller } from '../root';

type FilterOptions = {
  s?: string;
  filter?: string;
  discount?: boolean;
  bestSaler?: boolean;
  newProduct?: boolean;
  hotProduct?: boolean;
  price?: { min?: number; max?: number };
  rating?: number;
  'nguyen-lieu'?: string[];
  'danh-muc'?: string;
  'loai-san-pham'?: string;
};

const buildFilter = (input: FilterOptions, userRole: any) => {
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

export const productRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string().optional(),
        filter: z.string().optional(),
        sort: z.array(z.string()).optional(),
        'nguyen-lieu': z.array(z.string()).optional(),
        discount: z.boolean().optional(),
        bestSaler: z.boolean().optional(),
        newProduct: z.boolean().optional(),
        rating: z.number().optional(),
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
      const [totalProducts, totalProductsQuery, products] = await ctx.db.$transaction([
        ctx.db.product.count(),
        ctx.db.product.count({
          where: {
            AND: filterParams.length > 0 ? filterParams : undefined
          } as any
        }),
        ctx.db.product.findMany({
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
            reviews: true,
            favouriteFoods: true
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
            : totalProductsQuery / take
          : totalProducts / take
      );

      const currentPage = skip ? Math.floor(skip / take + 1) : 1;
      console.log('___totalProductsQuery', totalProductsQuery);

      return {
        products,
        pagination: {
          currentPage,
          totalPages,
          totalProducts: totalProductsQuery
        }
      };
    }),
  create: publicProcedure
    .use(requirePermission('create:product'))
    .input(productSchema.extend({ thumbnail: imageReqSchema.optional(), gallery: z.array(imageReqSchema).default([]) }))
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const existed = await ctx.db.product.findFirst({
        where: { tag: input.tag }
      });

      if (existed) {
        return {
          code: 'CONFLICT',
          message: 'Sản phẩm đã tồn tại. Hãy thử lại.',
          data: existed
        };
      }

      let thumbnailURL: string | null = null;
      if (input.thumbnail && input.thumbnail.fileName !== '') {
        const buffer = Buffer.from(input.thumbnail.base64, 'base64');
        const blob = await put(input.thumbnail.fileName, buffer, { access: 'public', token: tokenBlobVercel });
        thumbnailURL = blob.url;
      }

      const galleryURLs = await Promise.all(
        (input.gallery ?? []).map(async item => {
          const buffer = Buffer.from(item.base64, 'base64');
          const blob = await put(item.fileName, buffer, { access: 'public', token: tokenBlobVercel });
          const uploadedUrl = blob.url;
          return uploadedUrl ? { url: uploadedUrl, type: LocalImageType.GALLERY } : null;
        })
      ).then(results => results.filter(item => item !== null));

      const product = await ctx.db.product.create({
        data: {
          ...input,
          materials: input.materials ? { connect: input.materials.map(item => ({ id: item })) } : undefined,
          images: {
            create: [
              ...(thumbnailURL
                ? [
                    {
                      url: thumbnailURL,
                      type: LocalImageType.THUMBNAIL,
                      entityType: LocalEntityType.PRODUCT,
                      altText: `Ảnh ${input?.thumbnail?.fileName} loại ${LocalImageType.THUMBNAIL}`
                    }
                  ]
                : []),
              ...galleryURLs.map(item => ({
                url: item.url,
                type: item.type,
                entityType: LocalEntityType.PRODUCT,
                altText: `Ảnh ${item?.url} loại ${LocalImageType.GALLERY}`
              }))
            ]
          }
        }
      });

      if (product?.tag) {
        await CreateTagVi({ old: [], new: product });
      }

      return {
        code: 'OK',
        message: 'Tạo sản phẩm thành công.',
        data: product
      };
    }),

  update: publicProcedure
    .use(requirePermission('update:product'))
    .input(
      productSchema.extend({
        id: z.string(),
        thumbnail: imageReqSchema.optional(),
        gallery: z.array(imageReqSchema).optional()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const existingProduct = await ctx.db.product.findUnique({
        where: { id: input.id },
        include: { images: true }
      });

      if (!existingProduct) {
        return {
          code: 'NOT_FOUND',
          message: 'Sản phẩm không tồn tại.',
          data: null
        };
      }

      const duplicateProduct = await ctx.db.product.findFirst({
        where: { tag: input.tag, id: { not: input.id } }
      });

      if (duplicateProduct) {
        return {
          code: 'CONFLICT',
          message: 'Sản phẩm đã tồn tại.',
          data: duplicateProduct
        };
      }

      const oldImages = existingProduct.images || [];
      const oldThumbnail = oldImages.find(img => img?.type === LocalImageType.THUMBNAIL);
      const oldGallery = oldImages.filter(img => img?.type === LocalImageType.GALLERY);

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
            type: LocalImageType.THUMBNAIL,
            altText: `Ảnh ${input.thumbnail.fileName} loại ${LocalImageType.THUMBNAIL}`,
            entityType: LocalEntityType.PRODUCT
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
              type: LocalImageType.GALLERY,
              altText: `Ảnh ${item.fileName} loại ${LocalImageType.GALLERY}`,
              entityType: LocalEntityType.PRODUCT
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

      const [product, updatedProduct] = await ctx.db.$transaction([
        ctx.db.product.findUnique({ where: { id: input.id } }),
        ctx.db.product.update({
          where: {
            id: input.id
          },
          data: {
            ...input,
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
        code: 'OK',
        message: 'Cập nhật sản phẩm thành công.',
        data: updatedProduct
      };
    }),

  delete: publicProcedure
    .use(requirePermission('delete:product'))
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
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
        code: 'OK',
        message: 'Xóa sản phẩm thành công.',
        data: productDeleted
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
      const search = s?.trim();
      const product = await ctx.db.product.findMany({
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
          reviews: hasReview ? true : false,
          favouriteFoods: true
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
      return await ctx.db.product.findFirst({
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
          reviews: {
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
          favouriteFoods: true
        }
      });
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
          reviews: hasReview ? true : undefined,
          favouriteFoods: true
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
  }),
  getProductBestSalerByQuarter: publicProcedure
    .input(
      z.object({
        query: z.enum(['all', 'week', 'month', 'year']).default('week')
      })
    )
    .query(async ({ ctx, input }) => {
      const { query }: any = input;
      const caller = createCaller(ctx);

      const orders: any = await caller.Order.getAll();

      let products;
      switch (query) {
        case 'all':
          products = [];
          break;
        case 'week':
          products = orders.filter((order: any) => order.updatedAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
          break;
        case 'month':
          products = orders.filter((order: any) => order.updatedAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
          break;
        case 'year':
          products = orders.filter((order: any) => order.updatedAt > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000));
          break;
        default:
          products = orders;
      }

      return products;
    })
});
