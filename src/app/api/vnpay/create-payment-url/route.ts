import dayjs from 'dayjs';
import { NextRequest, NextResponse } from 'next/server';
import { moneyToNumber } from '~/lib/FuncHandler/Format';

import { VNPAY_CONFIG, assertVnpayConfig } from '~/lib/vnpay/config';
import {
  buildVnpayPaymentUrl,
  formatVnpayDate,
  getClientIp,
  sanitizeVnpayOrderInfo,
  toVnpayAmount
} from '~/lib/vnpay/utils';

import { db } from '~/server/db';

type CreateVnpayPaymentBody = {
  orderId: string;
  bankCode?: 'VNPAYQR' | 'VNBANK' | 'INTCARD' | string;
  locale?: 'vn' | 'en';
};

export async function POST(req: NextRequest) {
  try {
    assertVnpayConfig();

    const body = (await req.json()) as CreateVnpayPaymentBody;

    if (!body.orderId) {
      return NextResponse.json(
        {
          message: 'Thiếu orderId'
        },
        { status: 400 }
      );
    }

    const order = await db.order.findUnique({
      where: {
        id: body.orderId
      },
      include: {
        user: true
      }
    });

    if (!order) {
      return NextResponse.json(
        {
          message: 'Không tìm thấy đơn hàng'
        },
        { status: 404 }
      );
    }

    if (order.status !== 'UNPAID') {
      return NextResponse.json(
        {
          message: 'Đơn hàng này không còn ở trạng thái chờ thanh toán'
        },
        { status: 400 }
      );
    }

    const amount = moneyToNumber(order.finalAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        {
          message: 'Số tiền thanh toán không hợp lệ'
        },
        { status: 400 }
      );
    }

    const now = dayjs();
    const expireDate = now.add(15, 'minutes');

    const vnpParams: Record<string, string | number | undefined> = {
      vnp_Version: VNPAY_CONFIG.version,
      vnp_Command: VNPAY_CONFIG.command,
      vnp_TmnCode: VNPAY_CONFIG.tmnCode,
      vnp_Amount: toVnpayAmount(amount),
      vnp_CurrCode: VNPAY_CONFIG.currCode,
      vnp_TxnRef: order.id,
      vnp_OrderInfo: sanitizeVnpayOrderInfo(`Thanh toan don hang ${order.id}`),
      vnp_OrderType: VNPAY_CONFIG.orderType,
      vnp_Locale: body.locale || VNPAY_CONFIG.locale,
      vnp_ReturnUrl: VNPAY_CONFIG.returnUrl,
      vnp_IpAddr: getClientIp(req.headers),
      vnp_CreateDate: formatVnpayDate(now),
      vnp_ExpireDate: formatVnpayDate(expireDate)
    };

    if (body.bankCode) {
      vnpParams.vnp_BankCode = body.bankCode;
    }

    const paymentUrl = buildVnpayPaymentUrl({
      paymentUrl: VNPAY_CONFIG.paymentUrl,
      params: vnpParams,
      hashSecret: VNPAY_CONFIG.hashSecret
    });

    return NextResponse.json({
      code: '00',
      message: 'Tạo URL thanh toán thành công',
      paymentUrl
    });
  } catch (error) {
    console.error('[VNPAY_CREATE_PAYMENT_URL_ERROR]', error);

    return NextResponse.json(
      {
        message: 'Không thể tạo URL thanh toán'
      },
      { status: 500 }
    );
  }
}
