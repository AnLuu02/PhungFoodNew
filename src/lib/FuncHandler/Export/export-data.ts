import dayjs from '~/lib/dayjs';
import { db } from '~/server/db';
import { findCategoryService } from '~/server/services/category.service';
import { findContactService } from '~/server/services/contact.service';
import { findMaterialService } from '~/server/services/material.service';
import { findOrderService } from '~/server/services/order.service';
import { findProductService } from '~/server/services/product.service';
import { findReviewService } from '~/server/services/review.service';
import { findSubCategoryService } from '~/server/services/subCategory.service';
import { findUserService } from '~/server/services/user.service';
import { findVoucherService } from '~/server/services/voucher.service';
import { formatPriceLocaleVi } from '../Format';

export async function getUserData({ limit, page, s }: { limit: number; page: number; s?: string }) {
  const data = await findUserService(db, {
    limit,
    page,
    s
  });
  return data.users.map(item => ({
    'Mã định danh': item.id,
    'Khách hàng': item.name,
    'Email khách hàng': item.email,
    'Giới tính': item.gender,
    'Số điện thoại': item?.phone ?? 'Đang cập nhật',
    'Địa chỉ': item.address?.fullAddress ?? 'Đang cập nhật',
    'Cấp thành viên': item.level,
    'Vai trò': item.role?.name,
    'Số lượng đơn hàng': item.orders.length ?? 0 + ' đơn',
    'Ngày tạo': dayjs(item.createdAt).format('DD-MM-YYYY')
  }));
}
export async function getOrderData({ limit, page, s }: { limit: number; page: number; s?: string }) {
  const data = await findOrderService(db, {
    limit,
    page,
    s
  });
  return data.orders.map(item => ({
    'Mã đơn': item.id,
    'Khách hàng': item.user.name,
    'Địa chỉ giao hàng': item.delivery?.address?.fullAddress ?? 'Đang cập nhật',
    'Giá gốc': item.originalAmount,
    'Giá cuối cùng': item.finalAmount,
    'Giảm giá': item.discountAmount,
    'Số lượng sản phẩm': (item?.orderItems?.length ?? 0) + ' món',
    'Ngày đặt': dayjs(item.createdAt).format('DD-MM-YYYY'),
    'Ngày hoàn thành': dayjs(item.updatedAt).format('DD-MM-YYYY')
  }));
}
export async function getProductData({ limit, page, s }: { limit: number; page: number; s?: string }) {
  const data = await findProductService(db, {
    limit,
    page,
    s,
    sort: [],
    'nguyen-lieu': []
  });
  return data.products.map(item => ({
    ID: item.id,
    'Tên sản phẩm': item.name,
    'Mô tả': item.description,
    'Giá sản phẩm': formatPriceLocaleVi(item.price),
    'Đánh giá': item.rating + ' sao',
    'Giảm giá': formatPriceLocaleVi(item.discount),
    'Số lương khả dụng': item.availableQuantity,
    'Đã bán': item.soldQuantity,
    'Nguyên liệu': item.materials.map((m, index) => (index === item.materials.length - 1 ? m.name : m.name + ', ')),
    'Thuộc danh mục': item.subCategory?.name ?? 'Đang cập nhật',
    'Ngày tạo': dayjs(item.createdAt).format('DD-MM-YYYY')
  }));
}
export async function getReviewData({ limit, page, s }: { limit: number; page: number; s?: string }) {
  const data = await findReviewService(db, {
    limit,
    page,
    s
  });
  return data.reviews.map(item => ({
    ID: item.id,
    'Người dùng': item.user.name,
    'Email người dùng': item.user.email,
    'Bình luận': item.comment,
    'Đánh giá': item.rating + ' sao',
    'Sản phẩm đánh giá': item.product.name,
    'ID sản phẩm': item.product.id,
    'Ngày tạo': dayjs(item.createdAt).format('DD-MM-YYYY')
  }));
}
export async function getMaterialData({ limit, page, s }: { limit: number; page: number; s?: string }) {
  const data = await findMaterialService(db, {
    limit,
    page,
    s
  });
  return data.materials.map(item => ({
    ID: item.id,
    Tên: item.name,
    'Mô tả': item.description,
    'Danh mục': item.category,
    'Ngày tạo': dayjs(item.createdAt).format('DD-MM-YYYY')
  }));
}
export async function getCategoriesData({ limit, page, s }: { limit: number; page: number; s?: string }) {
  const data = await findCategoryService(db, {
    limit,
    page,
    s
  });
  return data.categories.map(item => ({
    'Mã Danh Mục': item.id,
    'Tên Danh Mục': item.name,
    'Mô tả': item.description,
    'Ngày tạo': dayjs(item.createdAt).format('DD-MM-YYYY')
  }));
}

export async function getSubCategoriesData({ limit, page, s }: { limit: number; page: number; s?: string }) {
  const data = await findSubCategoryService(db, {
    limit,
    page,
    filters: {
      s
    }
  });
  return data.subCategories.map(item => ({
    'Mã Danh Mục Con': item.id,
    'Tên Danh Mục Con': item.name,
    'Thuộc danh mục': item.category.name,
    'Mô tả': item.description,
    'Ngày tạo': dayjs(item.createdAt).format('DD-MM-YYYY')
  }));
}
export async function getContactData({ limit, page, s }: { limit: number; page: number; s?: string }) {
  const data = await findContactService(db, {
    limit,
    page,
    s
  });
  return data.contacts.map(item => ({
    'Tên Người dùng': item.fullName,
    'Email Người dùng': item.email,
    'Số điện thoại Người dùng': item.phone,
    'Nội dung': item.message,
    Loại: item.type,
    'Trạng thái': item.responded ? 'Đang phản hồi' : 'Chờ xử lý',
    'Ngày gửi': dayjs(item.createdAt).format('DD-MM-YYYY')
  }));
}

export async function getVoucherData({ limit, page, s }: { limit: number; page: number; s?: string }) {
  const data = await findVoucherService(db, {
    limit,
    page,
    filters: {
      s,
      status: []
    }
  });
  return data.vouchers.map(item => ({
    ID: item.id,
    Tên: item.name,
    Mã: item.code,
    'Đơn tối thiểu': formatPriceLocaleVi(item.minOrderPrice),
    'Giảm giá tối đa': formatPriceLocaleVi(item.maxDiscount),
    'Giá trị giảm giá': item.type === 'FIXED' ? formatPriceLocaleVi(item.discountValue) : item.discountValue + '%',
    Loại: item.type === 'FIXED' ? 'Tiền mặt' : 'Phần trăm',
    'Mô tả': item.description,
    'Ngày bắt đầu': dayjs(item.startDate).format('DD-MM-YYYY'),
    'Ngày kết thúc': dayjs(item.endDate).format('DD-MM-YYYY'),
    'Số lượng': item.quantity,
    'Số lượng cho người dùng': item.quantityForUser,
    'Đã dùng': item.usedQuantity
  }));
}
