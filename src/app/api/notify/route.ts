import { NextResponse } from 'next/server';
import { pusherServer } from '~/lib/pusher/server';

export async function POST(req: Request) {
  const { email, data } = await req.json();
  if (email && data && Array.isArray(email)) {
    Promise.all(
      email.map(e => {
        return pusherServer.trigger(`user-${e}`, 'new-notify', {
          ...data
        });
      })
    );
  } else {
    await pusherServer.trigger(`user-${email}`, 'new-notify', {
      ...data
    });
  }

  return NextResponse.json({ success: true });
}
