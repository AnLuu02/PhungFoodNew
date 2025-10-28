import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { pusherServer } from '~/lib/PusherConfig/server';

const viewers = new Map<string, Set<string>>();

export async function POST(req: Request) {
  const { productId, action } = await req.json();
  const cookieStore = cookies();
  let sessionId = cookieStore.get('sessionId')?.value;
  let res = NextResponse.json({});

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    res.cookies.set('sessionId', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });
  }

  if (action === 'join') {
    if (!viewers.has(productId)) viewers.set(productId, new Set());
    viewers.get(productId)!.add(sessionId);
  }

  if (action === 'leave') {
    viewers.get(productId)?.delete(sessionId);
  }

  const count = viewers.get(productId)?.size ?? 0;

  await pusherServer.trigger(`product-${productId}`, 'update', { count });

  res = NextResponse.json({ count });
  if (!cookieStore.get('sessionId')) {
    res.cookies.set('sessionId', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });
  }

  return res;
}
