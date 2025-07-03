import { NextResponse } from 'next/server';
import { pusherServer } from '~/lib/pusher/server';

export async function POST(req: Request) {
  const { email, data } = await req.json();
  await pusherServer.trigger(`user-${email}`, 'new-notify', {
    ...data
  });

  return NextResponse.json({ success: true });
}
