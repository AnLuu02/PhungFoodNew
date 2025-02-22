import { EntityType } from '.prisma/client';
import { ImageType } from '@prisma/client';
import { z } from 'zod';
import {
  deleteImageFromFirebase,
  getFileNameFromFirebaseFile,
  uploadToFirebase
} from '~/app/lib/utils/func-handler/handle-file-upload';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const subCategoryRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        query: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, query } = input;
      const startPageItem = skip > 0 ? (skip - 1) * take : 0;
      const [totalSubCategory, totalSubCategoryQuery, subCategories] = await ctx.db.$transaction([
        ctx.db.subCategory.count(),
        ctx.db.subCategory.count({
          where: {
            OR: [
              {
                name: { contains: query?.trim(), mode: 'insensitive' }
              },
              {
                tag: { contains: query?.trim(), mode: 'insensitive' }
              },
              {
                description: { contains: query?.trim(), mode: 'insensitive' }
              },
              {
                category: {
                  tag: { contains: query?.trim(), mode: 'insensitive' }
                }
              }
            ]
          }
        }),
        ctx.db.subCategory.findMany({
          skip: startPageItem,
          take,
          where: {
            OR: [
              {
                name: { contains: query?.trim(), mode: 'insensitive' }
              },
              {
                tag: { contains: query?.trim(), mode: 'insensitive' }
              },
              {
                description: { contains: query?.trim(), mode: 'insensitive' }
              },
              {
                category: {
                  tag: { contains: query?.trim(), mode: 'insensitive' }
                }
              }
            ]
          },
          include: {
            category: true,
            images: true,
            product: {
              include: {
                favouriteFood: true
              }
            }
          }
        })
      ]);
      const totalPages = Math.ceil(
        query?.trim() ? (totalSubCategoryQuery == 0 ? 1 : totalSubCategoryQuery / take) : totalSubCategory / take
      );
      const currentPage = skip ? Math.floor(skip / take + 1) : 1;

      return {
        subCategories,
        pagination: {
          currentPage,
          totalPages
        }
      };
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Name is required'),
        description: z.string().optional(),
        tag: z.string(),
        categoryId: z.string(),
        thumbnail: z
          .object({
            fileName: z.string(),
            base64: z.string()
          })
          .optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.subCategory.findFirst({
        where: {
          AND: [{ name: input.name }, { categoryId: input.categoryId }]
        },
        include: { images: true, category: true }
      });

      if (existed) {
        return {
          success: false,
          message: 'Danh mục đã tồn tại. Hãy thử lại.',
          record: existed
        };
      }

      let imgURL: string | undefined;

      if (input?.thumbnail && input.thumbnail.fileName !== '') {
        imgURL = await uploadToFirebase(input.thumbnail.fileName, input.thumbnail.base64);
      }

      const subCategory = await ctx.db.subCategory.create({
        data: {
          name: input.name,
          tag: input.tag,
          description: input.description,
          categoryId: input.categoryId,
          images: imgURL
            ? {
                create: {
                  entityType: EntityType.CATEGORY,
                  altText: `Ảnh ${input.name}`,
                  url: imgURL,
                  type: ImageType.THUMBNAIL
                }
              }
            : undefined
        }
      });

      return {
        success: true,
        message: 'Tạo danh mục thành công.',
        record: subCategory
      };
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, 'Name is required'),
        description: z.string().optional(),
        tag: z.string(),
        categoryId: z.string(),
        thumbnail: z
          .object({
            fileName: z.string(),
            base64: z.string()
          })
          .optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.subCategory.findFirst({
        where: {
          AND: [{ id: input.id }, { categoryId: input.categoryId }]
        },
        include: { category: true, images: true }
      });

      let imgURL: string | undefined;
      const oldImage = existed?.images?.[0];

      if (input?.thumbnail?.fileName) {
        const filenameImgFromDb = oldImage ? getFileNameFromFirebaseFile(oldImage?.url) : null;

        if (!filenameImgFromDb || filenameImgFromDb !== input.thumbnail.fileName) {
          if (oldImage && oldImage?.url) await deleteImageFromFirebase(oldImage?.url);
          imgURL = await uploadToFirebase(input.thumbnail.fileName, input.thumbnail.base64);
        } else {
          imgURL = oldImage?.url;
        }
      }

      if (!existed || existed.id === input.id) {
        const subCategory = await ctx.db.subCategory.update({
          where: { id: input.id },
          data: {
            name: input.name,
            tag: input.tag,
            description: input.description,
            categoryId: input.categoryId,
            images: imgURL
              ? {
                  upsert: {
                    where: oldImage && oldImage.id ? { id: oldImage.id } : { id: 'unknown' },
                    update: {
                      entityType: EntityType.CATEGORY,
                      altText: `Ảnh ${input.name}`,
                      url: imgURL,
                      type: ImageType.THUMBNAIL
                    },
                    create: {
                      entityType: EntityType.CATEGORY,
                      altText: `Ảnh ${input.name}`,
                      url: imgURL,
                      type: ImageType.THUMBNAIL
                    }
                  }
                }
              : undefined
          }
        });

        return {
          success: true,
          message: 'Cập nhật danh mục thành công.',
          record: subCategory
        };
      }

      return {
        success: false,
        message: 'Danh mục đã tồn tại. Hãy thử lại.',
        record: existed
      };
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const subCategory = await ctx.db.subCategory.findUnique({
        where: { id: input.id },
        include: { images: true }
      });

      if (!subCategory) {
        throw new Error('SubCategory không tồn tại.');
      }

      subCategory?.images?.[0]?.url && (await deleteImageFromFirebase(subCategory?.images?.[0]?.url));
      // if (subCategory.images.length > 0) {
      //   await Promise.all(subCategory.images.map(image => deleteImageFromFirebase(image.url)));
      // }
      const deletedSubCategory = await ctx.db.subCategory.delete({ where: { id: input.id } });

      if (!subCategory) {
        throw new Error(`Stock with ID ${input.id} not found.`);
      }

      return {
        success: true,
        message: 'Đã xóa SubCategory và ảnh liên quan.',
        record: deletedSubCategory
      };
    }),

  getFilter: publicProcedure
    .input(
      z.object({
        query: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const subCategory = await ctx.db.subCategory.findMany({
        where: {
          OR: [
            { id: { contains: input.query, mode: 'insensitive' } }
            // { name: { contains: input.query, mode: 'insensitive' } }
          ]
        }
      });
      if (!subCategory) {
        throw new Error(`Stock with ID ${input.query} not found.`);
      }
      return subCategory;
    }),
  getOne: publicProcedure
    .input(
      z.object({
        query: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const subCategory = await ctx.db.subCategory.findFirst({
        where: {
          OR: [
            { id: input.query?.trim() },
            {
              tag: input.query?.trim()
            },
            {
              category: {
                OR: [
                  {
                    tag: input.query?.trim()
                  },
                  {
                    name: input.query?.trim()
                  }
                ]
              }
            }
          ]
        },
        include: {
          category: true,
          images: true
        }
      });
      if (!subCategory) {
        throw new Error(`Stock with ID ${input.query} not found.`);
      }
      return subCategory;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const subCategory = await ctx.db.subCategory.findMany({
      include: {
        images: true,
        category: true
      }
    });
    return subCategory;
  })
});
