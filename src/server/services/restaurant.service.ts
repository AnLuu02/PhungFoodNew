import { EntityType, ImageType, PrismaClient } from '@prisma/client';
import { delCache } from '~/lib/CacheConfig/withRedisCache';
import { ImageFromDb, StatusImage } from '~/shared/schema/image.schema';
import { RestaurantReqCloudinary } from '~/shared/schema/restaurant.schema';

export const getOneActiveService = async (db: PrismaClient) => {
  const result = await db.restaurant.findFirst({
    where: { isActive: true },
    include: {
      logo: true,
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
        logo: true,
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
      logo: true,
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

export const upsertRestaurantService = async (db: PrismaClient, input: RestaurantReqCloudinary) => {
  const { id, theme, socials, logo, openingHours, ...data } = input;
  let logoFromDb: ImageFromDb | null = null;
  if (logo && logo?.status) {
    const { status, ...data } = logo;
    logoFromDb = data;
  }
  const updatedRestaurant = await db.restaurant.upsert({
    where: { id: input.id || 'default_upsert_id' },
    create: {
      ...data,
      logo:
        logoFromDb && logo?.status === StatusImage.NEW
          ? {
              create: {
                ...logoFromDb,
                url: logoFromDb?.url || '',
                altText: logoFromDb?.altText || 'Logo nha hang',
                type: ImageType.LOGO,
                entityType: EntityType.RESTAURANT
              }
            }
          : undefined,
      theme: theme
        ? {
            create: {
              ...theme
            }
          }
        : undefined,
      socials: socials
        ? {
            createMany: {
              data: socials
            }
          }
        : undefined,
      openingHours: openingHours
        ? {
            createMany: {
              data: openingHours
            }
          }
        : undefined
    },
    update: {
      ...data,
      logo: {
        ...(logoFromDb && logo?.status === StatusImage.NEW
          ? {
              create: {
                ...logoFromDb,
                url: logoFromDb?.url || '',
                altText: logoFromDb?.altText || 'Logo nha hang',
                type: ImageType.LOGO,
                entityType: EntityType.RESTAURANT
              }
            }
          : undefined),
        disconnect: logo?.status === StatusImage.DELETED ? { publicId: logo?.publicId } : undefined
      },
      theme: theme
        ? {
            upsert: {
              where: {
                id: theme?.id || 'default_theme_id'
              },
              create: theme,
              update: theme
            }
          }
        : undefined,
      socials: socials
        ? {
            upsert: socials?.map((item, index) => ({
              where: {
                id: item?.id || `default_id_social_${index}`
              },
              create: item,
              update: item
            }))
          }
        : undefined,
      openingHours: openingHours
        ? {
            upsert: openingHours?.map((item, index) => ({
              where: {
                id: item?.id || `default_id_social_${index}`
              },
              create: item,
              update: item
            }))
          }
        : undefined
    }
  });
  await Promise.all([delCache('theme-default'), delCache('getOneActive'), delCache('get-one-active-client')]);
  return updatedRestaurant;
};
