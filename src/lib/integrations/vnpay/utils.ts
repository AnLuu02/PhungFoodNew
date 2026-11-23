import crypto from 'crypto';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export type VnpayParams = Record<string, string | number | undefined | null>;

export const VNPAY_TIMEZONE = 'Asia/Ho_Chi_Minh';

export const formatVnpayDate = (date = dayjs()) => {
  return date.tz(VNPAY_TIMEZONE).format('YYYYMMDDHHmmss');
};

export const formatVnpayPayDateToVi = (payDate?: string | null) => {
  if (!payDate || !/^\d{14}$/.test(payDate)) return undefined;

  const year = payDate.slice(0, 4);
  const month = payDate.slice(4, 6);
  const day = payDate.slice(6, 8);
  const hour = payDate.slice(8, 10);
  const minute = payDate.slice(10, 12);
  const second = payDate.slice(12, 14);

  return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
};

export const getClientIp = (headers: Headers) => {
  const forwardedFor = headers.get('x-forwarded-for');

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || '127.0.0.1';
  }

  return headers.get('x-real-ip') || '127.0.0.1';
};

export const removeVietnameseTones = (value: string) => {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

export const sanitizeVnpayOrderInfo = (value: string) => {
  return removeVietnameseTones(value)
    .replace(/[^\w\s:.-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 255);
};

export const encodeVnpayValue = (value: string) => {
  return encodeURIComponent(value).replace(/%20/g, '+');
};

export const sortVnpayParams = (params: VnpayParams) => {
  const sorted: Record<string, string> = {};

  Object.keys(params)
    .filter(key => {
      const value = params[key];

      return value !== undefined && value !== null && value !== '';
    })
    .sort()
    .forEach(key => {
      sorted[encodeVnpayValue(key)] = encodeVnpayValue(String(params[key]));
    });

  return sorted;
};

export const stringifyVnpayParams = (params: Record<string, string>) => {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};

export const createVnpaySecureHash = (params: VnpayParams, hashSecret: string) => {
  const sortedParams = sortVnpayParams(params);
  const signData = stringifyVnpayParams(sortedParams);

  return crypto.createHmac('sha512', hashSecret).update(Buffer.from(signData, 'utf-8')).digest('hex');
};

export const buildVnpayPaymentUrl = ({
  paymentUrl,
  params,
  hashSecret
}: {
  paymentUrl: string;
  params: VnpayParams;
  hashSecret: string;
}) => {
  const sortedParams = sortVnpayParams(params);
  const signData = stringifyVnpayParams(sortedParams);
  const secureHash = crypto.createHmac('sha512', hashSecret).update(Buffer.from(signData, 'utf-8')).digest('hex');

  return `${paymentUrl}?${signData}&vnp_SecureHash=${secureHash}`;
};

export const extractVnpayParamsFromUrl = (searchParams: URLSearchParams) => {
  const params: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    if (key.startsWith('vnp_') && value) {
      params[key] = value;
    }
  });

  return params;
};

export const verifyVnpaySignature = ({
  params,
  hashSecret
}: {
  params: Record<string, string>;
  hashSecret: string;
}) => {
  const secureHash = params.vnp_SecureHash;

  if (!secureHash) return false;

  const clonedParams = { ...params };

  delete clonedParams.vnp_SecureHash;
  delete clonedParams.vnp_SecureHashType;

  const signed = createVnpaySecureHash(clonedParams, hashSecret);

  return signed.toLowerCase() === secureHash.toLowerCase();
};

export const toVnpayAmount = (amount: number) => {
  return Math.round(amount * 100);
};

export const fromVnpayAmount = (amount: string | number) => {
  return Number(amount) / 100;
};
