import { NextRequest, NextResponse } from 'next/server';
import { generatePDF } from '~/lib/func-handler/generatePDF';
import { getComfirmEmail, transporter } from '~/lib/func-handler/sendEmail';

export async function POST(req: NextRequest) {
  try {
    const { to, subject, data, orderTrackingUrl } = await req.json();
    const emailContent = getComfirmEmail(data?.user, data, orderTrackingUrl);
    if (!to || !data) {
      return NextResponse.json({ error: 'Thiếu thông tin email hoặc hóa đơn' }, { status: 400 });
    }
    const pdfBuffer = await generatePDF(data);
    await transporter.sendMail({
      from: `"Phụng Food" <${process.env.SMTP_EMAIL}>`,
      to: to,
      subject: subject || 'Hóa đơn mua hàng',
      text: `Cảm ơn bạn đã mua hàng tại Phụng Food! Hóa đơn của bạn có tổng tiền ${data?.originalTotal || 0} VND.`,
      html: emailContent,
      attachments: [
        {
          filename: `Hóa đơn mua hàng - ${data?.user.name || 'empty'}.pdf`,
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
