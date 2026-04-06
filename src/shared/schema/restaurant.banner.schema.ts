import z from 'zod';
import { imageFromDbSchema, imageInputSchema } from './image.schema';

export const baseBannerSchema = z.object({
  id: z.string().optional(),
  startDate: z.date().optional(),
  isActive: z.boolean().default(false),
  restaurantId: z.string().optional().nullable(),
  endDate: z.date().optional()
});

export const bannerReqSchemaCloudinary = baseBannerSchema.extend({
  images: z.array(imageFromDbSchema).optional()
});
export const bannerInputSchema = baseBannerSchema.extend({
  banner1: imageInputSchema.optional(),
  banner2: imageInputSchema.optional(),
  galleryInput: z.array(z.instanceof(File)).optional().nullable(),
  gallery: z.array(imageInputSchema).optional()
});

export type BannerInput = z.infer<typeof bannerInputSchema>;
export type BannerReqCloudinary = z.infer<typeof bannerReqSchemaCloudinary>;
