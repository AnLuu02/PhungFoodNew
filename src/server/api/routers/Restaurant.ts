import { del, put } from '@vercel/blob';
import { z } from 'zod';
import { redis } from '~/lib/CacheConfig/redis';
import { withRedisCache } from '~/lib/CacheConfig/withRedisCache';
import { getFileNameFromVercelBlob, tokenBlobVercel } from '~/lib/FuncHandler/handle-file-base64';
import { NotifyError } from '~/lib/FuncHandler/toast';
import { LocalEntityType, LocalImageType } from '~/lib/ZodSchema/enum';
import { openingHourSchema, socialSchema } from '~/lib/ZodSchema/schema';
import { createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import { ResponseTRPC } from '~/types/ResponseFetcher';

export const restaurantRouter = createTRPCRouter({
  getOneActive: publicProcedure.query(async ({ ctx }) => {
    return await withRedisCache(
      'getOneActive',
      async () => {
        const result = await ctx.db.restaurant.findFirst({
          where: { isActive: true },
          include: {
            logo: { select: { url: true } },
            socials: true,
            theme: true,
            openingHours: true,
            banners: { include: { images: true } }
          }
        });
        if (!result) {
          const openingHoursData = [
            { dayOfWeek: '0', viNameDay: 'Chủ nhật', openTime: '08:00', closeTime: '22:00' },
            { dayOfWeek: '1', viNameDay: 'Thứ hai', openTime: '08:00', closeTime: '22:00' },
            { dayOfWeek: '2', viNameDay: 'Thứ ba', openTime: '08:00', closeTime: '22:00' },
            { dayOfWeek: '3', viNameDay: 'Thứ tư', openTime: '08:00', closeTime: '22:00' },
            { dayOfWeek: '4', viNameDay: 'Thứ năm', openTime: '08:00', closeTime: '23:00' },
            { dayOfWeek: '5', viNameDay: 'Thứ sáu', openTime: '09:00', closeTime: '23:00' },
            { dayOfWeek: '6', viNameDay: 'Thứ bảy', openTime: '09:00', closeTime: '21:00' }
          ];
          await ctx.db.restaurant.create({
            data: {
              name: 'PhungFood',
              isActive: true,
              description: 'Chuyên cung cấp các món ăn đặc sản vùng miền nói chung và miền Tây sông nước nói riêng.',
              address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
              phone: '0918064618',
              website: 'https://phung-food-new.vercel.app/',
              email: 'anluu099@gmail.com',
              theme: {
                create: {
                  primaryColor: '#008b4b',
                  secondaryColor: '#f8c144',
                  themeMode: 'light'
                }
              },
              openingHours: {
                createMany: {
                  data: openingHoursData
                }
              },
              socials: {
                createMany: {
                  data: [
                    {
                      platform: 'phone',
                      value: '0918064618',
                      label: 'Số điện thoại',
                      pattern: 'tel:{value}',
                      icon: 'icon-phone'
                    },
                    {
                      platform: 'email',
                      label: 'Email',
                      pattern: 'mailto:{value}',
                      icon: 'icon-mail',
                      value: 'anluu099@gmail.com'
                    },
                    {
                      platform: 'messenger',
                      label: 'Facebook Messenger',
                      pattern: 'https://m.me/{value}',
                      icon: 'icon-brand-messenger',
                      value: 'anluu099'
                    },
                    {
                      platform: 'zalo',
                      label: 'Zalo Chat',
                      pattern: 'https://zalo.me/{value}',
                      icon: 'icon-message-circle-2',
                      value: '0918064618'
                    }
                  ]
                }
              }
            }
          });
          const result = await ctx.db.restaurant.findFirst({
            where: { isActive: true },
            include: {
              logo: { select: { url: true } },
              socials: true,
              theme: true,
              openingHours: true,
              banners: { include: { images: true } }
            }
          });
          return result;
        }
        return result;
      },
      60 * 60 * 24
    );
  }),
  getOneActiveClient: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.restaurant.findFirst({
      where: { isActive: true },
      include: {
        logo: { select: { url: true } },
        socials: { where: { isActive: true } },
        theme: true,
        openingHours: true,
        banners: {
          where: { isActive: true },
          include: {
            images: true
          }
        }
      }
    });
    return result;
  }),
  create: publicProcedure
    .use(requirePermission(undefined, { requiredAdmin: true }))
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
        socials: z.array(socialSchema),
        email: z.string().email().optional(),
        theme: z
          .object({
            primaryColor: z.string(),
            secondaryColor: z.string(),
            themeMode: z.string().default('light'),
            fontFamily: z.string().optional(),
            borderRadius: z.string().optional(),
            faviconUrl: z.string().optional()
          })
          .optional()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      let imgURL: string | undefined;

      if (input?.logo?.fileName) {
        const buffer = Buffer.from(input.logo.base64, 'base64');
        const blob = await put(input.logo.fileName, buffer, { access: 'public', token: tokenBlobVercel });
        imgURL = blob.url;
      }

      const res = await ctx.db.restaurant.create({
        data: {
          ...input,
          theme: input?.theme && {
            create: input?.theme
          },
          socials: {
            createMany: { data: input.socials }
          },
          email: input.email ?? '',
          logo: imgURL
            ? {
                create: {
                  entityType: LocalEntityType.RESTAURANT,
                  altText: `Ảnh ${input.name}`,
                  url: imgURL,
                  type: LocalImageType.LOGO
                } as any
              }
            : undefined
        }
      });

      return { code: 'OK', message: 'Cập nhật nhà hàng thành công.', data: res };
    }),

  update: publicProcedure
    .use(requirePermission(undefined, { requiredAdmin: true }))
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
        socials: z.array(socialSchema),
        email: z.string().email().optional(),
        theme: z
          .object({
            primaryColor: z.string(),
            secondaryColor: z.string(),
            themeMode: z.string().default('light'),
            fontFamily: z.string().nullable(),
            borderRadius: z.string().nullable(),
            faviconUrl: z.string().nullable()
          })
          .optional(),
        openingHours: z
          .array(
            z.object({
              id: z.string(),
              dayOfWeek: z.string(),
              viNameDay: z.string(),
              openTime: z.string().optional(),
              closeTime: z.string().optional(),
              isClosed: z.boolean()
            })
          )
          .optional()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
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
                where: { id: social.id },
                update: social,
                create: social
              }))
            },
            theme: input?.theme && {
              update: {
                where: {
                  restaurantId: input.id
                },
                data: input?.theme
              }
            },
            logo: imgURL
              ? {
                  upsert: {
                    where: oldImage && oldImage.id ? { id: oldImage.id } : { id: 'unknown' },
                    update: {
                      entityType: LocalEntityType.RESTAURANT,
                      altText: `Ảnh ${input.name}`,
                      url: imgURL,
                      type: LocalImageType.LOGO
                    } as any,
                    create: {
                      entityType: LocalEntityType.RESTAURANT,
                      altText: `Ảnh ${input.name}`,
                      url: imgURL,
                      type: LocalImageType.LOGO
                    } as any
                  }
                }
              : undefined,
            openingHours: {
              update: input.openingHours?.map(item => ({
                where: { id: item.id },
                data: {
                  dayOfWeek: item.dayOfWeek,
                  viNameDay: item.viNameDay,
                  openTime: item.openTime,
                  closeTime: item.closeTime,
                  isClosed: item.isClosed
                }
              }))
            }
          }
        });
        await Promise.all([redis.del('theme-default'), redis.del('getOneActive'), redis.del('get-one-active-client')]);
        return { code: 'OK', message: 'Cập nhật nhà hàng thành công.', data: updatedRestaurant };
      } else {
        return {
          code: 'ERROR',
          message: 'Nhà hàng khong tìm thấy.',
          data: null
        };
      }
    }),

  changeTheme: publicProcedure
    .input(
      z.object({
        restaurantId: z.string(),
        primaryColor: z.string(),
        secondaryColor: z.string(),
        themeMode: z.string().default('light'),
        fontFamily: z.string().optional().nullable(),
        borderRadius: z.string().optional().nullable(),
        faviconUrl: z.string().optional().nullable()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      try {
        const [, theme] = await Promise.all([
          redis.del('theme-default'),
          redis.del('getOneActive'),
          redis.del('get-one-active-client'),
          ctx.db.theme.upsert({
            where: { restaurantId: input.restaurantId },
            update: {
              ...input
            },
            create: {
              ...input
            }
          })
        ]);
        return {
          code: 'OK',
          message: 'Thay đổi theme thành công.',
          data: theme
        };
      } catch {
        return {
          code: 'ERROR',
          message: 'Đã có lỗi xảy ra.',
          data: null
        };
      }
    }),
  getTheme: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.theme.findFirst({});
  }),

  getAllBanner: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.banner.findMany({
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
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      let bannerURLs: any;
      let galleryURLs: any;

      if (input.banner && input.banner.length > 0) {
        bannerURLs = await Promise.all(
          (input.banner ?? []).map(async item => {
            const buffer = Buffer.from(item.base64, 'base64');
            const blob = await put(item.fileName, buffer, { access: 'public', token: tokenBlobVercel });
            const uploadedUrl = blob.url;
            return uploadedUrl ? { url: uploadedUrl, type: LocalImageType.BANNER } : null;
          })
        ).then(results => results.filter(item => item !== null));
      }

      if (input.gallery && input.gallery.length > 0) {
        galleryURLs = await Promise.all(
          (input.gallery ?? []).map(async item => {
            const buffer = Buffer.from(item.base64, 'base64');
            const blob = await put(item.fileName, buffer, { access: 'public', token: tokenBlobVercel });
            const uploadedUrl = blob.url;
            return uploadedUrl ? { url: uploadedUrl, type: LocalImageType.GALLERY } : null;
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
                entityType: LocalEntityType.RESTAURANT,
                altText: `Ảnh ${item?.url} loại ${LocalImageType.BANNER}`
              })),
              ...galleryURLs.map((item: any) => ({
                url: item.url,
                type: item.type,
                entityType: LocalEntityType.RESTAURANT,
                altText: `Ảnh ${item?.url} loại ${LocalImageType.GALLERY}`
              }))
            ]
          }
        }
      });

      return {
        code: 'OK',
        message: 'Tạo banner thành công.',
        data: banner
      };
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
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
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
              type: LocalImageType.GALLERY,
              altText: `Ảnh ${item.fileName} loại ${LocalImageType.GALLERY}`,
              entityType: LocalEntityType.RESTAURANT
            };
          } catch {
            NotifyError('Có lỗi xảy ra khi tải ảnh lên Vercel Blob');
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
              type: LocalImageType.BANNER,
              altText: `Ảnh ${item.fileName} loại ${LocalImageType.BANNER}`,
              entityType: LocalEntityType.RESTAURANT
            };
          } catch {
            NotifyError('Có lỗi xảy ra khi tải ảnh lên Vercel Blob');
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
        code: 'OK',
        message: 'Cập nhật banner thành công.',
        data: updated
      };
    }),
  setDefaultBanner: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      try {
        await ctx.db.banner.updateMany({
          where: { isActive: true },
          data: { isActive: false }
        });
        const banner = await ctx.db.banner.update({
          where: { id: input.id },
          data: { isActive: true }
        });
        return {
          code: 'OK',
          message: 'Cập nhật banner thành công.',
          data: banner
        };
      } catch (error) {
        return {
          code: 'ERROR',
          message: 'Đã có lỗi xảy ra.',
          data: null
        };
      }
    }),
  deleteBanner: publicProcedure
    .input(
      z.object({
        id: z.string(),
        otherId: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      try {
        let result;
        result = await ctx.db.banner.delete({
          where: { id: input.id }
        });
        if (input.otherId) {
          result = await ctx.db.banner.update({
            where: { id: input.otherId },
            data: { isActive: true }
          });
        }
        return {
          code: 'OK',
          message: 'Cập nhật banner thành công.',
          data: result
        };
      } catch (error) {
        return {
          code: 'ERROR',
          message: 'Đã có lỗi xảy ra.',
          data: null
        };
      }
    }),
  createSocial: publicProcedure
    .input(socialSchema.extend({ restaurantId: z.string() }))
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      try {
        const [, , notification] = await Promise.all([
          redis.del('getOneActive'),
          redis.del('get-one-active-client'),
          ctx.db.social.create({
            data: input
          })
        ]);

        return {
          code: 'OK',
          message: 'Tạo liên kết xã hội thành công.',
          data: notification
        };
      } catch (err: any) {
        console.error('❌ createSocial error:', err);

        if (err.code === 'P2002') {
          return { code: 'CONFLICT', message: 'Liên kết đã tồn tại.', data: null };
        }

        return { code: 'ERROR', message: 'Không thể tạo liên kết xã hội.', data: null };
      }
    }),

  updateSocial: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: socialSchema.partial()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      try {
        const { data, id } = input;

        const oldSocial = await ctx.db.social.findUnique({ where: { id } });

        if (
          data.platform &&
          data.platform !== oldSocial?.platform &&
          ['messenger', 'zalo', 'phone', 'email'].includes(data.platform)
        ) {
          return {
            code: 'ERROR',
            message: 'Đây là liên kết tiêu chuẩn. Không thể thay đổi liên kết xã hội này.',
            data: null
          };
        }

        const [, , updated] = await Promise.all([
          redis.del('getOneActive'),
          redis.del('get-one-active-client'),
          ctx.db.social.update({
            where: { id },
            data
          })
        ]);

        return {
          code: 'OK',
          message: 'Cập nhật thành công.',
          data: updated
        };
      } catch (err: any) {
        console.error('❌ updateSocial error:', err);

        if (err.code === 'P2025') {
          return { code: 'NOT_FOUND', message: 'Không tìm thấy bản ghi để cập nhật.', data: null };
        }

        return { code: 'ERROR', message: 'Lỗi khi cập nhật liên kết xã hội.', data: null };
      }
    }),

  deleteSocial: publicProcedure
    .input(
      z.object({
        id: z.string(),
        platform: z.string()
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseTRPC> => {
      try {
        if (['messenger', 'zalo', 'phone', 'email'].includes(input.platform)) {
          return {
            code: 'ERROR',
            message: 'Đây là liên kết tiêu chuẩn. Không thể xóa liên kết xã hội này.',
            data: null
          };
        }

        await Promise.all([
          await ctx.db.social.delete({
            where: { id: input.id }
          }),
          redis.del('getOneActive'),
          redis.del('get-one-active-client')
        ]);

        return {
          code: 'OK',
          message: 'Xóa thành công.',
          data: null
        };
      } catch (err: any) {
        console.error('❌ deleteSocial error:', err);

        if (err.code === 'P2025') {
          return { code: 'NOT_FOUND', message: 'Không tìm thấy bản ghi để xóa.', data: null };
        }

        return { code: 'ERROR', message: 'Lỗi khi xóa liên kết xã hội.', data: null };
      }
    }),
  //opening hour
  updateOpeningHours: publicProcedure
    .input(
      z.object({
        data: z.array(openingHourSchema.partial())
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data: openingHours } = input;
      const updated = await ctx.db.$transaction(
        openingHours.map(openingHour =>
          ctx.db.openingHour.update({
            where: { id: openingHour.id },
            data: openingHour
          })
        )
      );
      await Promise.all([redis.del('getOneActive'), redis.del('get-one-active-client')]);
      return { code: 'OK', message: 'Cập nhật thành công.', data: updated };
    })
});
