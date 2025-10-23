import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import qs from 'qs';
import { LocalOrderStatus } from '~/lib/zod/EnumType';
import { api } from '~/trpc/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const vnp_Params = Object.fromEntries(url.searchParams);

  const secureHash = vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  const secretKey = process.env.VNP_HASHSECRET!;

  const sortedParams = sortObject(vnp_Params);
  const signData = qs.stringify(sortedParams, { encode: false });

  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  if (secureHash !== signed) {
    return NextResponse.json({ code: '97', message: 'Invalid Signature' }, { status: 400 });
  }

  const transactionId = vnp_Params['vnp_TxnRef'];
  const responseCode = vnp_Params['vnp_ResponseCode'];
  const status = responseCode === '00' ? LocalOrderStatus.PENDING : LocalOrderStatus.CANCELLED;
  const transDate = vnp_Params['vnp_PayDate'];
  await api.Order.update({
    where: { id: transactionId },
    data: {
      status,
      transactionId,
      transDate: transDate
        ? new Date(
            `${transDate.substring(0, 4)}-${transDate.substring(4, 6)}-${transDate.substring(6, 8)}T${transDate.substring(8, 10)}:${transDate.substring(10, 12)}:${transDate.substring(12, 14)}Z`
          )
        : null
    },
    orderId: transactionId || ''
  });
  const redirectUrl =
    responseCode === '00'
      ? `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL_DEPLOY}/vnpay-payment-result?${qs.stringify(vnp_Params)}`
      : `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL_DEPLOY}/vnpay-payment-result?${qs.stringify(vnp_Params)}`;

  return NextResponse.redirect(redirectUrl);
}
function sortObject(obj: any) {
  const sorted: Record<string, string> = {};
  const str = [];
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
