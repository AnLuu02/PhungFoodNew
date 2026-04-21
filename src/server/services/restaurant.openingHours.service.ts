import { PrismaClient } from '@prisma/client';
import { delCache } from '~/lib/CacheConfig/withRedisCache';
import { OpeningHourWithRestaurantId } from '~/shared/schema/restaurant.openingHours.schema';

export const updateOpeningHoursService = async (db: PrismaClient, input: { data: OpeningHourWithRestaurantId[] }) => {
  const { data: openingHours } = input;
  const result = await db.$transaction(async tx => {
    let changes = [];
    let oldData = null;
    let newData = null;
    for (const o of openingHours) {
      oldData = await tx.openingHour.findUnique({ where: { id: o?.id } });
      newData = await tx.openingHour.update({
        where: { id: o.id },
        data: o
      });
      changes.push({ oldData: oldData ?? {}, newData: newData ?? {} });
    }
    return changes;
  });
  if (result?.length > 0) {
    await Promise.all([delCache('getOneActive'), delCache('get-one-active-client')]);
  }
  return result?.map(item => ({
    metaData: {
      before: item.oldData ?? {},
      after: item.newData ?? {}
    }
  }));
};
