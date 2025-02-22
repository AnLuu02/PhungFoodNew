import crypto from 'crypto';
import moment from 'moment';
import { NextRequest, NextResponse } from 'next/server';
import qs from 'qs';

export async function POST(req: NextRequest) {
  process.env.TZ = 'Asia/Ho_Chi_Minh';

  const date = new Date();
  const createDate = moment(date).format('YYYYMMDDHHmmss');

  const body = await req.json();
  const { amount, bankCode, language } = body;

  const orderId = body.orderId || moment(date).format('DDHHmmss');

  const ipAddr = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';

  const tmnCode = process.env.VNP_TMNCODE!;
  const secretKey = process.env.VNP_HASHSECRET!;
  const vnpUrl = process.env.VNP_URL!;
  const returnUrl = process.env.VNP_RETURNURL!;

  const locale = language || 'vn';
  const currCode = 'VND';

  let vnp_Params: Record<string, string> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toan cho ma GD: ${orderId}`,
    vnp_OrderType: 'other',
    vnp_Amount: (amount * 100).toString(),
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate
  };

  if (bankCode) {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;

  const paymentUrl = `${vnpUrl}?${qs.stringify(vnp_Params, { encode: false })}`;

  return NextResponse.json({ paymentUrl }, { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });
}

// Hàm sắp xếp object theo thứ tự key (bắt buộc để ký hash chính xác)
function sortObject(obj: any) {
  let sorted: Record<string, string> = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    const k = str[key];
    if (k !== undefined) {
      sorted[k] = encodeURIComponent(obj[k]).replace(/%20/g, '+');
    }
  }
  return sorted;
}
