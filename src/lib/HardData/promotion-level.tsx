import { UserLevel } from '@prisma/client';
import { IconAward, IconCrown, IconSparkles, IconStar, IconTrophy } from '@tabler/icons-react';
export const promotionLevels = {
  [UserLevel.BRONZE]: {
    name: 'Đồng',
    color: '#3F2627',
    bg: '#3F262722',
    icon: IconStar,
    range: '0 - 999 điểm',
    features: ['Giảm giá 5%', 'Tặng món tráng miệng sinh nhật', 'Ưu đãi hàng tuần'],
    className: 'md:w-[30%] w-[80vw] sm:w-[45%] lg:w-[19%] flex-shrink-0 md:scale-90 hover:bg-[#3F262722]',
    badge: undefined
  },
  [UserLevel.SILVER]: {
    name: 'Bạc',
    color: '#64707A',
    bg: '#64707A22',
    icon: IconTrophy,
    range: '1,000 - 2,999 điểm',
    features: [
      'Giảm giá 10%',
      'Giao hàng miễn phí cho đơn hàng từ 150.000 VND trở lên',
      'Hỗ trợ ưu tiên',
      'Cuối tuần nhân đôi điểm'
    ],
    className: 'md:w-[30%] w-[80vw] sm:w-[45%] lg:w-[19%] flex-shrink-0 md:scale-95 hover:bg-[#64707A22]',
    badge: undefined
  },
  [UserLevel.GOLD]: {
    name: 'Vàng',
    color: '#FACC15',
    bg: 'bg-yellow-50',
    icon: IconCrown,
    range: '3,000 - 7,999 điểm',
    features: ['15% giảm giá', 'Miễn phí vận chuyển', 'Hỗ trợ trực tiếp', 'Monthly free meal', 'Exclusive events'],
    className:
      'md:w-[30%] w-[80vw] sm:w-[45%] lg:w-[19%] flex-shrink-0 lg:scale-105 bg-yellow-50 dark:bg-yellow-900 hover:bg-yellow-100 dark:hover:bg-yellow-800',
    badge: { text: 'Phổ biến', className: 'bg-yellow-100 text-yellow-500' }
  },
  [UserLevel.PLATINUM]: {
    name: 'Bạch kim',
    color: '#4183A7',
    bg: '#4183A722',
    icon: IconAward,
    range: '8,000 - 14,999 điểm',
    features: [
      'Giảm giá 20%',
      'Giao hàng ưu tiên',
      'Quản lý tận tâm',
      '2 bữa ăn miễn phí/tháng',
      'Sự kiện bàn đầu bếp',
      'Đồng sáng tạo thực đơn'
    ],
    className: 'md:w-[30%] w-[80vw] sm:w-[45%] lg:w-[19%] flex-shrink-0 md:scale-95 hover:bg-[#4183A722]',
    badge: { text: 'Ưu tú', className: 'bg-[#4183A7] text-white' }
  },
  [UserLevel.DIAMOND]: {
    name: 'Kim cương',
    color: '#5F77C3',
    bg: '#5F77C322',
    icon: IconSparkles,
    range: '15,000+ điểm',
    features: [
      'Giảm giá 25%',
      'Giao hàng ngay',
      'Dịch vụ hỗ trợ 24/7',
      'Bữa ăn miễn phí không giới hạn',
      'Ăn tối riêng tư',
      'Ưu đãi VIP hàng năm',
      'Quyền lợi trọn đời'
    ],
    className: 'md:w-[30%] w-[80vw] sm:w-[45%] lg:w-[19%] flex-shrink-0 md:scale-90 hover:bg-[#5F77C322]',
    badge: { text: 'Ưu tú', className: 'bg-[#5F77C3] text-white' }
  }
};
