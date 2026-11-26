import { z } from 'zod';

import { activityLogger, createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import {
  createFavouriteFoodService,
  deleteFavouriteFoodService,
  getFilterFavouriteFoodIdsService,
  getFilterFavouriteFoodService,
  getProductOwnerService,
  syncFavouriteFoodService,
  toggleFavouriteFoodService
} from './favourite-food.service';

export const favouriteFoodRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        sort: z.array(z.string()).optional(),
        filters: z.array(z.string()).optional()
      })
    )
    .query(async ({ ctx }) => {}),

  create: publicProcedure
    .use(activityLogger)
    .input(
      z.object({
        productId: z.string(),
        userId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await createFavouriteFoodService(ctx.db, input)),
  sync: publicProcedure
    .use(activityLogger)
    .input(
      z.object({
        productIds: z.array(z.string()),
        userId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await syncFavouriteFoodService(ctx.db, input)),
  toggle: publicProcedure
    .use(activityLogger)
    .input(
      z.object({
        productId: z.string(),
        userId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await toggleFavouriteFoodService(ctx.db, input)),
  delete: publicProcedure
    .use(activityLogger)
    .input(
      z.object({
        userId: z.string(),
        productId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteFavouriteFoodService(ctx.db, input)),

  getFilter: protectedProcedure
    .input(
      z.object({
        s: z.string().optional(),
        sort: z.array(z.string()).optional(),
        keys: z.array(z.string())
      })
    )
    .query(async ({ ctx, input }) => await getFilterFavouriteFoodService(ctx.db, input)),
  getFilterIds: publicProcedure
    .input(
      z.object({
        s: z.string().optional(),
        keys: z.array(z.string()).optional()
      })
    )
    .query(async ({ ctx, input }) => await getFilterFavouriteFoodIdsService(ctx.db, input)),
  getProductOwner: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        productId: z.string()
      })
    )
    .query(async ({ ctx, input }) => await getProductOwnerService(ctx.db, input))
});
