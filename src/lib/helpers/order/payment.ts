export const responseCodeMessages: Record<string, string> = {
  '00': 'Giao dịch thành công',
  '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)',
  '09': 'Giao dịch không thành công: Tài khoản chưa đăng ký dịch vụ InternetBanking tại ngân hàng',
  '10': 'Giao dịch không thành công: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
  '11': 'Giao dịch không thành công: Đã hết hạn chờ thanh toán. Vui lòng thực hiện lại giao dịch',
  '12': 'Giao dịch không thành công: Thẻ/Tài khoản của khách hàng bị khóa',
  '13': 'Giao dịch không thành công: Nhập sai mật khẩu xác thực giao dịch (OTP)',
  '24': 'Giao dịch không thành công: Khách hàng hủy giao dịch',
  '51': 'Giao dịch không thành công: Tài khoản không đủ số dư',
  '65': 'Giao dịch không thành công: Vượt quá hạn mức giao dịch trong ngày',
  '75': 'Ngân hàng thanh toán đang bảo trì',
  '79': 'Giao dịch không thành công: Nhập sai mật khẩu thanh toán quá số lần quy định',
  '99': 'Lỗi khác (không có trong danh sách mã lỗi đã liệt kê)'
};

export function mapOrderStatusToUIStatus(
  statusOrder: string,
  responseCode: string,
  transactionStatus: string
): 'COMPLETED' | 'UNPAID' | 'SHIPPING' | 'CANCELLED' | 'CONFIRMED' | 'PENDING' | 'ERROR' | 'PAYMENT_FAILED' {
  if (responseCode && responseCode !== '00') {
    return 'PAYMENT_FAILED';
  }

  if (transactionStatus === '01' || transactionStatus === '02') {
    return 'PAYMENT_FAILED';
  }

  switch (statusOrder?.toUpperCase()) {
    case 'COMPLETED':
      return 'COMPLETED';
    case 'PENDING':
      return 'PENDING';
    case 'UNPAID':
      return 'UNPAID';
    case 'SHIPPING':
      return 'SHIPPING';
    case 'CANCELLED':
      return 'CANCELLED';
    case 'CONFIRMED':
      return 'CONFIRMED';
    default:
      if (responseCode === '00' && transactionStatus === '00') {
        return 'PENDING';
      }
      return 'ERROR';
  }
}
export function getVietnameseStatusMessage(status: string, responseCode?: string): { title: string; message: string } {
  switch (status) {
    case 'COMPLETED':
      return {
        title: 'Đơn hàng đã hoàn thành',
        message: 'Đơn hàng của bạn đã được giao thành công. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!'
      };
    case 'PENDING':
      return {
        title: 'Thanh toán thành công',
        message: 'Đơn hàng của bạn đang chờ nhà hàng xác nhận. Chúng tôi sẽ giao hàng trong thời gian sớm nhất.'
      };
    case 'UNPAID':
      return {
        title: 'Đơn hàng chưa thanh toán',
        message:
          'Đơn hàng của bạn chưa được thanh toán. Vui lòng hoàn tất thanh toán để chúng tôi có thể xử lý đơn hàng của bạn nhanh chóng nhất.'
      };
    case 'SHIPPING':
      return {
        title: 'Đơn hàng đang được giao',
        message: 'Đơn hàng của bạn đang trong quá trình giao đến bạn. Vui lòng chờ đợi trong giây lát nhé!'
      };
    case 'CANCELLED':
      return {
        title: 'Đơn hàng đã bị hủy',
        message: 'Đơn hàng của bạn đã bị hủy. Nếu bạn đã thanh toán, chúng tôi sẽ hoàn tiền trong 3-5 ngày làm việc.'
      };
    case 'PAYMENT_FAILED':
      return {
        title: 'Thanh toán thất bại',
        message: responseCode
          ? responseCodeMessages[responseCode] || 'Có lỗi xảy ra trong quá trình thanh toán'
          : 'Thanh toán không thành công'
      };
    case 'CONFIRMED':
      return {
        title: 'Đã xác nhận',
        message: 'Đơn hàng của bạn đã được xác nhận và đang trong quá trình chuẩn bị giao hàng.'
      };
    default:
      return {
        title: 'Có lỗi xảy ra',
        message: 'Đã có lỗi xảy ra với đơn hàng của bạn. Vui lòng liên hệ hỗ trợ khách hàng.'
      };
  }
}
