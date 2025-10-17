'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Flex, Rating, Text, Textarea } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import { NotifyError, NotifySuccess, NotifyWarning } from '~/lib/func-handler/toast';
import { reviewSchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { Review } from '~/types/review';

export const CommentsForm = ({ product }: { product: any }) => {
  const { data: user } = useSession();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<Review>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      id: '',
      productId: product?.id ?? '',
      rating: 1.0,
      comment: ''
    }
  });
  const mutation = api.Review.create.useMutation({
    onSuccess: result => {
      utils.Review.invalidate();
      utils.Product.invalidate();
      reset();
      NotifySuccess(result.message);
    },
    onError: error => {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.', error.message);
    }
  });
  const utils = api.useUtils();
  const onSubmit: SubmitHandler<Review> = async formData => {
    if (!user?.user?.id) {
      NotifyWarning('Chưa đăng nhập', 'Vui lý đăng nhập để đánh giá sản phẩm.');
      return;
    }
    setValue('productId', product.id);
    await mutation.mutateAsync({ ...formData, userId: user?.user?.id });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-4'>
      <Flex align='center' gap={'xs'}>
        <Text size='md' fw={700}>
          Đánh giá của bạn:
        </Text>

        <Controller
          control={control}
          disabled={isSubmitting || !user?.user?.id}
          name='rating'
          render={({ field }) => (
            <Rating disabled={isSubmitting || !user?.user?.id} size='lg' color={'#FFC522'} {...field} />
          )}
        />
      </Flex>
      <Controller
        control={control}
        name='comment'
        disabled={isSubmitting || !user?.user?.id}
        render={({ field }) => (
          <Textarea
            placeholder='Chúng tôi hoan nghênh mọi góp ý của bạn.'
            flex={1}
            disabled={isSubmitting || !user?.user?.id}
            {...field}
            error={errors.comment?.message}
          />
        )}
      />
      <BButton
        type='submit'
        radius='md'
        size='sm'
        fullWidth
        loading={isSubmitting}
        disabled={isSubmitting || watch('comment') === '' || watch('rating') === 0 || !isDirty || !user?.user?.id}
        children='Đánh giá'
      />
    </form>
  );
};
