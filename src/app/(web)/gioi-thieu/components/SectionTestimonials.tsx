import { TestimonialItem, TestimonialSection } from '~/components/TestimonialSection';

const aboutTestimonials: TestimonialItem[] = [
  {
    name: 'Trần Minh Anh',
    description: 'Khách đặt món tại Cà Mau',
    avatar: '/images/webp/avatar-default-person.webp',
    badge: 'Khách quen',
    content:
      'Điều tôi thích là món ăn được chuẩn bị ổn định, khẩu vị dễ ăn và đóng gói cẩn thận. Những lần đặt sau vẫn giữ được chất lượng như lần đầu.',
    meta: [
      { label: 'đánh giá', value: '5.0' },
      { label: 'lần đặt', value: '18+' }
    ]
  },
  {
    name: 'Phạm Quốc Huy',
    description: 'Đặt cơm trưa văn phòng',
    avatar: '/images/webp/avatar-default-person.webp',
    badge: 'Đặt định kỳ',
    content:
      'Tôi thường đặt vào giờ trưa nên cần nhanh và rõ ràng. Menu dễ chọn, phần ăn vừa đủ và thời gian giao khá ổn định.',
    meta: [
      { label: 'đánh giá', value: '4.8' },
      { label: 'lần đặt', value: '24+' }
    ]
  },
  {
    name: 'Ngọc Hân',
    description: 'Đặt món cho gia đình',
    avatar: '/images/webp/avatar-default-person.webp',
    badge: 'Gia đình',
    content:
      'Các món phù hợp cho cả người lớn và trẻ nhỏ. Tôi thích cách quán giữ sự gần gũi trong món ăn thay vì làm mọi thứ quá cầu kỳ.',
    meta: [
      { label: 'đánh giá', value: '5.0' },
      { label: 'lần đặt', value: '15+' }
    ]
  }
];

export default function AboutReviewBlock() {
  return (
    <TestimonialSection
      eyebrow='Cảm nhận thực tế'
      title='Khách hàng nhớ đến Phụng Food vì sự ổn định.'
      index={8}
      description='Từ khẩu vị, cách đóng gói đến trải nghiệm đặt món, chúng tôi muốn mỗi lần quay lại đều quen thuộc và đáng tin.'
      items={aboutTestimonials}
      variant='minimal'
      cta={{
        title: 'Xem thực đơn hôm nay của Phụng Food.',
        description: 'Chọn món phù hợp cho bữa ăn cá nhân, văn phòng hoặc gia đình.',
        label: 'Xem thực đơn',
        href: '/thuc-don'
      }}
    />
  );
}
