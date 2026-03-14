import z from 'zod';
import { createTag } from '~/lib/FuncHandler/generateTag';
import { imageInputSchema, imageReqSchema } from './image.schema';

export const baseSubCategorySchema = z.object({
  id: z.string().optional(),
  tag: z.string().optional(),
  isActive: z.boolean().default(true),
  name: z.string({ required_error: 'Tên danh mục con là bắt buộc' }).min(1, 'Tên không được để trống'),
  description: z.string().optional(),
  categoryId: z
    .string({ required_error: 'Danh mục con phải thuộc ít nhất 1 danh mục.' })
    .min(1, 'Danh mục con phải thuộc ít nhất 1 danh mục.')
});

export const subCategoryReqSchema = baseSubCategorySchema
  .extend({
    image: imageReqSchema.optional()
  })
  .transform(data => ({
    ...data,
    tag: createTag(data?.name)
  }));
export const subCategoryFromDbSchema = baseSubCategorySchema
  .extend({
    image: imageReqSchema.optional()
  })
  .transform(data => ({
    ...data,
    tag: createTag(data?.name)
  }));

export const subCategoryInputSchema = baseSubCategorySchema
  .extend({
    image: imageInputSchema.optional()
  })
  .transform(data => ({
    ...data,
    tag: createTag(data?.name)
  }));

export type SubCategoryReq = z.infer<typeof subCategoryReqSchema>;
export type SubCategoryFromDb = z.infer<typeof subCategoryFromDbSchema>;
export type SubCategoryInput = z.infer<typeof subCategoryInputSchema>;
