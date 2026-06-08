'use client';
import { TestimonialItem, TestimonialSection } from '../../../../components/TestimonialSection';

const promotionTestimonials: TestimonialItem[] = [
  {
    name: 'Nguyễn Hải Nam',
    description: 'Khách hàng thân thiết',
    avatar: '/images/webp/avatar-default-person.',
    badge: 'Thành viên Vàng',
    badgeClassName: 'w-fit bg-yellow-500/12 text-yellow-700 dark:text-yellow-300',
    content:
      'Tôi đặt món khá thường xuyên nên phần tích điểm rất có ích. Mọi thứ rõ ràng, dễ theo dõi và các voucher đổi được đều dùng thực tế.',
    meta: [
      { label: 'đánh giá', value: '5.0' },
      { label: 'tiết kiệm', value: 4000000 },
      { label: 'đã đặt', value: '38 đơn' }
    ]
  },
  {
    name: 'Nguyễn Thùy Linh',
    description: 'Nhân viên văn phòng',
    avatar: '/images/webp/avatar-default-person.',
    badge: 'Thành viên Bạc',
    badgeClassName: 'w-fit bg-slate-500/12 text-slate-700 dark:text-slate-200',
    content:
      'Sau mỗi lần đặt đều thấy điểm được cộng vào tài khoản. Tôi không cần nhớ quá nhiều mã giảm giá vì hệ thống đã gợi ý ưu đãi phù hợp.',
    meta: [
      { label: 'đánh giá', value: '4.9' },
      { label: 'tiết kiệm', value: 1250000 },
      { label: 'đã đặt', value: '21 đơn' }
    ]
  },
  {
    name: 'Lưu Trường An',
    description: 'Đặt món cho gia đình',
    avatar: '/images/webp/avatar-default-person.',
    badge: 'Thành viên Vàng',
    badgeClassName: 'w-fit bg-yellow-500/12 text-yellow-700 dark:text-yellow-300',
    content:
      'Nhà tôi hay đặt theo phần ăn gia đình nên điểm lên khá nhanh. Phần hạng thành viên làm tôi có cảm giác mình được ghi nhận khi quay lại nhiều lần.',
    meta: [
      { label: 'đánh giá', value: '5.0' },
      { label: 'tiết kiệm', value: 2000000 },
      { label: 'đã đặt', value: '32 đơn' }
    ]
  }
];

export default function PromotionsReviewBlock() {
  return (
    <TestimonialSection
      eyebrow='Niềm tin khách hàng'
      index={5}
      title='Những trải nghiệm khiến khách hàng quay lại.'
      description='Không chỉ là giảm giá. Chương trình thành viên giúp khách hàng thấy rõ giá trị sau mỗi lần đặt món.'
      items={promotionTestimonials}
      cta={{
        title: 'Đặt món hôm nay, bắt đầu tích điểm ngay từ đơn đầu tiên.',
        description: 'Đăng nhập để theo dõi điểm thưởng, hạng thành viên và những ưu đãi phù hợp với bạn.',
        label: 'Tham gia tích điểm',
        href: '/dang-nhap'
      }}
    />
  );
}
