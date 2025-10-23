'use client';
import { Button, Tooltip } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { NotifySuccess } from '~/lib/func-handler/toast';
import { api } from '~/trpc/react';
export const ButtonToggleLike = ({ data }: any) => {
  const { data: session } = useSession();
  const [localFavouriteFood, setLocalFavouriteFood] = useLocalStorage<any>({
    key: 'favouriteFood',
    defaultValue: []
  });
  const [like, setLike] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const utils = api.useUtils();

  useEffect(() => {
    if (session) {
      const favourite = data?.favouriteFood?.find((item: any) => item.userId === session?.user?.id);
      if (favourite) {
        setLike(true);
      }
    } else {
      const favourite = localFavouriteFood?.find((item: any) => item.id === data.id);
      if (favourite) {
        setLike(true);
      }
    }
  }, [data, session, localFavouriteFood]);

  const mutationAddFavourite = api.FavouriteFood.create.useMutation({
    onSuccess: () => {
      utils.FavouriteFood.invalidate();
    }
  });
  const mutationCancleFavourite = api.FavouriteFood.delete.useMutation({
    onSuccess: () => {
      utils.FavouriteFood.invalidate();
    }
  });

  return (
    <Button
      className={`text-mainColor hover:text-subColor`}
      size='xs'
      w={'max-content'}
      p={5}
      variant='default'
      loading={loading}
      disabled={loading}
    >
      {like ? (
        <Tooltip label='Xóa khỏi yêu thích'>
          <IconHeartFilled
            onClick={async () => {
              if (session) {
                setLoading(true);
                await mutationCancleFavourite.mutateAsync({ userId: session?.user?.id, productId: data.id });
                setLike(false);
                setLoading(false);
                NotifySuccess('Thao tác thành công!', 'Xoá yêu thích thành công.');
              } else {
                setLike(false);
                setLocalFavouriteFood(localFavouriteFood.filter((item: any) => item.id !== data.id));
                NotifySuccess('Thao tác thành công!', 'Xoá yêu thích thành công.');
              }
            }}
          />
        </Tooltip>
      ) : (
        <Tooltip label='Thêm vào yêu thích'>
          <IconHeart
            onClick={async () => {
              if (session) {
                setLoading(true);
                await mutationAddFavourite.mutateAsync({ userId: session?.user?.id, productId: data.id });
                setLike(true);
                setLoading(false);
                NotifySuccess('Thao tác thành công!', 'Xóa yêu thích thành công.');
              } else {
                setLike(true);
                setLocalFavouriteFood([...localFavouriteFood, data]);
                NotifySuccess('Thao tác thành công!', 'Xóa yêu thích thành công.');
              }
            }}
          />
        </Tooltip>
      )}
    </Button>
  );
};
