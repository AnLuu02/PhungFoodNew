import { activityLogger, createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { upsertDeliveryService } from './delivery.service';
import { baseDeliverySchema } from '~/shared/schema/delivery.schema';

export const deliveryRouter = createTRPCRouter({
  upsert: publicProcedure
    .use(activityLogger)
    .input(baseDeliverySchema)
    .mutation(async ({ ctx, input }) => await upsertDeliveryService(ctx.db, input))
});
