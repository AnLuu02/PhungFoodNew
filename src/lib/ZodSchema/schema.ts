import { AddressType, EntityType, ImageType, OrderStatus } from '@prisma/client';
import { z } from 'zod';
import { LocalAddressType, LocalGender, LocalUserLevel } from './enum';
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
  isActive: z.boolean().default(true),
  tag: z.string().optional(),
  name: z.string({ required_error: 'Tên danh mục là bắt buộc' }).min(1, 'Tên không được để trống'),
  description: z.string().optional()
});

export const subCategorySchema = z.object({
  id: z.string().optional(),
  tag: z.string().optional(),
  isActive: z.boolean().default(true),
  name: z.string({ required_error: 'Tên danh mục con là bắt buộc' }).min(1, 'Tên không được để trống'),
  description: z.string().optional(),
  categoryId: z.string(),
  thumbnail: imageSchema.optional()
});

export const paymentSchema = z.object({
  id: z.string(),
  provider: z.string({ required_error: 'Provider name is required' }).min(1, 'Provider name is required'),
  name: z.string({ required_error: 'Name is required' }).min(1, 'Name is required'),
  apiKey: z.string().optional(),
  secretKey: z.string().optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  webhookUrl: z.string().optional(),
  webhookSecret: z.string().optional(),
  isSandbox: z.boolean().default(true),
  isActive: z.boolean().default(true),
  metadata: z.any().optional()
});

export const productSchema = z
  .object({
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
    thumbnail: z.instanceof(File).optional(),
    gallery: z.array(z.instanceof(File)).optional(),
    subCategoryId: z.string({ required_error: 'Hãy chọn danh mục sản phẩm' }).min(1, 'Hãy chọn danh mục sản phẩm'),
    rating: z.number().optional(),
    totalRating: z.number().optional(),
    soldQuantity: z.coerce.number().min(0, 'Số lượng đã bán không được âm'),
    availableQuantity: z.coerce.number().min(0, 'Số lượng khả dụng không được âm'),
    materials: z.array(z.string()).optional()
  })
  .refine(data => data.soldQuantity <= data.availableQuantity, {
    message: 'Không thể bán nhiều hơn số lượng còn lại',
    path: ['soldQuantity']
  });

//
export const baseAddressSchema = z.object({
  id: z.string().optional().nullable(),
  type: z.nativeEnum(AddressType).default(LocalAddressType.USER),
  provinceId: z.string().optional().nullable(),
  districtId: z.string().optional().nullable(),
  wardId: z.string().optional().nullable(),
  province: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  ward: z.string().optional().nullable(),
  detail: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable().or(z.literal('')),
  fullAddress: z.string().optional().nullable()
});

export const deliveryAddressSchema = baseAddressSchema.extend({
  provinceId: z.string({ required_error: 'Tỉnh/thành phố là bắt buộc' }).min(1, 'Tỉnh/thành phố là bắt buộc'),
  districtId: z.string({ required_error: 'Quận/huyện là bắt buộc' }).min(1, 'Quận/huyện là bắt buộc'),
  wardId: z.string({ required_error: 'Phường/xã là bắt buộc' }).min(1, 'Phường/xã là bắt buộc'),
  detail: z
    .string({ required_error: 'Chi tiết địa chỉ không được để trống' })
    .min(1, 'Chi tiết địa chỉ không được để trống')
});

export const deliverySchema = z.object({
  id: z.string().optional(),

  name: z.string({ required_error: 'Tên người nhận là bắt buộc' }).min(1, 'Tên người nhận là bắt buộc'),

  email: z.string({ required_error: 'Email là bắt buộc' }).email({ message: 'Email không hợp lệ' }),

  phone: z.string({ required_error: 'Số điện thoại là bắt buộc' }).regex(/^\d{10}$/, 'Số điện thoại phải có 10 chữ số'),
  address: deliveryAddressSchema,

  note: z.string().optional()
});
export const reviewSchema = z.object({
  id: z.string().optional(),
  userId: z.string({ required_error: 'Ai là người đánh giá?' }).min(1, 'Ai là người đánh giá?'),
  productId: z.string({ required_error: 'Product ID là bắt buộc' }).min(1, 'Product ID không được để trống'),
  rating: z.number({ required_error: 'Rating là bắt buộc' }).min(0).max(5, 'Rating phải trong khoảng 0-5'),
  comment: z.string({ required_error: 'Bình luận là bắt buộc' }).min(1, 'Bình luận không được để trống')
});

export const orderItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string({ required_error: 'Product ID là bắt buộc' }).min(1, 'Product ID là bắt buộc'),
  quantity: z.coerce.number({ required_error: 'Số lượng là bắt buộc' }).min(1, 'Số lượng phải ít nhất là 1'),
  price: z
    .number({ required_error: 'Giá trị phải lớn hơn hoặc bằng 1.000' })
    .min(1000, 'Giá trị phải lớn hơn hoặc bằng 1.000')
    .default(1000)
});

export const orderSchema = z.object({
  id: z.string().optional(),
  originalTotal: z.number().default(0),
  discountAmount: z.number().default(0),
  finalTotal: z.number().default(0),
  status: z.nativeEnum(OrderStatus),
  userId: z.string({ required_error: 'Ai là người mua hàng?' }).min(1, 'Ai là người mua hàng?'),
  paymentId: z.string({ required_error: 'Chọn phương thức thanh toán' }).min(1, 'Chọn phương thức thanh toán'),
  orderItems: z.array(orderItemSchema),
  delivery: deliverySchema
});

export const voucherSchema = z
  .object({
    id: z.string().optional(),
    tag: z.string().optional(),
    name: z.string({}).min(1, 'Tên voucher không được để trống'),
    description: z.string().optional(),
    type: z.enum(['PERCENTAGE', 'FIXED']),
    code: z.string({ required_error: 'Mã khuyên mái là bắt buộc' }).min(1, 'Mã khuyên mái là bắt buộc'),
    isActive: z.boolean().default(true),
    discountValue: z.number({ required_error: 'Giá trị giảm là bắt buộc' }).min(1, 'Giá trị giảm không hợp lệ'),
    maxDiscount: z.number({ required_error: 'Giá trị tối đa là bắt buộc' }).min(0, 'Giá trị tối đa không hợp lệ'),
    minOrderPrice: z
      .number({ required_error: 'Giá trị tối thiểu là bắt buộc' })
      .min(0, 'Giá trị tối thiểu không hợp lệ'),
    quantity: z.number({ required_error: 'Số lượng là bắt buộc' }).min(1, 'Số lượng không hợp lệ'),
    quantityForUser: z.number().default(1),
    applyAll: z.boolean().default(true),
    usedQuantity: z.number({ required_error: 'Số lượng đã dùng la bắt buộc' }).min(0).default(0),
    availableQuantity: z.number({ required_error: 'Số lượng hệ thống la bắt buộc' }).min(0).default(0),
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
  name: z.string({ required_error: 'Tên là bắt buộc' }).min(1, 'Tên không được để trống'),
  tag: z.string().optional(),
  description: z.string().optional(),
  category: z.string({ required_error: 'Danh mục là bắt buộc' }).min(1, 'Danh mục không được để trống')
});

export const invoiceSchema = z.object({
  id: z.string(),
  orderId: z.string({ required_error: 'Hóa đơn cho đơn hàng nào?' }).min(1, 'Hóa đơn cho đơn hàng nào?'),
  salerId: z.string({ required_error: 'Ai là người lập hóa đơn?' }).min(1, 'Ai là người lập hóa đơn?'),
  invoiceNumber: z.string({ required_error: 'Số hóa đơn là bắt buộc' }).min(1, 'Số hóa đơn không hợp lệ'),
  status: z.string().default('PAID'),
  currency: z.string().default('VND'),
  taxCode: z.string().optional()
});
export const themeSchema = z.object({
  id: z.string().optional(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  themeMode: z.string().default('light'),
  fontFamily: z.string().optional().nullable(),
  borderRadius: z.string().optional().nullable(),
  faviconUrl: z.string().optional().nullable()
});
export const restaurantSchema = z.object({
  id: z.string().optional(),
  address: z.string({ required_error: 'Địa chỉ là bắt buộc' }).min(1, 'Địa chỉ là bắt buộc'),

  name: z.string({ required_error: 'Tên nhà hàng là bắt buộc' }).min(1, 'Tên nhà hàng là bắt buộc'),

  email: z.string({ required_error: 'Email là bắt buộc' }).email({ message: 'Email không hợp lệ' }),

  phone: z.string({ required_error: 'Số điện thoại là bắt buộc' }).regex(/^\d{10}$/, 'Số điện thoại phải có 10 chữ số'),
  description: z.string().optional(),
  logo: imageSchema.optional(),
  website: z.string().optional(),
  socials: z.array(
    z.object({
      key: z.string(),
      url: z.string()
    })
  ),
  theme: themeSchema.optional(),
  openingHours: z
    .array(
      z.object({
        id: z.string(),
        dayOfWeek: z.string(),
        openTime: z.string().optional(),
        viNameDay: z.string(),
        closeTIme: z.string().optional(),
        isClosed: z.boolean()
      })
    )
    .optional()
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
  name: z.string({ required_error: 'Tên người dùng là bắt buộc' }).min(1, 'Tên người dùng là bắt buộc'),

  email: z
    .string({ required_error: 'Email là bắt buộc' })
    .email({ message: 'Email không hợp lệ (vd: example@gmail.com)' }),

  phone: z.string({ required_error: 'Số điện thoại là bắt buộc' }).regex(/^\d{10}$/, 'Số điện thoại phải có 10 chữ số'),
  image: imageSchema.optional(),
  isActive: z.boolean().default(true),
  gender: z.nativeEnum(LocalGender).default(LocalGender.OTHER),
  roleId: z.string().optional(),
  dateOfBirth: z.date().optional(),
  password: z
    .string()
    .min(6, { message: 'Tối thiểu 6 ký tự' })
    .regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])/, {
      message: 'Mật khẩu phải đủ mạnh (hoa, thường, số, đặc biệt)'
    }),
  address: baseAddressSchema.optional().or(z.literal('')),
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

export const contactSchema = z.object({
  id: z.string().optional(),
  fullName: z.string({ required_error: 'Tên người dùng là bắt buộc' }).min(1, 'Tên không được để trống'),
  email: z.string({ required_error: 'Email là bắt buộc' }).email({ message: 'Email không hợp lệ' }),
  phone: z.string({ required_error: 'Số điện thoại là bắt buộc' }).regex(/^\d{10}$/, 'Số điện thoại phải có 10 chữ số'),
  message: z.string({ required_error: 'Nội dung là bắt buộc' }).min(1, 'Nội dung không được để trống'),
  responded: z.boolean().default(false),
  subject: z.string().optional(),
  type: z.enum(['COLLABORATION', 'SUPPORT', 'FEEDBACK', 'OTHER']).default('COLLABORATION')
});
