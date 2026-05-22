import z from 'zod';

export const productFilterSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(12),
  sort: z.array(z.string()).default([]),
  filter: z.string().optional(),
  tag: z.string().optional(),
  s: z.string().optional(),
  'nguyen-lieu': z.array(z.string()).default([]),
  'danh-muc': z.string().optional(),
  'loai-san-pham': z.string().optional(),
  loai: z.enum(['san-pham-moi', 'san-pham-giam-gia', 'san-pham-hot', 'san-pham-ban-chay']).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  userRole: z.string().optional()
});
export const defaultProductFilters = productFilterSchema.parse({});

export type FilterProductOptions = z.infer<typeof productFilterSchema>;
