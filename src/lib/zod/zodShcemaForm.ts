import { AddressType, EntityType, ImageType, OrderStatus, PaymentType, ProductStatus } from '@prisma/client';
import { z } from 'zod';
import { LocalAddressType, LocalGender, LocalProductStatus, LocalUserLevel } from './EnumType';
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
  tag: z.string().optional(),
  name: z.string().min(1, 'Tên không được để trống'),
  description: z.string().optional()
});

export const subCategorySchema = z.object({
  id: z.string().optional(),
  tag: z.string().optional(),
  name: z.string().min(1, 'Tên không được để trống'),
  description: z.string().optional(),
  categoryId: z.string(),
  thumbnail: imageSchema.optional()
});

export const paymentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Tên không được để trống'),
  tag: z.string().optional(),
  type: z.nativeEnum(PaymentType),
  provider: z.string().optional(),
  isDefault: z.boolean().default(false)
});

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Tên sản phẩm không được để trống'),
  description: z.string().optional(),
  descriptionDetail: z.array(
    z.object({
      label: z.string().min(1, 'Label không được bỏ trống'),
      value: z.string().min(1, 'Value không được bỏ trống')
    })
  ),
  region: z.string().min(1, 'Món ăn này là của miền nào đây?'),
  tag: z.string().optional(),
  tags: z.array(z.string()),
  status: z.nativeEnum(ProductStatus).default(LocalProductStatus.ACTIVE),
  price: z.number().min(10000, 'Giá trị phải lớn hơn hoặc bằng 10.000').default(10000),
  discount: z.number().min(0, 'Giá trị không được nhỏ hơn 0').optional().default(0),
  thumbnail: z.instanceof(File).optional(),
  gallery: z.array(z.instanceof(File)).optional(),
  subCategoryId: z.string().optional(),
  rating: z.number().optional(),
  totalRating: z.number().optional(),
  soldQuantity: z.number().optional(),
  availableQuantity: z.number().optional(),
  materials: z.array(z.string()).optional()
});

export const addressSchema = z.object({
  id: z.string().optional(),

  type: z.nativeEnum(AddressType).default(LocalAddressType.USER),

  provinceId: z.string({ required_error: 'Tỉnh/thành phố là bắt buộc' }).min(1, 'Tỉnh/thành phố là bắt buộc'),
  districtId: z.string({ required_error: 'Quận/huyện là bắt buộc' }).min(1, 'Quận/huyện là bắt buộc'),
  wardId: z.string({ required_error: 'Phường/xã là bắt buộc' }).min(1, 'Phường/xã là bắt buộc'),

  province: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),

  detail: z
    .string({ required_error: 'Chi tiết địa chỉ không được để trống' })
    .min(1, 'Chi tiết địa chỉ không được để trống'),

  postalCode: z.string().optional().or(z.literal('')),

  fullAddress: z.string().optional(),

  createdAt: z
    .union([z.string(), z.date()])
    .transform(val => (val ? new Date(val) : undefined))
    .optional(),
  updatedAt: z
    .union([z.string(), z.date()])
    .transform(val => (val ? new Date(val) : undefined))
    .optional()
});

export const deliverySchema = z.object({
  id: z.string().optional(),

  name: z.string({ required_error: 'Tên người nhận là bắt buộc' }).min(1, 'Tên người nhận là bắt buộc'),

  email: z.string({ required_error: 'Email là bắt buộc' }).email({ message: 'Email không hợp lệ' }),

  phone: z
    .string({ required_error: 'Số điện thoại là bắt buộc' })
    .regex(/^\d{10}$/, 'Số điện thoại phải có 10 chữ số')
    .or(z.literal('')),

  address: addressSchema,

  note: z.string().optional(),

  orderId: z.string({ required_error: 'Order ID là bắt buộc' }).min(1, 'Order ID là bắt buộc'),

  updatedAt: z
    .union([z.string(), z.date()])
    .transform(val => (val ? new Date(val) : undefined))
    .optional()
});
export const reviewSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
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
  originalTotal: z.number().default(0),
  discountAmount: z.number().default(0),
  finalTotal: z.number().default(0),
  status: z.nativeEnum(OrderStatus),
  userId: z.string().min(1, 'Ai là người mua hàng?'),
  paymentId: z.string().min(1, 'Chọn phương thức thanh toán'),
  orderItems: z.array(orderItemSchema),
  delivery: deliverySchema
});

export const voucherSchema = z
  .object({
    id: z.string().optional(),
    tag: z.string().optional(),
    name: z.string().min(1, 'Tên voucher không được để trống'),
    description: z.string().optional(),
    type: z.enum(['PERCENTAGE', 'FIXED']),
    code: z.string().min(1, 'Mã khuyên mái là bắt buộc'),
    status: z.enum(['ENABLED', 'DISABLED']),
    discountValue: z.number().min(1, 'Giá trị giảm không hợp lệ'),
    maxDiscount: z.number().min(0, 'Giá trị tối đa không hợp lệ'),
    minOrderPrice: z.number().min(0, 'Giá trị tối thiểu không hợp lệ'),
    quantity: z.number().min(1, 'Số lượng không hợp lệ'),
    quantityForUser: z.number().default(1),
    applyAll: z.boolean().default(true),
    usedQuantity: z.number().min(0).default(0),
    availableQuantity: z.number().min(0).default(0),
    startDate: z.date({ required_error: 'Hãy chọn ngày bắt đầu khuyến mãi' }),
    endDate: z.date({ required_error: 'Hãy chọn ngày kết thúc khuyến mãi' }),
    pointUser: z.number().default(-1).optional()
  })
  .refine(data => data.endDate > data.startDate, {
    message: 'Ngày kết thúc phải sau ngày bắt đầu',
    path: ['endDate']
  });

export const materialSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Tên không được để trống'),
  tag: z.string().optional(),
  description: z.string().optional(),
  category: z.string().min(1, 'Danh mục không được để trống')
});

export const restaurantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Tên nhà hàng là bắt buộc'),
  address: z.string().min(1, 'Địa chỉ là bắt buộc'),
  phone: z.string().min(1, 'Số điện thoại không được để trống'),
  email: z.string().email('Email không hợp lệ').optional(),
  description: z.string().optional(),
  logo: imageSchema.optional(),
  website: z.string().optional(),
  socials: z.array(
    z.object({
      key: z.string(),
      url: z.string()
    })
  ),
  isClose: z.boolean().optional(),
  openedHours: z.string().optional(),
  closedHours: z.string().optional()
});

export const bannerSchema = z.object({
  id: z.string().optional(),
  banner1: z.instanceof(File).nullable().optional(),
  banner2: z.instanceof(File).nullable().optional(),
  gallery: z.array(z.instanceof(File)).optional(),
  startDate: z.date().optional(),
  isActive: z.boolean().default(false),
  endDate: z.date().optional()
});

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Tên không được để trống'),
  email: z.string().email({ message: 'Email không hợp lệ (vd: example@gmail.com)' }),
  image: imageSchema.optional(),
  gender: z.nativeEnum(LocalGender).default(LocalGender.OTHER),
  roleId: z.string().optional(),
  dateOfBirth: z.date().optional(),
  password: z
    .string()
    .min(6, { message: 'Tối thiểu 6 ký tự' })
    .regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])/, {
      message: 'Mật khẩu phải đủ mạnh (hoa, thường, số, đặc biệt)'
    }),
  address: addressSchema.optional(),
  pointUser: z.number().default(0),
  level: z.nativeEnum(LocalUserLevel).default(LocalUserLevel.BRONZE)
});

export const notificationSchema = z.object({
  id: z.string().optional(),
  userId: z.array(z.string()).optional(),
  title: z.string().optional(),
  message: z.string().optional(),
  isRead: z.boolean().optional(),
  isSendToAll: z.boolean().optional()
});
