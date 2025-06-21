import { LocalPaymentType } from '../zod/EnumType';

export const seedPayments = [
  {
    name: 'Thanh toán VnPay',
    tag: 'thanh-toan-vnpay',
    type: LocalPaymentType.E_WALLET,
    provider: 'vnpay',
    isDefault: true
  }
];

export const seedRoles = [
  {
    name: 'SUPER_ADMIN'
  },
  {
    name: 'ADMIN'
  },
  {
    name: 'STAFF'
  },
  {
    name: 'CUSTOMER'
  }
];

export const seedPermissions = [
  { name: 'create_categorys' },
  { name: 'read_categorys' },
  { name: 'update_categorys' },
  { name: 'delete_categorys' },
  { name: 'create_imagess' },
  { name: 'read_imagess' },
  { name: 'update_imagess' },
  { name: 'delete_imagess' },
  { name: 'create_materials' },
  { name: 'read_materials' },
  { name: 'update_materials' },
  { name: 'delete_materials' },
  { name: 'create_orders' },
  { name: 'read_orders' },
  { name: 'update_orders' },
  { name: 'delete_orders' },
  { name: 'create_payments' },
  { name: 'read_payments' },
  { name: 'update_payments' },
  { name: 'delete_payments' },
  { name: 'create_permissions' },
  { name: 'read_permissions' },
  { name: 'update_permissions' },
  { name: 'delete_permissions' },
  { name: 'create_roles' },
  { name: 'read_roles' },
  { name: 'update_roles' },
  { name: 'delete_roles' },
  { name: 'create_products' },
  { name: 'read_products' },
  { name: 'update_products' },
  { name: 'delete_products' },
  { name: 'create_reviews' },
  { name: 'read_reviews' },
  { name: 'update_reviews' },
  { name: 'delete_reviews' },
  { name: 'create_subcategorys' },
  { name: 'read_subcategorys' },
  { name: 'update_subcategorys' },
  { name: 'delete_subcategorys' },
  { name: 'create_users' },
  { name: 'read_users' },
  { name: 'update_users' },
  { name: 'delete_users' },
  { name: 'create_vouchers' },
  { name: 'read_vouchers' },
  { name: 'update_vouchers' },
  { name: 'delete_vouchers' }
];

export const seedCategory = [
  {
    name: 'Món chính',
    tag: 'mon-chinh',
    description:
      'Món chính là phần ăn quan trọng nhất trong mỗi bữa ăn, thường bao gồm cơm, bún, phở, hoặc các món từ thịt, cá, hải sản. Những món này không chỉ cung cấp đầy đủ dinh dưỡng mà còn được chế biến đa dạng theo phong cách ẩm thực khác nhau. Từ những món kho đậm đà, chiên giòn hấp dẫn, cho đến những món canh thanh mát hay nướng thơm lừng, tất cả đều góp phần tạo nên một bữa ăn trọn vẹn. Món chính thường đi kèm với rau củ, nước chấm hoặc sốt đặc trưng để tăng thêm hương vị.'
  },
  {
    name: 'Món chay',
    tag: 'mon-chay',
    description:
      'Món chay mang đến sự thanh đạm nhưng vẫn đầy đủ dinh dưỡng, phù hợp với những ai yêu thích chế độ ăn lành mạnh hoặc theo đạo Phật. Các món chay thường sử dụng nguyên liệu như đậu hũ, nấm, rau củ và các loại hạt để tạo nên hương vị tự nhiên, hấp dẫn. Từ những món xào, kho, luộc cho đến các món giả mặn sáng tạo, ẩm thực chay ngày càng phong phú và được nhiều người ưa chuộng. Không chỉ giúp thanh lọc cơ thể, món chay còn mang đến sự nhẹ nhàng, tinh tế trong từng bữa ăn.'
  },
  {
    name: 'Đồ uống',
    tag: 'do-uong',
    description:
      'Đồ uống đóng vai trò quan trọng trong việc giải khát và bổ sung năng lượng cho cơ thể. Từ những loại nước ép trái cây tươi mát, sinh tố bổ dưỡng, cho đến trà thảo mộc, cà phê hay các loại nước giải khát có gas, mỗi loại đều mang đến một hương vị và công dụng riêng. Đồ uống không chỉ giúp cung cấp vitamin, khoáng chất mà còn có thể kết hợp với các món ăn để tạo nên trải nghiệm ẩm thực trọn vẹn. Bất kể mùa nào trong năm, một ly đồ uống phù hợp sẽ giúp bạn cảm thấy sảng khoái hơn.'
  },
  {
    name: 'Ăn vặt & Tráng miệng',
    tag: 'an-vat-trang-mieng',
    description:
      'Ăn vặt và tráng miệng là phần không thể thiếu đối với những ai yêu thích khám phá ẩm thực. Từ các món bánh ngọt mềm mịn, chè thơm lừng, kem mát lạnh, đến những món ăn vặt đường phố như bánh tráng trộn, cá viên chiên, mỗi món đều mang đến sự hấp dẫn riêng. Những món ăn này không chỉ giúp thỏa mãn vị giác mà còn là lựa chọn hoàn hảo để nhâm nhi cùng bạn bè, người thân. Dù là bữa ăn nhẹ trong ngày hay món tráng miệng sau bữa chính, đây luôn là phần khiến thực khách mong chờ nhất.'
  }
];
