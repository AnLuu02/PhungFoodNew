import { EntityType, ImageType, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { ImageFromDb, StatusImage } from '~/shared/schema/image.schema';
import { BannerReqCloudinary } from '~/shared/schema/restaurant.banner.schema';

//upsert banner
export const upsertBannerService = async (db: PrismaClient, input: BannerReqCloudinary) => {
  const { id, images, restaurantId, ...data } = input;
  const imagesInput = images || [];
  const { newImages, deleteImages } = imagesInput.reduce(
    (acc: { newImages: ImageFromDb[]; deleteImages: ImageFromDb[] }, item: ImageFromDb) => {
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
      images:
        newImages && newImages?.length > 0
          ? {
              connectOrCreate: newImages.map(({ status, ...item }, index) => ({
                where: {
                  publicId: item?.publicId || 'Image_Default_PublicId'
                },
                create: {
                  ...item,
                  url: item?.url || '',
                  type: item?.type || ImageType.BANNER,
                  altText: item?.altText || `Ảnh banner nha hang ${index} `,
                  entityType: item?.entityType || EntityType.RESTAURANT
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
      images: {
        ...(newImages && newImages?.length > 0
          ? {
              connectOrCreate: newImages.map(({ status, ...item }, index) => ({
                where: {
                  publicId: item?.publicId || 'Image_Default_PublicId'
                },
                create: {
                  ...item,
                  url: item?.url || '',
                  type: item?.type || ImageType.BANNER,
                  altText: item?.altText || `Ảnh banner nha hang ${index} `,
                  entityType: item?.entityType || EntityType.RESTAURANT
                }
              }))
            }
          : undefined),
        disconnect: deleteImages.length ? deleteImages.map(item => ({ publicId: item?.publicId || '' })) : undefined
      }
    },
    include: {
      images: { select: { publicId: true } }
    }
  });

  if (banner?.id && !banner?.images?.length) {
    await db.banner.delete({
      where: {
        id: banner?.id || ''
      }
    });
  }

  return banner;
};

export const getOneBannerService = async (db: PrismaClient, input: any) => {
  return await db.banner.findFirst({
    where: input.isActive ? { isActive: input.isActive } : undefined,
    include: { images: true }
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
    let result = await db.banner.delete({
      where: { id: input.id }
    });
    return result;
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Đã có lỗi xảy ra.'
    });
  }
};

export const getAllBannerService = async (db: PrismaClient) => {
  return await db.banner.findMany({
    include: { images: true },
    orderBy: { createdAt: 'desc' }
  });
};
