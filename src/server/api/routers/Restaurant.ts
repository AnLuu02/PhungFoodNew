import { z } from 'zod';
import { createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import {
  changeThemeService,
  createBannerService,
  createRestaurantService,
  createSocialService,
  deleteBannerService,
  deleteSocialService,
  getAllBannerService,
  getOneActiveClientService,
  getOneActiveService,
  getOneBannerService,
  getThemeService,
  setDefaultBannerService,
  updateBannerService,
  updateOpeningHoursService,
  updateRestaurantService,
  updateSocialService
} from '~/server/services/restaurant.service';
import {
  bannerReqSchema,
  baseOpeningHourSchema,
  baseSocialSchema,
  baseThemeSchema,
  restaurantReqSchema
} from '~/shared/schema/restaurant.schema';

export const restaurantRouter = createTRPCRouter({
  getOneActive: publicProcedure.query(async ({ ctx }) => await getOneActiveService(ctx.db)),
  getOneActiveClient: publicProcedure.query(async ({ ctx }) => await getOneActiveClientService(ctx.db)),
  create: publicProcedure
    .use(requirePermission(undefined, { requiredAdmin: true }))
    .input(restaurantReqSchema)
    .mutation(async ({ ctx, input }) => await createRestaurantService(ctx.db, input)),
  update: publicProcedure
    .use(requirePermission(undefined, { requiredAdmin: true }))
    .input(restaurantReqSchema)
    .mutation(async ({ ctx, input }) => await updateRestaurantService(ctx.db, input)),
  changeTheme: publicProcedure
    .input(
      baseThemeSchema.extend({
        restaurantId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await changeThemeService(ctx.db, input)),
  getTheme: publicProcedure.query(async ({ ctx }) => await getThemeService(ctx.db)),
  getAllBanner: publicProcedure.query(async ({ ctx }) => await getAllBannerService(ctx.db)),
  createBanner: publicProcedure
    .input(bannerReqSchema)
    .mutation(async ({ ctx, input }) => await createBannerService(ctx.db, input)),
  getOneBanner: publicProcedure
    .input(
      z.object({
        isActive: z.boolean().optional()
      })
    )
    .query(async ({ ctx, input }) => await getOneBannerService(ctx.db, input)),
  updateBanner: publicProcedure
    .input(bannerReqSchema)
    .mutation(async ({ ctx, input }) => await updateBannerService(ctx.db, input)),
  setDefaultBanner: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await setDefaultBannerService(ctx.db, input)),
  deleteBanner: publicProcedure
    .input(
      z.object({
        id: z.string(),
        otherId: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteBannerService(ctx.db, input)),
  createSocial: publicProcedure
    .input(baseSocialSchema.extend({ restaurantId: z.string() }))
    .mutation(async ({ ctx, input }) => await createSocialService(ctx.db, input)),

  updateSocial: publicProcedure
    .input(baseSocialSchema.partial())
    .mutation(async ({ ctx, input }) => await updateSocialService(ctx.db, input)),
  deleteSocial: publicProcedure
    .input(
      z.object({
        id: z.string(),
        platform: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteSocialService(ctx.db, input)),
  //opening hour
  updateOpeningHours: publicProcedure
    .input(
      z.object({
        data: z.array(baseOpeningHourSchema)
      })
    )
    .mutation(async ({ ctx, input }) => await updateOpeningHoursService(ctx.db, input))
});
