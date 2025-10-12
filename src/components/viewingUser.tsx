'use client';
import { Group, Text } from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { pusherClient } from '~/lib/pusher/client';

export default function ViewingUser({ productId }: { productId: string }) {
  const [viewers, setViewers] = useState(0);
  const joined = useRef(false);

  useEffect(() => {
    const channel = pusherClient.subscribe(`product-${productId}`);

    channel.bind('update', (data: { count: number }) => {
      if (!joined.current) return;
      setViewers(data.count);
    });

    const join = async () => {
      const res = await fetch('/api/product-viewing', {
        method: 'POST',
        body: JSON.stringify({ productId, action: 'join' }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setViewers(data.count);
      joined.current = true;
    };

    join();

    const leave = () => {
      try {
        navigator.sendBeacon('/api/product-viewing', JSON.stringify({ productId, action: 'leave' }));
      } catch (err) {
        console.error('sendBeacon failed', err);
      }
    };

    window.addEventListener('beforeunload', leave);

    return () => {
      window.removeEventListener('beforeunload', leave);
      pusherClient.unsubscribe(`product-${productId}`);
    };
  }, [productId]);

  return (
    <Group>
      <IconEye size={16} />
      <Text size='sm'>{viewers} người đang xem sản phẩm này</Text>
    </Group>
  );
}
