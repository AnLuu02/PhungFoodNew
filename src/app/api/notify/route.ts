import { NextResponse } from 'next/server';
import { pusherServer } from '~/lib/PusherConfig/server';

export async function POST(req: Request) {
  try {
    const { userIds, data } = await req.json();

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ success: false, message: 'Không có user hợp lệ' }, { status: 400 });
    }

    await Promise.all(userIds.map((id: string) => pusherServer.trigger(`user-${id}`, 'new-notify', { ...data })));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Pusher error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
