import { EntityType, ImageType } from '@prisma/client';
import { del, put } from '@vercel/blob';
import { z } from 'zod';
import { getFileNameFromVercelBlob, tokenBlobVercel } from '~/app/lib/utils/func-handler/handle-file-upload';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const restaurantRouter = createTRPCRouter({
  getOne: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.restaurant.findFirst({ include: { logo: true, socials: true } });
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Tên là bắt buộc'),
        description: z.string().optional(),
        logo: z
          .object({
            fileName: z.string(),
            base64: z.string()
          })
          .optional(),
        address: z.string().min(1, 'Địa chỉ là bắt buộc'),
        phone: z.string().min(1, 'Phải có ít nhất một số điện thoại'),
        website: z.string().optional(),
        socials: z.array(
          z.object({
            key: z.string(),
            url: z.string()
          })
        ),
        email: z.string().email().optional(),
        isClose: z.boolean().optional(),
        openedHours: z.string().optional(),
        closedHours: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      let imgURL: string | undefined;

      if (input?.logo?.fileName) {
        const buffer = Buffer.from(input.logo.base64, 'base64');
        const blob = await put(input.logo.fileName, buffer, { access: 'public', token: tokenBlobVercel });
        imgURL = blob.url;
      }

      const res = await ctx.db.restaurant.create({
        data: {
          ...input,
          socials: {
            createMany: { data: input.socials }
          },
          email: input.email ?? '',
          isClose: input.isClose ?? false,
          logo: imgURL
            ? {
                create: {
                  entityType: EntityType.RESTAURANT,
                  altText: `Ảnh ${input.name}`,
                  url: imgURL,
                  type: ImageType.LOGO
                } as any
              }
            : undefined
        }
      });

      return { success: true, message: 'Cập nhật nhà hàng thành công.', record: res };
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1, 'Tên là bắt buộc'),
        description: z.string().optional(),
        logo: z
          .object({
            fileName: z.string(),
            base64: z.string()
          })
          .optional(),
        address: z.string().min(1, 'Địa chỉ là bắt buộc'),
        phone: z.string().min(1, 'Phải có ít nhất một số điện thoại'),
        website: z.string().optional(),
        socials: z.array(
          z.object({
            key: z.string(),
            url: z.string()
          })
        ),
        email: z.string().email().optional(),
        isClose: z.boolean().optional(),
        openedHours: z.string().optional(),
        closedHours: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.restaurant.findFirst({
        where: {
          id: input.id
        },
        include: { logo: true }
      });
      let imgURL: string | undefined;
      const oldImage = existed?.logo;

      if (input?.logo?.fileName) {
        const filenameImgFromDb = oldImage ? getFileNameFromVercelBlob(oldImage?.url) : null;

        if (!filenameImgFromDb || filenameImgFromDb !== input.logo.fileName) {
          if (oldImage && oldImage?.url) await del(oldImage.url, { token: tokenBlobVercel });
          const buffer = Buffer.from(input.logo.base64, 'base64');
          const blob = await put(input.logo.fileName, buffer, { access: 'public', token: tokenBlobVercel });
          imgURL = blob.url;
        } else {
          imgURL = oldImage?.url;
        }
      }

      if (!existed || existed.id === input.id) {
        const updatedRestaurant = await ctx.db.restaurant.update({
          where: { id: input.id },
          data: {
            ...input,
            socials: {
              upsert: input.socials.map(social => ({
                where: { key: social.key },
                update: social,
                create: social
              }))
            },
            logo: imgURL
              ? {
                  upsert: {
                    where: oldImage && oldImage.id ? { id: oldImage.id } : { id: 'unknown' },
                    update: {
                      entityType: EntityType.RESTAURANT,
                      altText: `Ảnh ${input.name}`,
                      url: imgURL,
                      type: ImageType.LOGO
                    } as any,
                    create: {
                      entityType: EntityType.RESTAURANT,
                      altText: `Ảnh ${input.name}`,
                      url: imgURL,
                      type: ImageType.LOGO
                    } as any
                  }
                }
              : undefined
          }
        });

        return { success: true, message: 'Cập nhật nhà hàng thành công.', record: updatedRestaurant };
      }
    }),
  getOneBanner: publicProcedure
    .input(
      z.object({
        isActive: z.boolean().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.banner.findFirst({
        where: input.isActive ? { isActive: input.isActive } : undefined,
        include: { images: true }
      });
    }),
  createBanner: publicProcedure
    .input(
      z.object({
        isActive: z.boolean().default(true),
        banner: z
          .array(
            z.object({
              fileName: z.string(),
              base64: z.string()
            })
          )
          .optional(),
        gallery: z
          .array(
            z.object({
              fileName: z.string(),
              base64: z.string()
            })
          )
          .optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      let bannerURLs: any;
      let galleryURLs: any;

      if (input.banner && input.banner.length > 0) {
        bannerURLs = await Promise.all(
          (input.banner ?? []).map(async item => {
            const buffer = Buffer.from(item.base64, 'base64');
            const blob = await put(item.fileName, buffer, { access: 'public', token: tokenBlobVercel });
            const uploadedUrl = blob.url;
            return uploadedUrl ? { url: uploadedUrl, type: ImageType.BANNER } : null;
          })
        ).then(results => results.filter(item => item !== null));
      }

      if (input.gallery && input.gallery.length > 0) {
        galleryURLs = await Promise.all(
          (input.gallery ?? []).map(async item => {
            const buffer = Buffer.from(item.base64, 'base64');
            const blob = await put(item.fileName, buffer, { access: 'public', token: tokenBlobVercel });
            const uploadedUrl = blob.url;
            return uploadedUrl ? { url: uploadedUrl, type: ImageType.GALLERY } : null;
          })
        ).then(results => results.filter(item => item !== null));
      }
      const banner = await ctx.db.banner.create({
        data: {
          isActive: input.isActive,
          startDate: input.startDate,
          endDate: input.endDate,
          images: {
            create: [
              ...bannerURLs.map((item: any) => ({
                url: item.url,
                type: item.type,
                entityType: EntityType.RESTAURANT,
                altText: `Ảnh ${item?.url} loại ${ImageType.BANNER}`
              })),
              ...galleryURLs.map((item: any) => ({
                url: item.url,
                type: item.type,
                entityType: EntityType.RESTAURANT,
                altText: `Ảnh ${item?.url} loại ${ImageType.GALLERY}`
              }))
            ]
          }
        }
      });

      return {
        success: true,
        message: 'Tạo banner thành công.',
        record: banner
      };
    }),
  updateBanner: publicProcedure
    .input(
      z.object({
        id: z.string(),
        banner: z
          .array(
            z.object({
              fileName: z.string(),
              base64: z.string()
            })
          )
          .optional(),
        gallery: z
          .array(
            z.object({
              fileName: z.string(),
              base64: z.string()
            })
          )
          .optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        isActive: z.boolean()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingBanner = await ctx.db.banner.findUnique({
        where: { id: input.id },
        include: { images: true }
      });

      const oldImages = existingBanner?.images || [];

      const results = await Promise.all([
        ...oldImages.map(img => del(img.url, { token: tokenBlobVercel })),
        ...(input.gallery ?? []).map(async item => {
          try {
            const buffer = Buffer.from(item.base64, 'base64');
            const blob = await put(item.fileName, buffer, { access: 'public', token: tokenBlobVercel });
            const uploadedImage = blob.url;
            return {
              url: uploadedImage,
              type: ImageType.GALLERY,
              altText: `Ảnh ${item.fileName} loại ${ImageType.GALLERY}`,
              entityType: EntityType.RESTAURANT
            };
          } catch (error) {
            console.error('Failed to upload image:', item.fileName, error);
            return null;
          }
        }),
        ...(input.banner ?? []).map(async item => {
          try {
            const buffer = Buffer.from(item.base64, 'base64');
            const blob = await put(item.fileName, buffer, { access: 'public', token: tokenBlobVercel });
            const uploadedImage = blob.url;
            return {
              url: uploadedImage,
              type: ImageType.BANNER,
              altText: `Ảnh ${item.fileName} loại ${ImageType.BANNER}`,
              entityType: EntityType.RESTAURANT
            };
          } catch (error) {
            console.error('Failed to upload image:', item.fileName, error);
            return null;
          }
        })
      ]);

      const newImages = results.filter(Boolean);
      const updated = await ctx.db.banner.update({
        where: {
          id: input.id
        },
        data: {
          startDate: input.startDate,
          endDate: input.endDate,
          isActive: input.isActive,
          images: {
            deleteMany: {},
            create: newImages?.map((item: any) => ({
              url: item.url,
              type: item.type,
              entityType: item.entityType,
              altText: item.altText
            }))
          }
        },
        include: { images: true }
      });

      return {
        success: true,
        message: 'Cập nhật banner thành công.',
        record: updated
      };
    })
});
