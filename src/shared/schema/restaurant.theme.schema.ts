import z from 'zod';

export const baseThemeSchema = z.object({
  id: z.string().optional(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  themeMode: z.string().default('light'),
  fontFamily: z.string().optional().nullable(),
  borderRadius: z.string().optional().nullable(),
  faviconUrl: z.string().optional().nullable()
});

export const themeSchemaWithRestaurantId = baseThemeSchema.extend({
  restaurantId: z.string().optional()
});
export type ThemeWithRestaurantId = z.infer<typeof themeSchemaWithRestaurantId>;
