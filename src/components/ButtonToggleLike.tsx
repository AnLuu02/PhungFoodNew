'use client';
import { Button, Tooltip } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { api } from '~/trpc/react';
const ToggleLikeButton = ({ data }: any) => {
  const { data: user } = useSession();
  const [localFavouriteFood, setLocalFavouriteFood] = useLocalStorage<any>({
    key: 'favouriteFood',
    defaultValue: []
  });
  const [like, setLike] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const utils = api.useUtils();

  useEffect(() => {
    if (user) {
      const favourite = data?.favouriteFood?.find((item: any) => item.userId === user?.user?.id);
      if (favourite) {
        setLike(true);
      }
    } else {
      const favourite = localFavouriteFood?.find((item: any) => item.id === data.id);
      if (favourite) {
        setLike(true);
      }
    }
  }, [data, user]);

  const mutationAddFavourite = api.FavouriteFood.create.useMutation({
    onSuccess: () => {
      setLike(true);
      setLoading(false);
      utils.FavouriteFood.invalidate();
    },
    onError: error => {
      NotifyError(error.message);
    }
  });
  const mutationCancleFavourite = api.FavouriteFood.delete.useMutation({
    onSuccess: () => {
      setLike(false);
      setLoading(false);
      utils.FavouriteFood.invalidate();
    },
    onError: error => {
      NotifyError(error.message);
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
              if (user) {
                await mutationCancleFavourite.mutateAsync({ userId: user?.user?.id, productId: data.id });
                setLoading(true);
              } else {
                setLike(false);
                setLocalFavouriteFood(localFavouriteFood.filter((item: any) => item.id !== data.id));
              }
              NotifySuccess('Thành công!', 'Xóa yêu thích thành công.');
            }}
          />
        </Tooltip>
      ) : (
        <Tooltip label='Thêm vào yêu thích'>
          <IconHeart
            onClick={async () => {
              if (user) {
                await mutationAddFavourite.mutateAsync({ userId: user?.user?.id, productId: data.id });
                setLoading(true);
              } else {
                setLike(true);
                setLocalFavouriteFood([...localFavouriteFood, data]);
              }
              NotifySuccess('Thành công!', 'Thêm yêu thích thành công.');
            }}
          />
        </Tooltip>
      )}
    </Button>
  );
};
export default ToggleLikeButton;
