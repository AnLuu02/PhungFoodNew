import { EntityType, ImageType, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { ImageInfoFromDb, StatusImage } from '~/shared/schema/image.info.schema';
import { BannerReqCloudinary } from '~/shared/schema/restaurant.banner.schema';

//upsert banner
export const upsertBannerService = async (db: PrismaClient, input: BannerReqCloudinary) => {
  const { id, imageForEntities, restaurantId, ...data } = input;
  const imagesInput = imageForEntities || [];
  const { newImages, deleteImages } = imagesInput.reduce(
    (acc: { newImages: ImageInfoFromDb[]; deleteImages: ImageInfoFromDb[] }, item: ImageInfoFromDb) => {
      item?.status === StatusImage.NEW && acc.newImages?.push(item);
      item?.status === StatusImage.DELETED && acc.deleteImages?.push(item);
      return acc;
    },
    { newImages: [], deleteImages: [] }
  );
  const banner = await db.banner.upsert({
    where: {
      id: id || 'Banner_Default_Upsert_Id'
    },
    create: {
      ...data,
      restaurant: restaurantId
        ? {
            connect: {
              id: restaurantId
            }
          }
        : undefined,
      imageForEntities: newImages?.length
        ? {
            create: newImages.map(({ status, ...item }: any, index: number) => ({
              id: undefined,
              entityType: EntityType.BANNER,
              altText: item?.altText || 'Ảnh banner nhà hàng',
              type: item?.type || ImageType.THUMBNAIL,
              image: {
                connectOrCreate: {
                  where: {
                    publicId: item?.image?.publicId
                  },
                  create: {
                    ...(item?.image ?? {}),
                    url: item?.image?.url || '',
                    altText: item?.image?.altText || 'Ảnh banner ' + index,
                    type: item?.image?.type || ImageType.THUMBNAIL
                  }
                }
              }
            }))
          }
        : undefined
    },
    update: {
      ...data,
      restaurant: restaurantId
        ? {
            connect: {
              id: restaurantId
            }
          }
        : undefined,
      imageForEntities: {
        ...(newImages?.length
          ? {
              upsert: newImages.map(({ status, ...item }: any) => ({
                where: {
                  id: item?.id || 'default_id'
                },
                create: {
                  entityType: EntityType.BANNER,
                  altText: item?.altText || 'Ảnh banner nhà hàng',
                  type: item?.type || ImageType.THUMBNAIL,
                  image: {
                    connectOrCreate: {
                      where: {
                        publicId: item?.image?.publicId
                      },
                      create: {
                        ...(item?.image ?? {}),
                        url: item?.image?.url || '',
                        altText: item?.image?.altText || 'Ảnh banner nhà hàng',
                        type: item?.image?.type || ImageType.THUMBNAIL
                      }
                    }
                  }
                },
                update: {
                  entityType: EntityType.BANNER,
                  altText: item?.altText || 'Ảnh banner nhà hàng',
                  type: item?.type || ImageType.THUMBNAIL,
                  image: {
                    connectOrCreate: {
                      where: {
                        publicId: item?.image?.publicId
                      },
                      create: {
                        ...(item?.image ?? {}),
                        url: item?.image?.url || '',
                        altText: item?.image?.altText || 'Ảnh banner nhà hàng',
                        type: item?.image?.type || ImageType.THUMBNAIL
                      }
                    }
                  }
                }
              }))
            }
          : {}),
        delete: deleteImages ? deleteImages?.map(item => ({ id: item?.id })) : undefined
      }
    },
    include: {
      imageForEntities: { include: { image: true } }
    }
  });

  if (banner?.id && !banner?.imageForEntities?.length) {
    await db.banner.delete({
      where: {
        id: banner?.id || ''
      }
    });
  }

  return banner;
};

export const getOneBannerService = async (db: PrismaClient, input: { isActive?: boolean }) => {
  return await db.banner.findFirst({
    where: input.isActive ? { isActive: input.isActive } : undefined,
    include: { imageForEntities: { include: { image: true } } }
  });
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
    let deleted = await db.banner.delete({
      where: { id: input.id }
    });
    return {
      metaData: {
        before: deleted ?? {},
        after: {}
      }
    };
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Đã có lỗi xảy ra.'
    });
  }
};

export const getAllBannerService = async (db: PrismaClient) => {
  return await db.banner.findMany({
    include: { imageForEntities: { include: { image: true } } },
    orderBy: { createdAt: 'desc' }
  });
};
