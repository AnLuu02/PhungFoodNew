import { EntityType, ImageType, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { del, put } from '@vercel/blob';
import { delCache } from '~/lib/CacheConfig/withRedisCache';
import { tokenBlobVercel } from '~/lib/FuncHandler/handle-file-base64';
import { BannerReq, OpeningHourInput, RestaurantReq, SocialInput, ThemeInput } from '~/shared/schema/restaurant.schema';
import { uploadImageToVercel } from './image.service';

export const getOneActiveService = async (db: PrismaClient) => {
  const result = await db.restaurant.findFirst({
    where: { isActive: true },
    include: {
      logo: { select: { url: true } },
      socials: {
        orderBy: {
          createdAt: 'desc'
        }
      },
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
    await db.restaurant.create({
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
    const result = await db.restaurant.findFirst({
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
};
export const getOneActiveClientService = async (db: PrismaClient) => {
  const result = await db.restaurant.findFirst({
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
};
export const createRestaurantService = async (db: PrismaClient, input: RestaurantReq) => {
  let imgURL: string | undefined;

  if (input?.logo?.fileName) {
    const buffer = Buffer.from(input.logo.base64, 'base64');
    const blob = await put(input.logo.fileName, buffer, { access: 'public', token: tokenBlobVercel });
    imgURL = blob.url;
  }

  const res = await db.restaurant.create({
    data: {
      ...input,
      theme: input?.theme
        ? {
            create: input?.theme
          }
        : undefined,
      socials: {
        createMany: { data: input.socials }
      },
      email: input.email ?? '',
      logo: imgURL
        ? {
            create: {
              entityType: EntityType.RESTAURANT,
              altText: `Ảnh ${input.name}`,
              url: imgURL,
              type: ImageType.LOGO
            } as any
          }
        : undefined,
      openingHours: input?.openingHours
        ? {
            createMany: { data: input.openingHours }
          }
        : undefined
    }
  });

  return res;
};

export const updateRestaurantService = async (db: PrismaClient, input: RestaurantReq) => {
  const existed = await db.restaurant.findFirst({
    where: {
      id: input.id
    },
    include: { logo: true }
  });
  const oldImage = existed?.logo;
  let { imgURL } = await uploadImageToVercel(oldImage, {
    fileName: input.logo?.fileName || '',
    base64: input.logo?.base64 || ''
  });
  if (!existed || existed.id === input.id) {
    const updatedRestaurant = await db.restaurant.update({
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
        theme: input?.theme
          ? {
              update: {
                where: {
                  restaurantId: input.id
                },
                data: input?.theme
              }
            }
          : undefined,
        logo: imgURL
          ? {
              upsert: {
                where: { id: existed?.logo?.id || '' },
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
          : !input.logo?.fileName && oldImage?.id
            ? {
                delete: {
                  id: oldImage?.id || ''
                }
              }
            : undefined,
        openingHours: {
          upsert: input.openingHours?.map(item => ({
            where: { id: item.id },
            create: item,
            update: item
          }))
        }
      }
    });
    await Promise.all([delCache('theme-default'), delCache('getOneActive'), delCache('get-one-active-client')]);
    return updatedRestaurant;
  } else {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Đã có lỗi xảy ra.'
    });
  }
};

export const changeThemeService = async (db: PrismaClient, input: ThemeInput & { restaurantId: string }) => {
  try {
    const [, theme] = await Promise.all([
      delCache('theme-default'),
      delCache('getOneActive'),
      delCache('get-one-active-client'),
      db.theme.upsert({
        where: { restaurantId: input.restaurantId },
        update: {
          ...input
        },
        create: {
          ...input
        }
      })
    ]);
    return theme;
  } catch {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Đã có lỗi xảy ra.'
    });
  }
};
export const getThemeService = async (db: PrismaClient) => {
  return await db.theme.findFirst({});
};

export const getAllBannerService = async (db: PrismaClient) => {
  return await db.banner.findMany({
    include: { images: true },
    orderBy: { createdAt: 'desc' }
  });
};
export const createBannerService = async (db: PrismaClient, input: BannerReq) => {
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
  const banner = await db.banner.create({
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
      },
      restaurant: {
        connect: {
          id: input.restaurantId || ''
        }
      }
    }
  });

  return banner;
};
export const getOneBannerService = async (db: PrismaClient, input: any) => {
  return await db.banner.findFirst({
    where: input.isActive ? { isActive: input.isActive } : undefined,
    include: { images: true }
  });
};
export const updateBannerService = async (db: PrismaClient, input: BannerReq) => {
  const existingBanner = await db.banner.findUnique({
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
      } catch {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Có lỗi xảy ra khi tải ảnh lên Vercel Blob'
        });
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
      } catch {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Có lỗi xảy ra khi tải ảnh lên Vercel Blob'
        });
      }
    })
  ]);

  const newImages = results.filter(Boolean);
  const updated = await db.banner.update({
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
      },
      restaurant: {
        connect: {
          id: input.restaurantId || ''
        }
      }
    },
    include: { images: true }
  });

  return updated;
};
export const setDefaultBannerService = async (db: PrismaClient, input: { id: string }) => {
  try {
    await db.banner.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });
    const banner = await db.banner.update({
      where: { id: input.id },
      data: { isActive: true }
    });
    return banner;
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Đã có lỗi xảy ra.'
    });
  }
};
export const deleteBannerService = async (db: PrismaClient, input: { id: string; otherId?: string }) => {
  try {
    let result;
    const images = await db.banner.findUnique({
      where: {
        id: input.id || ''
      },
      include: {
        images: {
          select: {
            url: true
          }
        }
      }
    });
    if (images) {
      await Promise.all(
        images.images.map(({ url }) => {
          del(url, { token: tokenBlobVercel });
        })
      );
    }
    result = await db.banner.delete({
      where: { id: input.id }
    });
    if (input.otherId) {
      result = await db.banner.update({
        where: { id: input.otherId },
        data: { isActive: true }
      });
    }
    return result;
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Đã có lỗi xảy ra.'
    });
  }
};
export const createSocialService = async (db: PrismaClient, input: SocialInput) => {
  try {
    const [, , social] = await Promise.all([
      delCache('getOneActive'),
      delCache('get-one-active-client'),
      db.social.create({
        data: input
      })
    ]);

    return social;
  } catch (err: any) {
    if (err.code === 'P2002') {
      throw new TRPCError({ code: 'CONFLICT', message: 'Liên kết đã tồn tại.' });
    }
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Không thể tạo liên kết xã hội.' });
  }
};

export const updateSocialService = async (db: PrismaClient, input: Partial<SocialInput>) => {
  try {
    const { id, ...data } = input;
    const oldSocial = await db.social.findUnique({ where: { id } });

    if (
      data.platform &&
      data.platform !== oldSocial?.platform &&
      ['messenger', 'zalo', 'phone', 'email'].includes(data.platform)
    ) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Đây là liên kết tiêu chuẩn. Không thể thay đổi liên kết xã hội này.'
      });
    }

    const [, , updated] = await Promise.all([
      delCache('getOneActive'),
      delCache('get-one-active-client'),
      db.social.update({
        where: { id },
        data
      })
    ]);

    return updated;
  } catch (err: any) {
    if (err.code === 'P2025') {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Không tìm thấy bản ghi để cập nhật.' });
    }
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Lỗi khi cập nhật liên kết xã hội.' });
  }
};

export const deleteSocialService = async (db: PrismaClient, input: { id: string; platform: string }) => {
  try {
    if (['messenger', 'zalo', 'phone', 'email'].includes(input.platform)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Đây là liên kết tiêu chuẩn. Không thể xóa liên kết xã hội này.'
      });
    }
    const [deleted] = await Promise.all([
      await db.social.delete({
        where: { id: input.id }
      }),
      delCache('getOneActive'),
      delCache('get-one-active-client')
    ]);

    return deleted;
  } catch (err: any) {
    if (err.code === 'P2025') {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Không tìm thấy bản ghi để cập nhật.' });
    }
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Lỗi khi cập nhật liên kết xã hội.' });
  }
};
//opening hour
export const updateOpeningHoursService = async (db: PrismaClient, input: { data: OpeningHourInput[] }) => {
  const { data: openingHours } = input;
  const updated = await db.$transaction(
    openingHours.map(openingHour =>
      db.openingHour.update({
        where: { id: openingHour.id },
        data: openingHour
      })
    )
  );
  await Promise.all([delCache('getOneActive'), delCache('get-one-active-client')]);
  return updated;
};
