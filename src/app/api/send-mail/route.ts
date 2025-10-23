import { NextRequest, NextResponse } from 'next/server';
import { transporter } from '~/lib/func-handler/sendEmail';

export async function POST(req: NextRequest) {
  try {
    const { from, to, idRecord, subject, data } = await req.json();

    if (!to || !data) {
      return NextResponse.json({ error: 'Thiếu thông tin email hoặc chưa tạo phản hồi.' }, { status: 400 });
    }
    await transporter.sendMail({
      from: from || `"Phụng Food" <${process.env.SMTP_EMAIL}>`,
      to: to,
      subject: subject || 'Hóa đơn mua hàng',
      html: data
    });

    return NextResponse.json({ success: true, message: 'Email đã được gửi', data: { idRecord } });
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    return NextResponse.json({ error: 'Lỗi khi gửi email' }, { status: 500 });
  }
}
