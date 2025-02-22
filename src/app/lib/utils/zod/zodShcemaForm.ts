import { EntityType, Gender, ImageType, OrderStatus, PaymentType, UserLevel, UserRole } from '@prisma/client';
import { z } from 'zod';
export const imageSchema = z.object({
  id: z.string().optional(),
  url: z.instanceof(File).optional(),
  altText: z.string().optional(),
  type: z.nativeEnum(ImageType).default(ImageType.THUMBNAIL),
  entityId: z.string().optional(),
  entityType: z.nativeEnum(EntityType).optional()
});

export const categorySchema = z.object({
  id: z.string().optional(),
  tag: z.string().min(1, 'Tag là bắt buộc'),
  name: z.string().min(1, 'Tên không được để trống'),
  description: z.string().optional()
});

export const subCategorySchema = z.object({
  id: z.string().optional(),
  tag: z.string().min(1, 'Tag là bắt buộc'),
  name: z.string().min(1, 'Tên không được để trống'),
  description: z.string().optional(),
  categoryId: z.string(),
  thumbnail: imageSchema.optional()
});

export const paymentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Tên không được để trống'),
  tag: z.string().min(1, 'Tag là bắt buộc'),
  type: z.nativeEnum(PaymentType),
  provider: z.string().optional(),
  isDefault: z.boolean().default(false)
});

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Tên không được để trống'),
  email: z.string().email({ message: 'Email không hợp lệ (vd: example@gmail.com)' }),
  image: imageSchema.optional(),
  gender: z.nativeEnum(Gender),
  dateOfBirth: z.date().optional(),
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
  role: z.nativeEnum(UserRole),
  phone: z.string().max(10, { message: 'Số điện thoại không được quá 10 ký tự' }),
  address: z.string().optional(),
  pointLevel: z.number().default(0),
  level: z.nativeEnum(UserLevel).default(UserLevel.DONG)
});

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Tên sản phẩm không được để trống'),
  description: z.string().optional(),
  region: z.string().min(1, 'Món ăn này là của miền nào đây?'),
  tag: z.string(),
  price: z.number().min(10000, 'Giá trị phải lớn hơn hoặc bằng 10.000').default(10000),
  discount: z.number().min(0, 'Giá trị không được nhỏ hơn 0').optional().default(0),
  thumbnail: z.instanceof(File).optional(),
  gallery: z.array(z.instanceof(File)).optional(),
  subCategoryId: z.string().optional(),
  rating: z.number().optional(),
  totalRating: z.number().optional(),
  soldQuantity: z.number().optional(),
  availableQuantity: z.number().optional()
});
export const deliverySchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email({ message: 'Email không hợp lệ' }).optional(),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ').max(10, 'Số điện thoại không hợp lệ').optional(),
  province: z.string().min(1, 'Tỉnh/Thành phố không được để trống').optional(),
  address: z.string().min(1, 'Địa chỉ không được để trống').optional(),
  note: z.string().optional(),
  userId: z.string().optional(),
  orderId: z.string().optional()
});

export const reviewSchema = z.object({
  id: z.string().optional(),
  userId: z.string().min(1, 'User ID không được để trống'),
  productId: z.string().min(1, 'Product ID không được để trống'),
  rating: z.number().min(0).max(5, 'Rating phải trong khoảng 0-5'),
  comment: z.string().min(1, 'Bình luận không được để trống')
});

export const orderItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string().min(1, 'Product ID là bắt buộc'),
  quantity: z.number().min(1, 'Số lượng phải ít nhất là 1').default(1),
  price: z.number().min(1000, 'Giá trị phải lớn hơn hoặc bằng 1.000').default(1000)
});

export const orderSchema = z.object({
  id: z.string().optional(),
  total: z.any(),
  status: z.nativeEnum(OrderStatus),
  userId: z.string().min(1, 'User ID là bắt buộc'),
  paymentId: z.string().min(1, 'Payment ID là bắt buộc'),
  orderItems: z.array(orderItemSchema),
  delivery: deliverySchema.optional()
});

export const voucherSchema = z.object({
  id: z.string().optional(),
  tag: z.string().optional(),
  name: z.string().min(1, 'Tên voucher không được để trống'),
  description: z.string().optional(),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.number().min(1, 'Giá trị giảm không hợp lệ'),
  maxDiscount: z.number().min(0, 'Giá trị tối đa không hợp lệ'),
  minOrderPrice: z.number().min(0, 'Giá trị tối thiểu không hợp lệ'),
  quantity: z.number().min(1, 'Số lượng không hợp lệ'),
  applyAll: z.boolean().default(false),
  usedQuantity: z.number().min(0).default(0),
  availableQuantity: z.number().min(0).default(0),
  startDate: z.date(),
  endDate: z.date(),
  vipLevel: z.number().optional(),
  products: productSchema.array().optional()
});
