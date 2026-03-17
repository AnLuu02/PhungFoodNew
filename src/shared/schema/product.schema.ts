import z from 'zod';
import { createTag } from '~/lib/FuncHandler/generateTag';
import { imageFromDbSchema, imageReqSchema } from './image.schema';

export const getServiceOptionsSchema = z.object({
  s: z.string().optional(),
  hasCategory: z.boolean().default(false).optional(),
  hasCategoryChild: z.boolean().default(false).optional(),
  hasReview: z.boolean().default(false).optional(),
  userRole: z.string().optional()
});

export const filterProductInputSchema = z.object({
  skip: z.number().nonnegative(),
  take: z.number().positive(),
  s: z.string().optional(),
  filter: z.string().optional(),
  sort: z.array(z.string()).optional(),
  'nguyen-lieu': z.array(z.string()).optional(),
  discount: z.boolean().optional(),
  bestSaler: z.boolean().optional(),
  newProduct: z.boolean().optional(),
  rating: z.number().optional(),
  hotProduct: z.boolean().optional(),
  'danh-muc': z.string().optional(),
  'loai-san-pham': z.string().optional(),
  price: z
    .object({
      min: z.number().optional(),
      max: z.number().optional()
    })
    .optional(),
  userRole: z.string().optional()
});

export const baseProductSchema = z.object({
  id: z.string().optional(),
  name: z.string({ required_error: 'Tên sản phẩm là bắt buộc' }).min(1, 'Tên sản phẩm không được để trống'),
  description: z.string().optional(),
  descriptionDetailJson: z.any().optional().nullable(),
  descriptionDetailHtml: z.string().default('<p>Đang cập nhật</p>'),
  region: z.string({ required_error: 'Món ăn này là của miền nào đây?' }).min(1, 'Món ăn này là của miền nào đây?'),
  tag: z.string().optional(),
  tags: z.array(z.string()),
  isActive: z.boolean().default(true),
  price: z
    .number({ required_error: 'Giá trị phải lớn hơn hoặc bằng 10.000' })
    .min(10000, 'Giá trị phải lớn hơn hoặc bằng 10.000')
    .default(10000),
  discount: z
    .number({ required_error: 'Giá trị khuyên mái phải lớn hơn hoặc bằng 0' })
    .min(0, 'Giá trị không được nhỏ hơn 0')
    .optional()
    .default(0),
  //   thumbnail: z.instanceof(File).optional(),
  //   gallery: z.array(z.instanceof(File)).optional(),
  subCategoryId: z.string({ required_error: 'Hãy chọn danh mục sản phẩm' }).min(1, 'Hãy chọn danh mục sản phẩm'),
  rating: z.number().optional(),
  totalRating: z.number().optional(),
  soldQuantity: z.coerce.number().min(0, 'Số lượng đã bán không được âm'),
  availableQuantity: z.coerce.number().min(0, 'Số lượng khả dụng không được âm'),
  materials: z.array(z.string()).optional()
});

export const productReqSchema = baseProductSchema
  .extend({
    thumbnail: imageReqSchema.optional(),
    gallery: z.array(imageReqSchema).optional()
  })
  .transform(data => ({
    ...data,
    tag: createTag('Sản phẩm ' + data?.name)
  }));

export const productInputSchema = baseProductSchema
  .extend({
    thumbnail: z.instanceof(File).optional(),
    gallery: z.array(z.instanceof(File)).optional()
  })
  .transform(data => ({
    ...data,
    tag: createTag('Sản phẩm ' + data?.name)
  }));
export const productFromDbSchema = baseProductSchema
  .extend({
    thumbnail: imageFromDbSchema.optional(),
    gallery: z.array(imageFromDbSchema).optional()
  })
  .transform(data => ({
    ...data,
    tag: createTag('Sản phẩm ' + data?.name)
  }));

export type ProductInput = z.infer<typeof productInputSchema>;
export type ProductReq = z.infer<typeof productReqSchema>;
export type ProductFromDb = z.infer<typeof productFromDbSchema>;

export type FilterProductInput = z.infer<typeof filterProductInputSchema>;
export type FilterProductOptions = {
  s?: string;
  filter?: string;
  discount?: boolean;
  bestSaler?: boolean;
  newProduct?: boolean;
  hotProduct?: boolean;
  price?: { min?: number; max?: number };
  rating?: number;
  'nguyen-lieu'?: string[];
  'danh-muc'?: string;
  'loai-san-pham'?: string;
};

export type ServiceOptions = z.infer<typeof getServiceOptionsSchema>;
