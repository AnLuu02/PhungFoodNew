import { del, put } from '@vercel/blob';
import { z } from 'zod';
import { CreateTagVi } from '~/lib/FuncHandler/CreateTag-vi';
import { getFileNameFromVercelBlob, tokenBlobVercel } from '~/lib/FuncHandler/handle-file-base64';
import { LocalEntityType, LocalImageType } from '~/lib/ZodSchema/enum';

import { createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import { ResponseTRPC } from '~/types/ResponseFetcher';

export const subCategoryRouter = createTRPCRouter({
  find: publicProcedure
    .input(
      z.object({
        skip: z.number().nonnegative(),
        take: z.number().positive(),
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const { skip, take, s } = input;
      const startPageItem = skip > 0 ? (skip - 1) * take : 0;
      const [totalSubCategory, totalSubCategoryQuery, subCategories] = await ctx.db.$transaction([
        ctx.db.subCategory.count(),
        ctx.db.subCategory.count({
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
        ctx.db.subCategory.findMany({
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
    }),
  create: publicProcedure
    .use(requirePermission('create:subCategory'))
    .input(
      z.object({
        name: z.string().min(1, 'Tên danh mục không được để trống'),
        isActive: z.boolean().default(true),
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
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const existed = await ctx.db.subCategory.findFirst({
        where: {
          AND: [{ name: input.name }, { categoryId: input.categoryId }]
        },
        include: { image: true, category: true }
      });

      if (existed) {
        return {
          code: 'CONFLICT',
          message: 'Danh mục đã tồn tại. Hãy thử lại.',
          data: existed
        };
      }

      let imgURL: string | undefined;

      if (input?.thumbnail && input.thumbnail.fileName !== '') {
        const buffer = Buffer.from(input.thumbnail.base64, 'base64');
        const blob = await put(input.thumbnail.fileName, buffer, { access: 'public', token: tokenBlobVercel });
        imgURL = blob.url;
      }

      const subCategory = await ctx.db.subCategory.create({
        data: {
          name: input.name,
          isActive: input.isActive,
          tag: input.tag,
          description: input.description,
          categoryId: input.categoryId,
          image: imgURL
            ? {
                create: {
                  entityType: LocalEntityType.CATEGORY,
                  altText: `Ảnh ${input.name}`,
                  url: imgURL,
                  type: LocalImageType.THUMBNAIL
                } as any
              }
            : undefined
        }
      });
      if (subCategory?.tag) {
        await CreateTagVi({ old: [], new: subCategory });
      }

      return {
        code: 'OK',
        message: 'Tạo danh mục thành công.',
        data: subCategory
      };
    }),
  update: publicProcedure
    .use(requirePermission('update:subCategory'))
    .input(
      z.object({
        id: z.string(),
        isActive: z.boolean().default(true),
        name: z.string().min(1, 'Tên danh mục không được để trống'),
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
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const existed = await ctx.db.subCategory.findFirst({
        where: {
          AND: [{ id: input.id }, { categoryId: input.categoryId }]
        },
        include: { category: true, image: true }
      });

      let imgURL: string | undefined;
      const oldImage = existed?.image;

      if (input?.thumbnail?.fileName) {
        const filenameImgFromDb = oldImage ? getFileNameFromVercelBlob(oldImage?.url) : null;

        if (!filenameImgFromDb || filenameImgFromDb !== input.thumbnail.fileName) {
          if (oldImage && oldImage?.url) await del(oldImage.url, { token: tokenBlobVercel });
          const buffer = Buffer.from(input.thumbnail.base64, 'base64');
          const blob = await put(input.thumbnail.fileName, buffer, { access: 'public', token: tokenBlobVercel });
          imgURL = blob.url;
        } else {
          imgURL = oldImage?.url;
        }
      }

      if (!existed || existed.id === input.id) {
        const [subCategory, updateSubCategory] = await ctx.db.$transaction([
          ctx.db.subCategory.findUnique({
            where: { id: input.id }
          }),
          ctx.db.subCategory.update({
            where: { id: input.id },
            data: {
              name: input.name,
              isActive: input.isActive,
              tag: input.tag,
              description: input.description,
              categoryId: input.categoryId,
              image: imgURL
                ? {
                    upsert: {
                      where: oldImage && oldImage.id ? { id: oldImage.id } : { id: 'unknown' },
                      update: {
                        entityType: LocalEntityType.CATEGORY,
                        altText: `Ảnh ${input.name}`,
                        url: imgURL,
                        type: LocalImageType.THUMBNAIL
                      } as any,
                      create: {
                        entityType: LocalEntityType.CATEGORY,
                        altText: `Ảnh ${input.name}`,
                        url: imgURL,
                        type: LocalImageType.THUMBNAIL
                      } as any
                    }
                  }
                : undefined
            }
          })
        ]);

        if (subCategory?.tag && updateSubCategory?.tag) {
          await CreateTagVi({ old: subCategory, new: updateSubCategory });
        }
        return {
          code: 'OK',
          message: 'Cập nhật danh mục thành công.',
          data: subCategory
        };
      }

      return {
        code: 'CONFLICT',
        message: 'Danh mục đã tồn tại. Hãy thử lại.',
        data: existed
      };
    }),
  delete: publicProcedure
    .use(requirePermission('delete:subCategory'))

    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      const subCategory = await ctx.db.subCategory.findUnique({
        where: { id: input.id },
        include: { image: true }
      });

      if (!subCategory) {
        throw new Error('SubCategory không tồn tại.');
      }

      subCategory?.image?.url && (await del(subCategory?.image?.url, { token: tokenBlobVercel }));

      const deletedSubCategory = await ctx.db.subCategory.delete({ where: { id: input.id } });

      return {
        code: 'OK',
        message: 'Đã xóa SubCategory và ảnh liên quan.',
        data: deletedSubCategory
      };
    }),

  getFilter: publicProcedure
    .input(
      z.object({
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const subCategory = await ctx.db.subCategory.findMany({
        where: {
          OR: [{ id: { contains: input.s, mode: 'insensitive' } }]
        }
      });

      return subCategory;
    }),
  getOne: publicProcedure
    .input(
      z.object({
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const subCategory = await ctx.db.subCategory.findFirst({
        where: {
          OR: [
            { id: input.s?.trim() },
            {
              tag: input.s?.trim()
            },
            {
              category: {
                OR: [
                  {
                    tag: input.s?.trim()
                  },
                  {
                    name: input.s?.trim()
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
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.subCategory.findMany({
      include: {
        image: true,
        category: true
      }
    });
  })
});
