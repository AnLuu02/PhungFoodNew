import { PrismaClient } from '@prisma/client';
import { delCache } from '~/lib/CacheConfig/withRedisCache';
import { OpeningHourWithRestaurantId } from '~/shared/schema/restaurant.openingHours.schema';

export const updateOpeningHoursService = async (db: PrismaClient, input: { data: OpeningHourWithRestaurantId[] }) => {
  const { data: openingHours } = input;
  const updated = await db.$transaction(
    openingHours.map(openingHour =>
      db.openingHour.update({
        where: { id: openingHour.id },
        data: openingHour
      })
    )
  );
  await Promise.all([delCache('getOneActive'), delCache('get-one-active-client')]);
  return updated;
};
