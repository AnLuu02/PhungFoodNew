export const VNPAY_CONFIG = {
  version: '2.1.0',
  command: 'pay',
  currCode: 'VND',
  locale: 'vn',
  orderType: 'other',

  tmnCode: process.env.VNPAY_TMN_CODE || '',
  hashSecret: process.env.VNPAY_HASH_SECRET || '',
  paymentUrl: process.env.VNPAY_PAYMENT_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  returnUrl: process.env.VNPAY_RETURN_URL || '',
  ipnUrl: process.env.VNPAY_IPN_URL || ''
};

export const assertVnpayConfig = () => {
  if (!VNPAY_CONFIG.tmnCode) {
    throw new Error('Missing VNPAY_TMN_CODE');
  }

  if (!VNPAY_CONFIG.hashSecret) {
    throw new Error('Missing VNPAY_HASH_SECRET');
  }

  if (!VNPAY_CONFIG.returnUrl) {
    throw new Error('Missing VNPAY_RETURN_URL');
  }

  if (!VNPAY_CONFIG.ipnUrl) {
    throw new Error('Missing VNPAY_IPN_URL');
  }
};
