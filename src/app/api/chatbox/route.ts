import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { message } = await req.json();
  const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;

  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOGETHER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free', // Model miễn phí, có thể thử 'gemma-7b-it' hoặc 'llama-2-7b-chat'
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();

    // 🛠️ Debug API Response

    if (!data || !data.choices || data.choices.length === 0) {
      return NextResponse.json({ reply: 'Lỗi: API không trả về dữ liệu hợp lệ' }, { status: 500 });
    }

    let botReply = data.choices[0]?.message?.content || 'Xin lỗi, tôi không hiểu.';
    botReply = botReply.replace(/<[^>]+>/g, '');
    return NextResponse.json({ reply: botReply });
  } catch (error) {
    console.error('Lỗi API Together AI:', error);
    return NextResponse.json({ reply: 'Lỗi hệ thống, vui lòng thử lại.' }, { status: 500 });
  }
}
