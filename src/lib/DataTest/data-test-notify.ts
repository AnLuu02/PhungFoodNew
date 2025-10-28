import { NotificationAdvanced } from '~/types/notification';

export const notificationData: NotificationAdvanced[] = [
  {
    id: '1',
    title: 'Chào mừng đến với nhà hàng của chúng tôi!',
    message:
      'Cảm ơn bạn đã tham gia cùng chúng tôi. Tận hưởng ưu đãi giảm giá 20% cho đơn hàng đầu tiên với mã WELCOME20',
    type: 'info',
    recipient: 'individual',
    recipientDetails: 'john.doe@email.com',
    priority: 'medium',
    channels: ['push', 'email'],
    status: 'delivered',
    sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    tags: ['welcome', 'promotion'],
    analytics: { sent: 1, delivered: 1, read: 1, clicked: 0 }
  },
  {
    id: '2',
    title: 'Xác nhận đơn hàng #12345',
    message: 'Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị. Thời gian giao hàng dự kiến: 30 phút',
    type: 'success',
    recipient: 'individual',
    recipientDetails: 'jane.smith@email.com',
    priority: 'high',
    channels: ['push', 'sms'],
    status: 'delivered',
    sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    tags: ['order', 'confirmation'],
    analytics: { sent: 1, delivered: 1, read: 1, clicked: 1 }
  },
  {
    id: '3',
    title: 'Ưu đãi đặc biệt cuối tuần',
    message: 'Đừng bỏ lỡ ưu đãi cuối tuần của chúng tôi! Giảm giá 30% cho tất cả các món mì ống. Áp dụng đến Chủ Nhật.',
    type: 'warning',
    recipient: 'all',
    recipientDetails: 'All customers',
    priority: 'medium',
    channels: ['push', 'email', 'in-app'],
    status: 'sent',
    sentAt: new Date(Date.now() - 30 * 60 * 1000),
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    tags: ['promotion', 'weekend'],
    analytics: { sent: 1250, delivered: 1180, read: 890, clicked: 234 }
  },
  {
    id: '4',
    title: 'Bảo trì theo lịch trình',
    message:
      'Ứng dụng của chúng tôi sẽ được bảo trì tối nay từ 2 giờ sáng đến 4 giờ sáng. Chúng tôi xin lỗi vì sự bất tiện này.',
    type: 'error',
    recipient: 'all',
    recipientDetails: 'All customers',
    priority: 'high',
    channels: ['push', 'email'],
    status: 'scheduled',
    scheduledAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
    createdAt: new Date(),
    tags: ['maintenance', 'system'],
    analytics: { sent: 0, delivered: 0, read: 0, clicked: 0 }
  }
];

export const notifyTemplateData = [
  {
    id: 'welcome',
    name: 'Tin nhắn chào mừng',
    title: 'Chào mừng đến với nhà hàng của chúng tôi!',
    message:
      'Cảm ơn bạn đã tham gia cùng chúng tôi. Hãy tận hưởng ưu đãi giảm giá {{discount}}% cho đơn hàng đầu tiên của bạn với mã {{code}}',
    type: 'info',
    category: 'onboarding',
    variables: ['discount', 'code']
  },
  {
    id: 'order-confirm',
    name: 'Xác nhận đơn hàng',
    title: 'Xác nhận đơn hàng #{{orderNumber}}',
    message:
      'Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị. Thời gian giao hàng dự kiến: {{estimatedTime}} phút',
    type: 'success',
    category: 'orders',
    variables: ['orderNumber', 'estimatedTime']
  },
  {
    id: 'promotion',
    name: 'Khuyến mại',
    title: 'Ưu đãi đặc biệt dành riêng cho bạn!',
    message: 'Đừng bỏ lỡ! Giảm giá {{discount}}% cho {{items}}. Sử dụng mã {{promoCode}}. Có hiệu lực đến {{expiry}}.',
    type: 'warning',
    category: 'marketing',
    variables: ['discount', 'items', 'promoCode', 'expiry']
  },
  {
    id: 'delivery-update',
    name: 'Cập nhật giao hàng',
    title: 'Đơn hàng của bạn đang trên đường vận chuyển!',
    message: 'Đơn hàng số {{orderNumber}} của bạn đang được giao. Theo dõi đơn hàng của bạn: {{trackingLink}}',
    type: 'info',
    category: 'orders',
    variables: ['orderNumber', 'trackingLink']
  }
];
