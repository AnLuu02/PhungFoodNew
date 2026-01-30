import Pusher from 'pusher-js';

export const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  authorizer: (channel, options) => {
    return {
      authorize: async (socketId, callback) => {
        try {
          const res = await fetch('/api/pusher/auth', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              socket_id: socketId,
              channel_name: channel.name
            })
          });
          const data = await res.json();
          callback(null, data);
        } catch (err: any) {
          callback(err, err);
        }
      }
    };
  }
});
