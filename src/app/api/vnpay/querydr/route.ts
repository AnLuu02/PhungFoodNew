import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { orderId, transDate } = await req.json();
    if (!orderId || !transDate) {
      return NextResponse.json({ message: 'Thiếu orderId hoặc transDate' }, { status: 400 });
    }

    const vnp_TmnCode = process.env.VNP_TMNCODE!;
    const secretKey = process.env.VNP_HASHSECRET!;
    const vnp_Api = process.env.VNP_API_URL!;
    const vnp_RequestId = new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, '')
      .slice(8, 14);
    const vnp_Version = '2.1.0';
    const vnp_Command = 'querydr';
    const vnp_OrderInfo = `Truy van GD ma: ${orderId}`;
    const vnp_CreateDate = new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, '')
      .slice(0, 14);

    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

    const data = `${vnp_RequestId}|${vnp_Version}|${vnp_Command}|${vnp_TmnCode}|${orderId}|${transDate}|${vnp_CreateDate}|${clientIp}|${vnp_OrderInfo}`;
    const hmac = crypto.createHmac('sha512', secretKey);
    const vnp_SecureHash = hmac.update(Buffer.from(data, 'utf-8')).digest('hex');

    const body = {
      vnp_RequestId,
      vnp_Version,
      vnp_Command,
      vnp_TmnCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo,
      vnp_TransactionDate: transDate,
      vnp_CreateDate,
      vnp_IpAddr: clientIp,
      vnp_SecureHash
    };

    const response = await fetch(vnp_Api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('VNPAY API error:', errorText);
      return NextResponse.json({ message: 'Lỗi khi truy vấn VNPAY' }, { status: 500 });
    }

    const dataResponse = await response.json();
    return NextResponse.json(dataResponse);
  } catch (error) {
    console.error('Internal error:', error);
    return NextResponse.json({ message: 'Đã xảy ra lỗi.' }, { status: 500 });
  }
}
