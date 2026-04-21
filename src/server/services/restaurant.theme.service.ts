import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { delCache } from '~/lib/CacheConfig/withRedisCache';
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
    await Promise.all([delCache('theme-default'), delCache('getOneActive'), delCache('get-one-active-client')]);
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
export const getThemeService = async (db: PrismaClient) => {
  return await db.theme.findFirst({});
};
