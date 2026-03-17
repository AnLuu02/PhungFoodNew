import z from 'zod';
import { imageInputSchema, imageReqSchema } from './image.schema';

export const baseThemeSchema = z.object({
  id: z.string().optional(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  themeMode: z.string().default('light'),
  fontFamily: z.string().optional().nullable(),
  borderRadius: z.string().optional().nullable(),
  faviconUrl: z.string().optional().nullable()
});
export const baseSocialSchema = z.object({
  id: z.string().optional(),
  platform: z.string().min(1, 'Platform không được để trống'),
  label: z.string().min(1, 'Label không được để trống'),
  value: z.string().min(1, 'Value không được để trống'),
  pattern: z.string().min(1, 'Pattern không được để trống'),
  icon: z.string().optional(),
  isActive: z.boolean().default(true)
});
export const baseOpeningHourSchema = z.object({
  id: z.string(),
  dayOfWeek: z.string(),
  openTime: z.string(),
  viNameDay: z.string(),
  closeTime: z.string(),
  isClosed: z.boolean()
});

export const baseRestaurantSchema = z.object({
  id: z.string().optional(),
  address: z.string({ required_error: 'Địa chỉ là bắt buộc' }).min(1, 'Địa chỉ là bắt buộc'),
  name: z.string({ required_error: 'Tên nhà hàng là bắt buộc' }).min(1, 'Tên nhà hàng là bắt buộc'),
  email: z.string({ required_error: 'Email là bắt buộc' }).email({ message: 'Email không hợp lệ' }),
  phone: z.string({ required_error: 'Số điện thoại là bắt buộc' }).regex(/^\d{10}$/, 'Số điện thoại phải có 10 chữ số'),
  description: z.string().optional(),
  //   logo: imageSchema.optional(),
  website: z.string().optional(),
  socials: z.array(baseSocialSchema),
  theme: baseThemeSchema.optional(),
  openingHours: z.array(baseOpeningHourSchema).optional()
});

export const restaurantReqSchema = baseRestaurantSchema.extend({
  logo: imageReqSchema.optional()
});
export const restaurantInputSchema = baseRestaurantSchema.extend({
  logo: imageInputSchema.optional()
});
export const baseBannerSchema = z.object({
  id: z.string().optional(),
  //   banner1: z.instanceof(File).nullable().optional(),
  //   banner2: z.instanceof(File).nullable().optional(),
  //   gallery: z.array(z.instanceof(File)).optional(),
  startDate: z.date().optional(),
  isActive: z.boolean().default(false),
  endDate: z.date().optional()
});

export const bannerReqSchema = baseBannerSchema.extend({
  banner: z.array(imageReqSchema).optional(),
  gallery: z.array(imageReqSchema).optional()
});

export type ThemeInput = z.infer<typeof baseThemeSchema>;
export type SocialInput = z.infer<typeof baseSocialSchema>;
export type OpeningHourInput = z.infer<typeof baseOpeningHourSchema>;
export type BannerInput = z.infer<typeof baseBannerSchema>;
export type BannerReq = z.infer<typeof bannerReqSchema>;
export type RestaurantInput = z.infer<typeof restaurantInputSchema>;
export type RestaurantReq = z.infer<typeof restaurantReqSchema>;
