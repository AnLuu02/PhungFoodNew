import { Prisma, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { delCache } from '~/lib/CacheConfig/withRedisCache';
import { RESTAURANT_KEY, THEME_KEY } from '~/shared/constants/redis-keys';
import { ThemeWithRestaurantId } from '~/shared/schema/restaurant.theme.schema';

export const changeThemeService = async (db: PrismaClient, input: ThemeWithRestaurantId) => {
  const { id, ...data } = input;
  try {
    const result = await db.$transaction(async tx => {
      const oldData = id ? await tx.theme.findUnique({ where: { id } }) : null;
      const newData = await db.theme.upsert({
        where: { restaurantId: input.restaurantId },
        update: {
          ...data
        },
        create: {
          ...data
        }
      });
      return { oldData, newData };
    });
    await Promise.all([delCache(THEME_KEY.default), delCache(RESTAURANT_KEY.full), delCache(RESTAURANT_KEY.active)]);
    return {
      metaData: {
        before: result.oldData ?? {},
        after: result.newData ?? {}
      }
    };
  } catch {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Đã có lỗi xảy ra.'
    });
  }
};
export const getThemeService = async (db: PrismaClient, input?: { include?: Prisma.ThemeInclude }) => {
  return await db.theme.findFirst({ include: input?.include });
};
