import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generatePDF } from '~/lib/func-handler/generatePDF';

export async function POST(req: NextRequest) {
  try {
    const { to, invoiceData } = await req.json();

    if (!to || !invoiceData) {
      return NextResponse.json({ error: 'Thiếu thông tin email hoặc hóa đơn' }, { status: 400 });
    }

    const pdfBuffer = await generatePDF(invoiceData);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: `"Fast Food" <${process.env.SMTP_EMAIL}>`,
      to: to,
      subject: 'Hóa đơn mua hàng',
      text: `Cảm ơn bạn đã mua hàng tại Fast Food! Hóa đơn của bạn có tổng tiền ${invoiceData?.originalTotal || 0} VND.`,
      attachments: [
        {
          filename: `Hóa đơn mua hàng - ${invoiceData?.user.name || 'empty'}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });

    return NextResponse.json({ success: true, message: 'Email đã được gửi' });
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    return NextResponse.json({ error: 'Lỗi khi gửi email' }, { status: 500 });
  }
}
