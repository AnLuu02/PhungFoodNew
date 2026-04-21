import { EntityType, ImageType, PrismaClient } from '@prisma/client';
import { delCache } from '~/lib/CacheConfig/withRedisCache';
import { ImageInfoFromDb, StatusImage } from '~/shared/schema/image.info.schema';
import { RestaurantInput } from '~/shared/schema/restaurant.schema';

export const getOneActiveService = async (db: PrismaClient) => {
  const result = await db.restaurant.findFirst({
    where: { isActive: true },
    include: {
      imageForEntity: { include: { image: true } },
      socials: {
        orderBy: {
          createdAt: 'desc'
        }
      },
      theme: true,
      openingHours: true,
      banners: { include: { imageForEntities: { include: { image: true } } } }
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
        imageForEntity: {
          include: { image: true }
        },
        socials: true,
        theme: true,
        openingHours: true,
        banners: { include: { imageForEntities: { include: { image: true } } } }
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
      imageForEntity: { include: { image: true } },
      socials: { where: { isActive: true } },
      theme: true,
      openingHours: true,
      banners: {
        where: { isActive: true },
        include: {
          imageForEntities: { include: { image: true } }
        }
      }
    }
  });
  return result;
};

export const upsertRestaurantService = async (db: PrismaClient, input: RestaurantInput) => {
  const { id, theme, socials, imageForEntity, openingHours, ...data } = input;

  const result = await db.$transaction(async tx => {
    let imageDb: Omit<ImageInfoFromDb, 'status'> | undefined, statusFromReq;
    if (imageForEntity?.status) {
      const { status, ...rest } = imageForEntity;
      imageDb = rest;
      statusFromReq = status;
    }
    const oldData = id ? await tx.restaurant.findUnique({ where: { id } }) : null;
    const newData = await tx.restaurant.upsert({
      where: { id: input.id || 'default_upsert_id' },
      create: {
        ...data,
        imageForEntity: {
          create:
            statusFromReq === StatusImage.NEW && imageDb
              ? {
                  ...imageDb,
                  entityType: EntityType.RESTAURANT,
                  altText: `Ảnh ${data.name}`,
                  type: ImageType.THUMBNAIL,
                  image: {
                    connectOrCreate: {
                      where: {
                        publicId: imageDb?.image?.publicId
                      },
                      create: {
                        ...(imageDb?.image ?? {}),
                        url: imageDb?.image?.url || '',
                        altText: imageDb?.image?.altText || 'Ảnh Logo nhà hàng ' + (data?.name || ''),
                        type: imageDb?.image?.type || ImageType.THUMBNAIL
                      }
                    }
                  }
                }
              : undefined
        },
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
        imageForEntity:
          statusFromReq === StatusImage.DELETED && imageDb?.id
            ? {
                delete: { id: imageDb.id }
              }
            : imageDb
              ? {
                  upsert: {
                    where: { id: imageDb.id },
                    update: {
                      ...imageDb,
                      image:
                        statusFromReq === StatusImage.NEW && imageDb.image
                          ? {
                              connectOrCreate: {
                                where: {
                                  publicId: imageDb.image.publicId
                                },
                                create: {
                                  ...imageDb.image,
                                  url: imageDb?.image?.url || '',
                                  altText: imageDb?.image?.altText || 'Ảnh Logo nhà hàng ' + (data?.name || ''),
                                  type: imageDb?.image?.type || ImageType.THUMBNAIL
                                }
                              }
                            }
                          : undefined
                    },
                    create: {
                      ...imageDb,
                      image:
                        statusFromReq === StatusImage.NEW && imageDb.image
                          ? {
                              connectOrCreate: {
                                where: {
                                  publicId: imageDb.image.publicId
                                },
                                create: {
                                  ...imageDb.image,
                                  url: imageDb.image.url || '',
                                  altText: imageDb?.image?.altText || 'Ảnh Logo nhà hàng ' + (data?.name || ''),
                                  type: imageDb?.image?.type || ImageType.THUMBNAIL
                                }
                              }
                            }
                          : undefined
                    }
                  }
                }
              : undefined,
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
    return { oldData, newData };
  });
  await Promise.all([delCache('theme-default'), delCache('getOneActive'), delCache('get-one-active-client')]);
  return {
    metaData: {
      before: result.oldData ?? {},
      after: result.newData ?? {}
    }
  };
};
