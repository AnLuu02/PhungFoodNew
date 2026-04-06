import z from 'zod';
import { imageFromDbSchema, imageInputSchema } from './image.schema';
import { baseOpeningHourSchema } from './restaurant.openingHours.schema';
import { baseSocialSchema } from './restaurant.socials.schema';
import { baseThemeSchema } from './restaurant.theme.schema';

export const baseRestaurantSchema = z.object({
  id: z.string().optional(),
  address: z.string({ required_error: 'Địa chỉ là bắt buộc' }).min(1, 'Địa chỉ là bắt buộc'),
  name: z.string({ required_error: 'Tên nhà hàng là bắt buộc' }).min(1, 'Tên nhà hàng là bắt buộc'),
  email: z.string({ required_error: 'Email là bắt buộc' }).email({ message: 'Email không hợp lệ' }),
  phone: z.string({ required_error: 'Số điện thoại là bắt buộc' }).regex(/^\d{10}$/, 'Số điện thoại phải có 10 chữ số'),
  description: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  socials: z.array(baseSocialSchema),
  theme: baseThemeSchema.optional().nullable(),
  openingHours: z.array(baseOpeningHourSchema).optional().nullable()
});

export const restaurantReqCloudinarySchema = baseRestaurantSchema.extend({
  logo: imageFromDbSchema.optional()
});
export const restaurantInputSchema = baseRestaurantSchema.extend({
  logo: imageInputSchema.optional()
});

export type RestaurantInput = z.infer<typeof restaurantInputSchema>;
export type RestaurantReqCloudinary = z.infer<typeof restaurantReqCloudinarySchema>;
