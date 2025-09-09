'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Flex, Grid, NumberInput, Rating, Select, Textarea } from '@mantine/core';
import type { Dispatch, SetStateAction } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { reviewSchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { Review } from '~/types/review';

export default function CreateReview({ setOpened }: { setOpened: Dispatch<SetStateAction<boolean>> }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<Review>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      id: '',
      userId: '',
      productId: '',
      rating: 0.0,
      comment: ''
    },
    mode: 'onChange'
  });

  const { data: products } = api.Product.getAll.useQuery({
    hasCategoryChild: true,
    hasCategory: true,
    hasReview: true,
    userRole: 'ADMIN'
  });
  const { data: users } = api.User.getAll.useQuery();

  const utils = api.useUtils();
  const mutation = api.Review.create.useMutation({
    onSuccess: () => {
      utils.Review.invalidate();
    }
  });

  const onSubmit: SubmitHandler<Review> = async formData => {
    try {
      if (formData) {
        const result = await mutation.mutateAsync(formData);
        if (result.code === 'OK') {
          NotifySuccess(result.message);
          setOpened(false);
        }
      }
    } catch {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid gutter='md'>
        <Grid.Col span={6}>
          <Controller
            name='productId'
            control={control}
            render={({ field }) => (
              <Select
                searchable
                label='Product'
                placeholder=' Chọn sản phẩm'
                data={products?.map((product: any) => ({ value: product.id, label: product.name })) || []}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.productId?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            name='userId'
            control={control}
            render={({ field }) => (
              <Select
                searchable
                label='user'
                placeholder=' Chọn khách hàng'
                data={users?.map((user: any) => ({ value: user.id, label: user.name })) || []}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.userId?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Controller
            name='rating'
            control={control}
            rules={{
              required: 'rating is required',
              validate: value => (value >= 0 && value <= 5) || 'Rating must be between 0 and 5'
            }}
            render={({ field }) => (
              <Flex align={'center'} justify={'space-between'}>
                <NumberInput
                  label='Đánh giá'
                  {...field}
                  min={0}
                  max={5}
                  clampBehavior='strict'
                  error={errors.rating?.message}
                />
                <Rating size={'lg'} {...field} fractions={2} color={'#FFC522'} />
              </Flex>
            )}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Controller
            control={control}
            name='comment'
            render={({ field }) => <Textarea label='Bình luận' placeholder='Nhập mô tả' {...field} />}
          />
        </Grid.Col>
      </Grid>
      <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth>
        Tạo mới
      </Button>
    </form>
  );
}
