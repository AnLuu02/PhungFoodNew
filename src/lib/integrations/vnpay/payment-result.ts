import crypto from 'crypto';

export type VnpayRawSearchParams = Record<string, string | string[] | undefined>;

export type PaymentResultType = 'success' | 'failed' | 'warning' | 'invalid' | 'empty';

export type VnpayResult = {
  type: PaymentResultType;
  title: string;
  description: string;
  advice: string;
  isSignatureValid: boolean;
  responseCode?: string;
  transactionStatus?: string;
  orderId?: string;
  amount?: number;
  bankCode?: string;
  cardType?: string;
  payDate?: string;
  transactionNo?: string;
  bankTranNo?: string;
  orderInfo?: string;
  rawParams: Record<string, string>;
};

export const VNPAY_RESPONSE_CODE: Record<
  string,
  {
    title: string;
    description: string;
    advice: string;
    type: Exclude<PaymentResultType, 'empty' | 'invalid'>;
  }
> = {
  '00': {
    title: 'Thanh toán thành công',
    description: 'Giao dịch đã được VNPay ghi nhận thành công.',
    advice: 'Bạn có thể theo dõi trạng thái xử lý đơn hàng trong trang đơn hàng của tôi.',
    type: 'success'
  },
  '07': {
    title: 'Giao dịch cần kiểm tra',
    description: 'Tài khoản đã bị trừ tiền nhưng giao dịch bị nghi ngờ bất thường.',
    advice: 'Không nên tạo lại đơn ngay. Vui lòng chờ hệ thống hoặc liên hệ hỗ trợ kèm mã giao dịch.',
    type: 'warning'
  },
  '09': {
    title: 'Chưa đăng ký Internet Banking',
    description: 'Thẻ hoặc tài khoản chưa đăng ký dịch vụ Internet Banking.',
    advice: 'Vui lòng đăng ký dịch vụ tại ngân hàng hoặc chọn phương thức thanh toán khác.',
    type: 'failed'
  },
  '10': {
    title: 'Xác thực không thành công',
    description: 'Bạn đã xác thực thông tin thẻ hoặc tài khoản không đúng quá số lần cho phép.',
    advice: 'Vui lòng kiểm tra lại thông tin hoặc thử lại bằng tài khoản khác.',
    type: 'failed'
  },
  '11': {
    title: 'Hết hạn thanh toán',
    description: 'Thời gian chờ thanh toán đã hết.',
    advice: 'Vui lòng quay lại đơn hàng và tạo lượt thanh toán mới.',
    type: 'failed'
  },
  '12': {
    title: 'Tài khoản bị khóa',
    description: 'Thẻ hoặc tài khoản ngân hàng đang bị khóa.',
    advice: 'Vui lòng liên hệ ngân hàng hoặc chọn phương thức thanh toán khác.',
    type: 'failed'
  },
  '13': {
    title: 'Sai mã OTP',
    description: 'Mật khẩu xác thực giao dịch hoặc OTP không chính xác.',
    advice: 'Vui lòng thử lại và kiểm tra kỹ mã OTP được gửi từ ngân hàng.',
    type: 'failed'
  },
  '24': {
    title: 'Bạn đã hủy thanh toán',
    description: 'Giao dịch không hoàn tất vì bạn đã hủy tại cổng thanh toán.',
    advice: 'Đơn hàng vẫn chưa được thanh toán. Bạn có thể thanh toán lại khi cần.',
    type: 'failed'
  },
  '51': {
    title: 'Không đủ số dư',
    description: 'Tài khoản không đủ số dư để thực hiện giao dịch.',
    advice: 'Vui lòng nạp thêm tiền hoặc chọn tài khoản khác.',
    type: 'failed'
  },
  '65': {
    title: 'Vượt hạn mức giao dịch',
    description: 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày.',
    advice: 'Vui lòng thử lại sau hoặc liên hệ ngân hàng để điều chỉnh hạn mức.',
    type: 'failed'
  },
  '75': {
    title: 'Ngân hàng đang bảo trì',
    description: 'Ngân hàng thanh toán đang bảo trì hệ thống.',
    advice: 'Vui lòng thử lại sau hoặc chọn ngân hàng khác.',
    type: 'failed'
  },
  '79': {
    title: 'Sai mật khẩu thanh toán quá số lần',
    description: 'Bạn đã nhập sai mật khẩu thanh toán quá số lần quy định.',
    advice: 'Vui lòng thử lại sau hoặc liên hệ ngân hàng để được hỗ trợ.',
    type: 'failed'
  },
  '99': {
    title: 'Thanh toán không thành công',
    description: 'Giao dịch gặp lỗi khác từ hệ thống VNPay.',
    advice: 'Vui lòng thử lại sau. Nếu tài khoản đã bị trừ tiền, hãy liên hệ hỗ trợ kèm mã giao dịch.',
    type: 'failed'
  }
};

export const VNPAY_TRANSACTION_STATUS: Record<string, string> = {
  '00': 'Giao dịch thành công',
  '01': 'Giao dịch chưa hoàn tất',
  '02': 'Giao dịch bị lỗi',
  '04': 'Giao dịch đảo: khách hàng có thể đã bị trừ tiền tại ngân hàng nhưng giao dịch chưa thành công ở VNPay',
  '05': 'VNPay đang xử lý giao dịch hoàn tiền',
  '06': 'VNPay đã gửi yêu cầu hoàn tiền sang ngân hàng',
  '07': 'Giao dịch bị nghi ngờ gian lận',
  '09': 'Giao dịch hoàn trả bị từ chối'
};

const getFirstValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0];
  return value;
};

export const extractVnpayParams = (searchParams: VnpayRawSearchParams) => {
  const inputData: Record<string, string> = {};

  Object.entries(searchParams).forEach(([key, rawValue]) => {
    const value = getFirstValue(rawValue);

    if (key.startsWith('vnp_') && typeof value === 'string' && value.length > 0) {
      inputData[key] = value;
    }
  });

  return inputData;
};

const encodeVnpayValue = (value: string) => {
  return encodeURIComponent(value).replace(/%20/g, '+');
};

export const buildVnpayHashData = (params: Record<string, string>) => {
  return Object.keys(params)
    .sort()
    .map(key => `${encodeVnpayValue(key)}=${encodeVnpayValue(params[key] ?? '')}`)
    .join('&');
};

export const verifyVnpaySignature = (params: Record<string, string>, hashSecret?: string) => {
  if (!hashSecret) return false;

  const secureHash = params.vnp_SecureHash;

  if (!secureHash) return false;

  const signedParams = { ...params };

  delete signedParams.vnp_SecureHash;
  delete signedParams.vnp_SecureHashType;

  const hashData = buildVnpayHashData(signedParams);

  const signed = crypto.createHmac('sha512', hashSecret).update(Buffer.from(hashData, 'utf-8')).digest('hex');

  return secureHash.toLowerCase() === signed.toLowerCase();
};

export const formatVnpayPayDate = (payDate?: string) => {
  if (!payDate || !/^\d{14}$/.test(payDate)) return undefined;

  const year = payDate.slice(0, 4);
  const month = payDate.slice(4, 6);
  const day = payDate.slice(6, 8);
  const hour = payDate.slice(8, 10);
  const minute = payDate.slice(10, 12);
  const second = payDate.slice(12, 14);

  return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
};

export const resolveVnpayPaymentResult = (
  searchParams: VnpayRawSearchParams,
  hashSecret = process.env.VNPAY_HASH_SECRET
): VnpayResult => {
  const rawParams = extractVnpayParams(searchParams);

  if (Object.keys(rawParams).length === 0) {
    return {
      type: 'empty',
      title: 'Không có dữ liệu thanh toán',
      description: 'Trang này cần dữ liệu trả về từ VNPay để hiển thị kết quả.',
      advice: 'Vui lòng quay lại đơn hàng và thử thanh toán lại.',
      isSignatureValid: false,
      rawParams
    };
  }

  const isSignatureValid = verifyVnpaySignature(rawParams, hashSecret);

  const responseCode = rawParams.vnp_ResponseCode;
  const transactionStatus = rawParams.vnp_TransactionStatus;
  const amount = Number(rawParams.vnp_Amount);

  const commonPayload = {
    isSignatureValid,
    responseCode,
    transactionStatus,
    orderId: rawParams.vnp_TxnRef,
    amount: Number.isFinite(amount) ? amount / 100 : undefined,
    bankCode: rawParams.vnp_BankCode,
    cardType: rawParams.vnp_CardType,
    payDate: formatVnpayPayDate(rawParams.vnp_PayDate),
    transactionNo: rawParams.vnp_TransactionNo,
    bankTranNo: rawParams.vnp_BankTranNo,
    orderInfo: rawParams.vnp_OrderInfo,
    rawParams
  };

  if (!isSignatureValid) {
    return {
      ...commonPayload,
      type: 'invalid',
      title: 'Chữ ký thanh toán không hợp lệ',
      description: 'Dữ liệu trả về không vượt qua bước kiểm tra checksum.',
      advice:
        'Không cập nhật đơn hàng ở trường hợp này. Hãy kiểm tra VNPAY_HASH_SECRET hoặc dữ liệu query bị thay đổi.',
      responseCode: responseCode || '97'
    };
  }

  if (responseCode === '00' && transactionStatus === '00') {
    return {
      ...commonPayload,
      type: 'success',
      title: VNPAY_RESPONSE_CODE['00']!.title,
      description: VNPAY_RESPONSE_CODE['00']!.description,
      advice: VNPAY_RESPONSE_CODE['00']!.advice
    };
  }

  if (transactionStatus && ['01', '04', '05', '06', '07'].includes(transactionStatus)) {
    const responseInfo = VNPAY_RESPONSE_CODE[responseCode || '99'];

    return {
      ...commonPayload,
      type: 'warning',
      title: responseInfo?.title || 'Giao dịch cần kiểm tra',
      description: VNPAY_TRANSACTION_STATUS[transactionStatus] || 'Giao dịch chưa có trạng thái rõ ràng.',
      advice:
        responseInfo?.advice ||
        'Không nên thanh toán lại ngay. Vui lòng kiểm tra trạng thái đơn hàng hoặc liên hệ hỗ trợ.'
    };
  }

  const responseInfo = VNPAY_RESPONSE_CODE[responseCode || '99'] || VNPAY_RESPONSE_CODE['99'];

  return {
    ...commonPayload,
    type: responseInfo!.type,
    title: responseInfo!.title,
    description: responseInfo!.description,
    advice: responseInfo!.advice
  };
};
