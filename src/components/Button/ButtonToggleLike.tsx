'use client';
import { Button, Tooltip } from '@mantine/core';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { memo, useCallback, useMemo } from 'react';
import { NotifyError } from '~/lib/FuncHandler/toast';
import { useFavoriteStore } from '~/stores/favorite.store';
import { api } from '~/trpc/react';
import { useFavorite } from '../Hooks/use-favorite';
const ButtonToggleLike = ({ product, isLiked }: { product: any; isLiked?: boolean }) => {
  const { data: session } = useSession();
  const toggle = useFavoriteStore(state => state.toggle);
  const utils = api.useUtils();

  const userId = session?.user?.id;
  const productId = product?.id;

  const _isLiked = typeof isLiked !== 'undefined' ? isLiked : useFavorite(product?.id);

  const queryInput = useMemo(
    () => ({
      keys: userId ? [userId] : []
    }),
    [userId]
  );

  const mutationToggleLike = api.FavouriteFood.toggle.useMutation({
    onMutate: async newState => {
      toggle(newState.productId);
      await utils.FavouriteFood.getFilter.cancel(queryInput);

      utils.FavouriteFood.getFilter.setData(queryInput, oldState => {
        const newProductLiked = { productId, userId, product } as any;
        if (!oldState) return [newProductLiked];
        const isExisted = oldState.some(({ productId }) => productId === newState.productId);
        return isExisted
          ? oldState.filter(({ productId }) => productId !== newState.productId)
          : [...oldState, newProductLiked];
      });

      return { queryInput, productId: newState.productId };
    },
    onError: (err, vars, context) => {
      if (context?.productId) {
        toggle(context.productId);
      }
    },
    onSettled: (data, error, variables, context) => {
      if (context?.queryInput) {
        utils.FavouriteFood.getFilter.invalidate(context?.queryInput);
      }
    }
  });

  const handleToggleLike = useCallback(async () => {
    if (!userId) {
      NotifyError('Oops! ᓚᘏᗢ ', 'Đăng nhập để lưu trữ sản phẩm yêu thích.');
      return;
    }
    mutationToggleLike.mutateAsync({ productId, userId });
  }, [productId, userId, mutationToggleLike]);

  if (!productId) return;

  return (
    <Button
      className={`flex items-center justify-center rounded-full text-mainColor hover:text-subColor`}
      size='xs'
      variant='default'
      w={30}
      h={30}
    >
      {_isLiked ? (
        <Tooltip label='Xóa khỏi yêu thích'>
          <IconHeartFilled onClick={handleToggleLike} />
        </Tooltip>
      ) : (
        <Tooltip label='Thêm vào yêu thích'>
          <IconHeart onClick={handleToggleLike} />
        </Tooltip>
      )}
    </Button>
  );
};
export default memo(ButtonToggleLike);
