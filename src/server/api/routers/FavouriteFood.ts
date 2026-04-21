import { z } from 'zod';

import { activityLogger, createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import {
  createFavouriteFoodService,
  deleteFavouriteFoodService,
  getFilterFavouriteFoodService
} from '~/server/services/favouriteFood.service';

export const favouriteFoodRouter = createTRPCRouter({
  create: publicProcedure
    .use(activityLogger)
    .input(
      z.object({
        productId: z.string(),
        userId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await createFavouriteFoodService(ctx.db, input)),
  delete: publicProcedure
    .use(activityLogger)
    .input(
      z.object({
        userId: z.string(),
        productId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteFavouriteFoodService(ctx.db, input)),

  getFilter: publicProcedure
    .input(
      z.object({
        s: z.string()
      })
    )
    .query(async ({ ctx, input }) => await getFilterFavouriteFoodService(ctx.db, input))
});
