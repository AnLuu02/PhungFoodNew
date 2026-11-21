import z from 'zod';
import { imageInfoClientInputSchema } from './image.info.schema';

export const baseBannerSchema = z.object({
  id: z.string().optional(),
  startDate: z.date().optional(),
  isActive: z.boolean().default(false),
  restaurantId: z.string().optional().nullable(),
  endDate: z.date().optional()
});

export const bannerReqSchemaCloudinary = baseBannerSchema.extend({
  imageForEntities: z.array(imageInfoClientInputSchema).optional()
});
export const bannerInputSchema = baseBannerSchema.extend({
  banner1: imageInfoClientInputSchema.optional(),
  banner2: imageInfoClientInputSchema.optional(),
  galleryInput: z.array(z.instanceof(File)).optional().nullable(),
  gallery: z.array(imageInfoClientInputSchema).optional()
});

export type BannerInput = z.infer<typeof bannerInputSchema>;
export type BannerReqCloudinary = z.infer<typeof bannerReqSchemaCloudinary>;
