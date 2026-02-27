import {
  IconBrandPolymer,
  IconCategory,
  IconCheese,
  IconCreditCardPay,
  IconDatabaseDollar,
  IconLayoutDashboard,
  IconLock,
  IconMenuOrder,
  IconReport,
  IconSettings,
  IconShoppingBag,
  IconTicket,
  IconUser
} from '@tabler/icons-react';
//admin
export const navItems = [
  { label: 'Tổng quan', icon: IconLayoutDashboard, href: '/admin' },
  {
    label: 'Báo cáo',
    icon: IconDatabaseDollar,
    defaultOpened: true,
    children: [
      { label: 'Báo cáo', icon: IconReport, href: '/admin/reports' },
      { label: 'Analytics', icon: IconReport, href: '/admin/analytics' }
    ]
  },
  {
    label: 'Quản lý sản phẩm',
    icon: IconCheese,

    children: [
      { label: 'Danh mục', icon: IconCategory, href: '/admin/category' },
      { label: 'Mặc hàng', icon: IconCheese, href: '/admin/product' },
      { label: 'Kho hàng', icon: IconCheese, href: '/admin/warehouse' },
      { label: 'Nguyên liệu', icon: IconBrandPolymer, href: '/admin/material' },
      { label: 'Khuyến mãi', icon: IconTicket, href: '/admin/voucher' },
      { label: 'Đánh giá', icon: IconUser, href: '/admin/review' }
    ]
  },
  {
    label: 'Quản lý người dùng',
    icon: IconUser,
    children: [
      { label: 'Người dùng', icon: IconUser, href: '/admin/user' },
      { label: 'Phân quyền', icon: IconUser, href: '/admin/role' }
    ]
  },
  {
    label: 'Quản lý bán hàng',
    icon: IconMenuOrder,
    defaultOpened: true,
    children: [
      { label: 'Đơn bán hàng', icon: IconMenuOrder, href: '/admin/order' },
      { label: 'Hóa đơn', icon: IconMenuOrder, href: '/admin/invoice' },
      { label: 'Liên hệ', icon: IconMenuOrder, href: '/admin/contact' },
      { label: 'Thanh toán', icon: IconCreditCardPay, href: '/admin/payment' }
    ]
  },
  {
    label: 'Cài đặt',
    icon: IconSettings,
    children: [
      { label: 'Hệ thống', icon: IconSettings, href: '/admin/settings' },
      { label: 'Thông báo', icon: IconSettings, href: '/admin/settings/notification' },
      { label: 'Giao diện nâng cao', icon: IconSettings, href: '/admin/settings/theme-advance' }
    ]
  }
];
export const menuUserInfo = [
  { label: 'Thông tin cá nhân', des: 'Xem và cập nhật thông tin cá nhân', href: '/thong-tin', icon: IconUser },
  {
    label: 'Đơn hàng của tôi',
    des: 'Xem và quản lý các đơn hàng',
    href: '/don-hang-cua-toi',
    icon: IconShoppingBag
  },
  { label: 'Đổi mật khẩu', des: 'Đổi mật khẩu người dùng', href: '/password/change-password', icon: IconLock }
];
