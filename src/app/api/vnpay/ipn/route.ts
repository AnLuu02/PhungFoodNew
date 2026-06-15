import { NextRequest, NextResponse } from 'next/server';
import { moneyToNumber } from '~/lib/FuncHandler/Format';

import { VNPAY_CONFIG, assertVnpayConfig } from '~/lib/vnpay/config';
import { extractVnpayParamsFromUrl, verifyVnpaySignature } from '~/lib/vnpay/utils';

import { db } from '~/server/db';
import { confirmVoucherUsageService, releaseVoucherUsageService } from '~/server/services/voucherUsage.service';

const vnpayJson = (RspCode: string, Message: string) => {
  return NextResponse.json({
    RspCode,
    Message
  });
};

export async function GET(req: NextRequest) {
  try {
    assertVnpayConfig();

    const vnpParams = extractVnpayParamsFromUrl(req.nextUrl.searchParams);

    if (Object.keys(vnpParams).length === 0) {
      return vnpayJson('99', 'Input data required');
    }

    const isValidSignature = verifyVnpaySignature({
      params: vnpParams,
      hashSecret: VNPAY_CONFIG.hashSecret
    });

    if (!isValidSignature) {
      return vnpayJson('97', 'Invalid signature');
    }

    const orderId = vnpParams.vnp_TxnRef;
    const responseCode = vnpParams.vnp_ResponseCode;
    const transactionStatus = vnpParams.vnp_TransactionStatus;
    const vnpAmount = Number(vnpParams.vnp_Amount || 0);

    if (!orderId) {
      return vnpayJson('01', 'Order not found');
    }

    const order = await db.order.findUnique({
      where: {
        id: orderId
      }
    });

    if (!order) {
      return vnpayJson('01', 'Order not found');
    }

    const orderAmountForVnpay = Math.round(moneyToNumber(order.finalAmount) * 100);

    if (orderAmountForVnpay !== vnpAmount) {
      return vnpayJson('04', 'Invalid amount');
    }

    if (order.status !== 'UNPAID') {
      return vnpayJson('02', 'Order already confirmed');
    }

    await db.$transaction(async tx => {
      const order = await tx.order.findUnique({
        where: {
          id: orderId
        }
      });

      if (!order) {
        throw new Error('ORDER_NOT_FOUND');
      }

      if (order.status !== 'UNPAID') {
        return;
      }

      const isPaymentSuccess = responseCode === '00' && transactionStatus === '00';

      await tx.order.update({
        where: {
          id: order.id
        },
        data: {
          status: isPaymentSuccess ? 'PENDING' : 'UNPAID',
          transDate: vnpParams.vnp_PayDate || null
        }
      });

      if (isPaymentSuccess) {
        await confirmVoucherUsageService(tx, {
          userId: order.userId,
          orderId: order.id
        });
      } else {
        await releaseVoucherUsageService(tx, {
          userId: order.userId,
          orderId: order.id
        });
      }
    });

    return vnpayJson('00', 'Confirm Success');
  } catch (error) {
    console.error('[VNPAY_IPN_ERROR]', error);

    return vnpayJson('99', 'Unknown error');
  }
}
