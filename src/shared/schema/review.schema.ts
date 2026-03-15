import z, { literal } from 'zod';

export const baseReviewSchema = z.object({
  id: z.string().optional(),
  userId: z.string({ required_error: 'Ai là người đánh giá?' }).min(1, 'Ai là người đánh giá?').or(literal('')),
  productId: z.string({ required_error: 'Product ID là bắt buộc' }).min(1, 'Product ID không được để trống'),
  rating: z.number().default(1),
  comment: z.string()
});

export type ReviewInput = z.infer<typeof baseReviewSchema>;
