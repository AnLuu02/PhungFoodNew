import { NextRequest, NextResponse } from 'next/server';
import { transporter } from '~/lib/FuncHandler/MailHelpers/sendEmail';

export async function POST(req: NextRequest) {
  try {
    const { from, to_n, idRecord, subject, data } = await req.json();

    if (!to_n || to_n.length === 0 || !data) {
      return NextResponse.json({ error: 'Thiếu thông tin email hoặc chưa tạo phản hồi.' }, { status: 400 });
    }
    await Promise.all(
      to_n.map((to: string) => {
        return transporter.sendMail({
          from: from || `"Phụng Food" <${process.env.SMTP_EMAIL}>`,
          to: to,
          subject: subject || 'Hóa đơn mua hàng',
          html: data
        });
      })
    );

    return NextResponse.json({ success: true, message: 'Email đã được gửi', data: { idRecord } });
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    return NextResponse.json({ error: 'Lỗi khi gửi email' }, { status: 500 });
  }
}
