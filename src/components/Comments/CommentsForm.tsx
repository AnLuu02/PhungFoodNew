'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Flex, Rating, Text, Textarea } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import { NotifyError, NotifySuccess, NotifyWarning } from '~/lib/FuncHandler/toast';
import { reviewSchema } from '~/lib/ZodSchema/schema';
import { api } from '~/trpc/react';
import { Review } from '~/types/review';

export const CommentsForm = ({ product }: { product: any }) => {
  const { data: user } = useSession();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<Review>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      id: '',
      productId: product?.id ?? '',
      userId: user?.user?.id ?? '',
      rating: 1.0,
      comment: ''
    }
  });
  const utils = api.useUtils();
  const mutation = api.Review.create.useMutation({
    onSuccess: result => {
      utils.Review.invalidate();
      utils.Product.invalidate();
      reset({ productId: product?.id, userId: user?.user?.id || '' });
      NotifySuccess(result.message);
    },
    onError: error => {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.', error.message);
    }
  });

  useEffect(() => {
    reset({
      ...watch(),
      productId: product?.id,
      userId: user?.user?.id || ''
    });
  }, [product?.id, user?.user?.id]);
  const onSubmit: SubmitHandler<Review> = async formData => {
    if (!user?.user?.id) {
      NotifyWarning('Chưa đăng nhập', 'Vui lý đăng nhập để đánh giá sản phẩm.');
      return;
    }
    await mutation.mutateAsync(formData);
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
          render={({ field }) => <Rating size='lg' color={'#FFC522'} {...field} />}
        />
      </Flex>
      <Controller
        control={control}
        name='comment'
        render={({ field }) => (
          <Textarea
            radius={'md'}
            placeholder='Chúng tôi hoan nghênh mọi góp ý của bạn.'
            flex={1}
            {...field}
            error={errors.comment?.message}
          />
        )}
      />
      <BButton type='submit' fullWidth loading={isSubmitting} disabled={isSubmitting} children='Đánh giá' />
    </form>
  );
};
