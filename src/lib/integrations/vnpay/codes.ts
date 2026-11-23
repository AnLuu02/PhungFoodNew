export const VNPAY_RESPONSE_CODES: Record<
  string,
  {
    title: string;
    description: string;
    userMessage: string;
    type: 'success' | 'failed' | 'warning';
  }
> = {
  '00': {
    title: 'Thanh toán thành công',
    description: 'Giao dịch đã được VNPay ghi nhận thành công.',
    userMessage: 'Đơn hàng của bạn đã được thanh toán. Nhà hàng sẽ tiếp nhận và xử lý đơn trong thời gian sớm nhất.',
    type: 'success'
  },
  '07': {
    title: 'Giao dịch cần kiểm tra',
    description: 'Tài khoản có thể đã bị trừ tiền nhưng giao dịch bị nghi ngờ bất thường.',
    userMessage: 'Vui lòng không thanh toán lại ngay. Hãy kiểm tra trạng thái đơn hoặc liên hệ hỗ trợ.',
    type: 'warning'
  },
  '09': {
    title: 'Chưa đăng ký Internet Banking',
    description: 'Thẻ hoặc tài khoản chưa đăng ký dịch vụ Internet Banking.',
    userMessage: 'Vui lòng đăng ký Internet Banking hoặc chọn phương thức thanh toán khác.',
    type: 'failed'
  },
  '10': {
    title: 'Xác thực không thành công',
    description: 'Bạn đã xác thực thông tin thẻ hoặc tài khoản không đúng quá số lần cho phép.',
    userMessage: 'Vui lòng kiểm tra lại thông tin hoặc thử với tài khoản khác.',
    type: 'failed'
  },
  '11': {
    title: 'Hết hạn thanh toán',
    description: 'Thời gian chờ thanh toán đã hết.',
    userMessage: 'Vui lòng quay lại đơn hàng và tạo lượt thanh toán mới.',
    type: 'failed'
  },
  '12': {
    title: 'Tài khoản bị khóa',
    description: 'Thẻ hoặc tài khoản ngân hàng đang bị khóa.',
    userMessage: 'Vui lòng liên hệ ngân hàng hoặc chọn phương thức khác.',
    type: 'failed'
  },
  '13': {
    title: 'Sai mã OTP',
    description: 'Mã OTP hoặc mật khẩu xác thực giao dịch không chính xác.',
    userMessage: 'Vui lòng thử lại và nhập đúng mã xác thực.',
    type: 'failed'
  },
  '24': {
    title: 'Bạn đã hủy thanh toán',
    description: 'Giao dịch không hoàn tất vì bạn đã hủy tại cổng thanh toán.',
    userMessage: 'Đơn hàng vẫn chưa được thanh toán. Bạn có thể thanh toán lại khi cần.',
    type: 'failed'
  },
  '51': {
    title: 'Không đủ số dư',
    description: 'Tài khoản không đủ số dư để thực hiện giao dịch.',
    userMessage: 'Vui lòng nạp thêm tiền hoặc chọn tài khoản khác.',
    type: 'failed'
  },
  '65': {
    title: 'Vượt hạn mức giao dịch',
    description: 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày.',
    userMessage: 'Vui lòng thử lại sau hoặc liên hệ ngân hàng để điều chỉnh hạn mức.',
    type: 'failed'
  },
  '75': {
    title: 'Ngân hàng đang bảo trì',
    description: 'Ngân hàng thanh toán đang bảo trì hệ thống.',
    userMessage: 'Vui lòng thử lại sau hoặc chọn ngân hàng khác.',
    type: 'failed'
  },
  '79': {
    title: 'Sai mật khẩu quá số lần',
    description: 'Bạn đã nhập sai mật khẩu thanh toán quá số lần quy định.',
    userMessage: 'Vui lòng thử lại sau hoặc liên hệ ngân hàng.',
    type: 'failed'
  },
  '99': {
    title: 'Thanh toán không thành công',
    description: 'Giao dịch gặp lỗi khác từ hệ thống VNPay.',
    userMessage: 'Vui lòng thử lại sau. Nếu tài khoản đã bị trừ tiền, hãy liên hệ hỗ trợ.',
    type: 'failed'
  }
};

export const VNPAY_TRANSACTION_STATUS: Record<string, string> = {
  '00': 'Giao dịch thành công',
  '01': 'Giao dịch chưa hoàn tất',
  '02': 'Giao dịch bị lỗi',
  '04': 'Giao dịch đảo',
  '05': 'VNPay đang xử lý giao dịch hoàn tiền',
  '06': 'VNPay đã gửi yêu cầu hoàn tiền sang ngân hàng',
  '07': 'Giao dịch bị nghi ngờ gian lận',
  '09': 'Giao dịch hoàn trả bị từ chối'
};

export const getVnpayResponseInfo = (code?: string) => {
  if (!code) return VNPAY_RESPONSE_CODES['99'];

  return (
    VNPAY_RESPONSE_CODES[code] || {
      title: 'Không xác định được kết quả thanh toán',
      description: `VNPay trả về mã không nằm trong mapping hiện tại: ${code}`,
      userMessage: 'Vui lòng kiểm tra lại trạng thái đơn hàng hoặc liên hệ hỗ trợ.',
      type: 'warning' as const
    }
  );
};
