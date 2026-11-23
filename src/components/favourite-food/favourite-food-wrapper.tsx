'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { api, RouterOutputs } from '~/trpc/react';

export const FavouriteFoodWrapper = ({
  valueFoward,
  children
}: {
  valueFoward: (data: RouterOutputs['FavouriteFood']['getFilterIds']) => void;
  children: React.ReactNode;
}) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data } = api.FavouriteFood.getFilterIds.useQuery({ keys: userId ? [userId] : [] });
  useEffect(() => {
    data && valueFoward(data);
  }, [data]);
  return <>{children}</>;
};
