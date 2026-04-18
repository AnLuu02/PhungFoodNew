import { z } from 'zod';
import { createTRPCRouter, publicProcedure, requirePermission } from '~/server/api/trpc';
import {
  deleteBannerService,
  getAllBannerService,
  getOneBannerService,
  setDefaultBannerService,
  upsertBannerService
} from '~/server/services/restaurant.banner.service';
import { updateOpeningHoursService } from '~/server/services/restaurant.openingHours.service';
import {
  getOneActiveClientService,
  getOneActiveService,
  upsertRestaurantService
} from '~/server/services/restaurant.service';
import { deleteSocialService, upsertSocialService } from '~/server/services/restaurant.socials.service';
import { changeThemeService, getThemeService } from '~/server/services/restaurant.theme.service';
import { bannerReqSchemaCloudinary } from '~/shared/schema/restaurant.banner.schema';
import { baseOpeningHourSchema } from '~/shared/schema/restaurant.openingHours.schema';
import { restaurantInputSchema } from '~/shared/schema/restaurant.schema';
import { socialSchemaWithRestaurantId } from '~/shared/schema/restaurant.socials.schema';
import { baseThemeSchema } from '~/shared/schema/restaurant.theme.schema';

export const restaurantRouter = createTRPCRouter({
  getOneActive: publicProcedure.query(async ({ ctx }) => await getOneActiveService(ctx.db)),
  getOneActiveClient: publicProcedure.query(async ({ ctx }) => await getOneActiveClientService(ctx.db)),
  upsert: publicProcedure
    .use(requirePermission(undefined, { requiredAdmin: true }))
    .input(restaurantInputSchema)
    .mutation(async ({ ctx, input }) => await upsertRestaurantService(ctx.db, input)),
  /////////////////////////////// theme//////////////////////////////////
  changeTheme: publicProcedure
    .input(
      baseThemeSchema.extend({
        restaurantId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await changeThemeService(ctx.db, input)),
  getTheme: publicProcedure.query(async ({ ctx }) => await getThemeService(ctx.db)),
  /////////////////////////////// banners//////////////////////////////////
  getAllBanner: publicProcedure.query(async ({ ctx }) => await getAllBannerService(ctx.db)),

  upsertBanner: publicProcedure
    .input(bannerReqSchemaCloudinary)
    .mutation(async ({ ctx, input }) => await upsertBannerService(ctx.db, input)),
  getOneBanner: publicProcedure
    .input(
      z.object({
        isActive: z.boolean().optional()
      })
    )
    .query(async ({ ctx, input }) => await getOneBannerService(ctx.db, input)),

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
        id: z.string()
        // otherId: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteBannerService(ctx.db, input)),

  ///////////////////////////////socials//////////////////////////////////

  upsertSocial: publicProcedure
    .input(socialSchemaWithRestaurantId)
    .mutation(async ({ ctx, input }) => await upsertSocialService(ctx.db, input)),
  deleteSocial: publicProcedure
    .input(
      z.object({
        id: z.string(),
        platform: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => await deleteSocialService(ctx.db, input)),
  ///////////////////////////////   opening hour //////////////////////////////////
  updateOpeningHours: publicProcedure
    .input(
      z.object({
        data: z.array(baseOpeningHourSchema)
      })
    )
    .mutation(async ({ ctx, input }) => await updateOpeningHoursService(ctx.db, input))
});
