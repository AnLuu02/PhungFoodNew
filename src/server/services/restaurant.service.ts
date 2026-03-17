import { EntityType, ImageType, PrismaClient } from '@prisma/client';
import { del, put } from '@vercel/blob';
import { redis } from '~/lib/CacheConfig/redis';
import { withRedisCache } from '~/lib/CacheConfig/withRedisCache';
import { getFileNameFromVercelBlob, tokenBlobVercel } from '~/lib/FuncHandler/handle-file-base64';
import { NotifyError } from '~/lib/FuncHandler/toast';
import { BannerReq, OpeningHourInput, RestaurantReq, SocialInput, ThemeInput } from '~/shared/schema/restaurant.schema';

export const getOneActiveService = async (db: PrismaClient) => {
  return await withRedisCache(
    'getOneActive',
    async () => {
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
    },
    60 * 60 * 24
  );
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

  return { code: 'OK', message: 'Cập nhật nhà hàng thành công.', data: res };
};

export const updateRestaurantService = async (db: PrismaClient, input: RestaurantReq) => {
  const existed = await db.restaurant.findFirst({
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
};

export const changeThemeService = async (db: PrismaClient, input: ThemeInput & { restaurantId: string }) => {
  try {
    const [, theme] = await Promise.all([
      redis.del('theme-default'),
      redis.del('getOneActive'),
      redis.del('get-one-active-client'),
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
};
export const getThemeService = async (db: PrismaClient) => {
  return await db.theme.findFirst({});
};

export const getAllBannerService = async (db: PrismaClient, input: any) => {
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
      }
    }
  });

  return {
    code: 'OK',
    message: 'Tạo banner thành công.',
    data: banner
  };
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
          type: ImageType.BANNER,
          altText: `Ảnh ${item.fileName} loại ${ImageType.BANNER}`,
          entityType: EntityType.RESTAURANT
        };
      } catch {
        NotifyError('Có lỗi xảy ra khi tải ảnh lên Vercel Blob');
        return null;
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
      }
    },
    include: { images: true }
  });

  return {
    code: 'OK',
    message: 'Cập nhật banner thành công.',
    data: updated
  };
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
};
export const deleteBannerService = async (db: PrismaClient, input: { id: string; otherId?: string }) => {
  try {
    let result;
    result = await db.banner.delete({
      where: { id: input.id }
    });
    if (input.otherId) {
      result = await db.banner.update({
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
};
export const createSocialService = async (db: PrismaClient, input: SocialInput) => {
  try {
    const [, , social] = await Promise.all([
      redis.del('getOneActive'),
      redis.del('get-one-active-client'),
      db.social.create({
        data: input
      })
    ]);

    return {
      code: 'OK',
      message: 'Tạo liên kết xã hội thành công.',
      data: social
    };
  } catch (err: any) {
    console.error('❌ createSocial error:', err);

    if (err.code === 'P2002') {
      return { code: 'CONFLICT', message: 'Liên kết đã tồn tại.', data: null };
    }

    return { code: 'ERROR', message: 'Không thể tạo liên kết xã hội.', data: null };
  }
};

export const updateSocialService = async (db: PrismaClient, input: { data: SocialInput; id: string }) => {
  try {
    const { data, id } = input;

    const oldSocial = await db.social.findUnique({ where: { id } });

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
      db.social.update({
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
};

export const deleteSocialService = async (db: PrismaClient, input: SocialInput) => {
  try {
    if (['messenger', 'zalo', 'phone', 'email'].includes(input.platform)) {
      return {
        code: 'ERROR',
        message: 'Đây là liên kết tiêu chuẩn. Không thể xóa liên kết xã hội này.',
        data: null
      };
    }

    await Promise.all([
      await db.social.delete({
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
  await Promise.all([redis.del('getOneActive'), redis.del('get-one-active-client')]);
  return { code: 'OK', message: 'Cập nhật thành công.', data: updated };
};
