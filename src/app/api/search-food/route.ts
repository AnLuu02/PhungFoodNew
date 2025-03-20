import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Chuyển file thành Base64
    const buffer = await (file as Blob).arrayBuffer();
    const imageBase64 = Buffer.from(buffer).toString('base64');

    // Gọi Hugging Face API
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/nateraw/food',
      { inputs: imageBase64 },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const results = response.data.map((item: any) => ({
      label: item.label,
      score: item.score
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
