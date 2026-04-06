import z from 'zod';
export const baseSocialSchema = z.object({
  id: z.string().optional(),
  platform: z.string().min(1, 'Platform không được để trống'),
  label: z.string().min(1, 'Label không được để trống'),
  value: z.string().min(1, 'Value không được để trống'),
  pattern: z.string().min(1, 'Pattern không được để trống'),
  icon: z.string().optional().nullable(),
  isActive: z.boolean().default(true)
});

export const socialSchemaWithRestaurantId = baseSocialSchema.extend({
  restaurantId: z.string().optional()
});
export type SocialWithRestaurantId = z.infer<typeof socialSchemaWithRestaurantId>;
