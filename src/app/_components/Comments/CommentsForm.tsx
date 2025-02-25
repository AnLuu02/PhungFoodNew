'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Flex, Rating, Text, Textarea } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/app/_components/Button';
import { Review } from '~/app/Entity/ReviewEntity';
import { NotifyError, NotifySuccess } from '~/app/lib/utils/func-handler/toast';
import { reviewSchema } from '~/app/lib/utils/zod/zodShcemaForm';
import { api } from '~/trpc/react';

export const CommentsForm = ({ product }: { product: any }) => {
  const { data: user } = useSession();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<Review>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      id: '',
      productId: product?.id ?? '',
      rating: 1.0,
      comment: ''
    }
  });
  const mutation = api.Review.create.useMutation();
  const utils = api.useUtils();
  const onSubmit: SubmitHandler<Review> = async formData => {
    try {
      setValue('productId', product.id);
      if (user?.user?.id) {
        let result = await mutation.mutateAsync({ ...formData, userId: user?.user?.id });
        if (result.success) {
          utils.Review.invalidate();
          utils.Product.invalidate();
          reset();
          NotifySuccess(result.message);
        } else {
          NotifyError(result.message);
        }
      } else {
        NotifyError('Chưa đăng nhập', 'Vui lý đăng nhập để đánh giá sản phẩm.');
      }
    } catch (error) {
      NotifyError('Error created Category');
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-4'>
      <Flex align='center' gap={'xs'}>
        <Text size='md' fw={700}>
          Đánh giá của bạn:
        </Text>

        <Controller
          control={control}
          name='rating'
          render={({ field }) => <Rating size='lg' color='yellow.8' {...field} />}
        />
      </Flex>
      <Controller
        control={control}
        name='comment'
        render={({ field }) => (
          <Textarea placeholder='Your Comment' flex={1} {...field} error={errors.comment?.message} />
        )}
      />
      <BButton
        type='submit'
        radius='sm'
        size='sm'
        fullWidth
        loading={isSubmitting}
        disabled={isSubmitting || watch('comment') === '' || watch('rating') === 0}
        title='Đánh giá'
      />
    </form>
  );
};
