import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { delCache } from '~/lib/CacheConfig/withRedisCache';
import { ThemeWithRestaurantId } from '~/shared/schema/restaurant.theme.schema';

export const changeThemeService = async (db: PrismaClient, input: ThemeWithRestaurantId) => {
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
