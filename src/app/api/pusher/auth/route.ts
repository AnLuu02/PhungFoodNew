import { getServerSession } from 'next-auth';
import { pusherServer } from '~/lib/PusherConfig/server';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 403 });
    }

    const body = await req.text();
    const params = new URLSearchParams(body);
    const socket_id = params.get('socket_id');
    const channel_name = params.get('channel_name');

    if (!socket_id || !channel_name) {
      return new Response('Invalid request', { status: 400 });
    }

    const presenceData = {
      user_id: session.user.id,
      user_info: {
        name: session.user.name,
        email: session.user.email
      }
    };

    const authResponse = pusherServer.authorizeChannel(socket_id, channel_name, presenceData);
    return new Response(JSON.stringify(authResponse));
  } catch (error) {
    console.error('Pusher auth error', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
