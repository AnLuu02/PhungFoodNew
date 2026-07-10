'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { api } from '~/trpc/react';

export function UserProvider() {
  const { data: session } = useSession();

  const userId = session?.user?.id;

  const utils = api.useUtils();

  useEffect(() => {
    if (userId) {
      void utils.User.getOverviewUser.prefetch({
        key: userId ?? ''
      });
    }
  }, [userId]);

  return null;
}
