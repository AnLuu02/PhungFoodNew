import z from 'zod';

export const baseOpeningHourSchema = z.object({
  id: z.string(),
  dayOfWeek: z.string(),
  openTime: z.string(),
  viNameDay: z.string(),
  closeTime: z.string(),
  isClosed: z.boolean()
});
export const baseOpeningHourSchemaWithRestaurantId = baseOpeningHourSchema.extend({
  restaurantId: z.string().optional()
});

export type OpeningHourWithRestaurantId = z.infer<typeof baseOpeningHourSchemaWithRestaurantId>;
