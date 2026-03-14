import z from 'zod';
import { createTag } from '~/lib/FuncHandler/generateTag';

export const baseMaterialSchema = z
  .object({
    id: z.string().optional(),
    name: z.string({ required_error: 'Tên là bắt buộc' }).min(1, 'Tên không được để trống'),
    tag: z.string().optional(),
    description: z.string().optional(),
    category: z.string({ required_error: 'Danh mục là bắt buộc' }).min(1, 'Danh mục không được để trống')
  })
  .transform(data => ({
    ...data,
    tag: createTag('Nguyên liệu ' + data?.name)
  }));

export type MaterialInput = z.infer<typeof baseMaterialSchema>;
