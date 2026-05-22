import { OpenRouter } from '@openrouter/sdk';
import { NextResponse } from 'next/server';
import { callOpenRouter, cleanHTML } from '~/lib/FuncHandler/Chat';

export const runtime = 'nodejs';
const systemPrompt = `
Bạn là nhân viên chăm sóc khách hàng senior của Phụng Food Restaurant.
Bạn chỉ điền nội dung vào khung HTML có sẵn.
Không phá layout.
Không thêm markdown, JSON hoặc giải thích.
Không dùng emoji.
`;
const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!
});

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  const prompt = `
Bạn là AI viết email phản hồi khách hàng cho Phụng Food Restaurant.

Thông tin khách hàng:
- Tên: ${name || 'Khách hàng'}
- Email: ${email || 'Không có'}

Tin nhắn khách hàng:
"""
${message}
"""

Nhiệm vụ:
- Đọc tin nhắn khách hàng.
- Hiểu mục đích: hợp tác, hỗ trợ, góp ý, khiếu nại hoặc câu hỏi thông thường.
- Viết nội dung phản hồi phù hợp, tự nhiên, lịch sự và chuyên nghiệp.
- Luôn viết bằng tiếng Việt.
- Không bịa thông tin.
- Nếu thiếu thông tin, hỏi thêm ngắn gọn.
- Không dùng emoji.

Yêu cầu cực kỳ quan trọng:
- Chỉ trả về HTML hoàn chỉnh bên dưới.
- Không markdown.
- Không JSON.
- Không giải thích.
- Không dùng \`\`\`.
- Không thay đổi layout, màu sắc, style, class, cấu trúc HTML.
- Chỉ thay nội dung chữ bên trong các vùng được đánh dấu:
  {{GREETING}}
  {{INTRO}}
  {{MAIN_CONTENT}}
  {{CTA_TEXT}}
  {{CLOSING}}
- Nếu không cần CTA, vẫn giữ nút CTA với nội dung: "Phản hồi thêm thông tin".

HTML bắt buộc:

<div style="max-width:680px;margin:0 auto;background:#f8fafc;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#334155;">
  <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
    
    <div style="background:linear-gradient(135deg,#f97316,#fb923c);padding:24px;">
      <div style="font-size:13px;color:#ffedd5;margin-bottom:6px;">
        Phản hồi từ
      </div>
      <div style="font-size:24px;font-weight:700;color:#ffffff;line-height:1.3;">
        Phụng Food Restaurant
      </div>
      <div style="font-size:14px;color:#fff7ed;margin-top:6px;">
        Cảm ơn bạn đã liên hệ với chúng tôi
      </div>
    </div>

    <div style="padding:28px 28px 24px;">
      <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#0f172a;">
        {{GREETING}}
      </p>

      <p style="margin:0 0 14px;font-size:15px;line-height:1.8;color:#334155;">
        {{INTRO}}
      </p>

      <p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:#334155;">
        {{MAIN_CONTENT}}
      </p>

      <div style="margin:22px 0;">
        <a href="mailto:${email || ''}" style="display:inline-block;background:#f97316;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;border-radius:999px;padding:12px 18px;">
          {{CTA_TEXT}}
        </a>
      </div>

      <p style="margin:0 0 18px;font-size:15px;line-height:1.8;color:#334155;">
        {{CLOSING}}
      </p>

      <div style="margin-top:24px;padding-top:18px;border-top:1px solid #e2e8f0;">
        <p style="margin:0;font-size:15px;line-height:1.7;color:#334155;">
          Trân trọng,
        </p>
        <p style="margin:2px 0 0;font-size:16px;font-weight:700;color:#f97316;">
          Đội ngũ Phụng Food
        </p>
      </div>
    </div>

    <div style="background:#fff7ed;padding:16px 28px;border-top:1px solid #fed7aa;">
      <p style="margin:0;font-size:12px;line-height:1.6;color:#9a3412;">
        Email này được gửi từ hệ thống chăm sóc khách hàng của Phụng Food Restaurant.
      </p>
    </div>

  </div>
</div>
`;

  try {
    const response = await callOpenRouter(prompt, systemPrompt);

    const answer = cleanHTML(response.choices?.[0]?.message?.content);

    return NextResponse.json({
      message: answer || '<p>PhungFood xin cảm ơn anh/chị đã liên hệ. Đội ngũ sẽ phản hồi trong thời gian sớm nhất.</p>'
    });
  } catch (error) {
    console.error('Lỗi OpenRouter:', error);

    return NextResponse.json(
      {
        message: 'Chatbox đang bận. Thử lại sau.'
      },
      { status: 500 }
    );
  }
}
