import z from 'zod';
import { createTag } from '~/lib/FuncHandler/generateTag';

export const baseCategorySchema = z
  .object({
    id: z.string().optional(),
    isActive: z.boolean().default(true),
    tag: z.string().optional(),
    name: z.string({ required_error: 'Tên danh mục là bắt buộc' }).min(1, 'Tên không được để trống').trim(),
    description: z.string().optional()
  })
  .transform(data => ({
    ...data,
    tag: createTag(data?.name)
  }));

export type CategoryInput = z.infer<typeof baseCategorySchema>;
