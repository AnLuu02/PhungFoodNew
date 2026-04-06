import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { delCache } from '~/lib/CacheConfig/withRedisCache';
import { SocialWithRestaurantId } from '~/shared/schema/restaurant.socials.schema';

export const upsertSocialService = async (db: PrismaClient, input: SocialWithRestaurantId) => {
  const { id, restaurantId, ...data } = input;
  const oldSocial = await db.social.findUnique({ where: { platform: data.platform || 'Default_platform_unique' } });
  if (oldSocial?.platform && oldSocial?.id !== id) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Nền tảng này đã tồn tại. Không cần tạo nữa đâu.'
    });
  }
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
    db.social.upsert({
      where: { id: id || 'default_id_socials' },
      create: {
        ...data,
        restaurant: restaurantId
          ? {
              connect: {
                id: restaurantId
              }
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
          : undefined
      }
    })
  ]);

  return updated;
};
export const deleteSocialService = async (db: PrismaClient, input: { id: string; platform: string }) => {
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
};
