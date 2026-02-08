'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Flex, Grid, NumberInput, Rating, Select, Textarea } from '@mantine/core';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import { UserRole } from '~/constants';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { reviewSchema } from '~/lib/ZodSchema/schema';
import { api } from '~/trpc/react';
import { ReviewClientType } from '~/types';
import { ProductAll, UserAll } from '~/types/client-type-trpc';

export default function UpdateReview({
  reviewId,
  setOpened
}: {
  reviewId: string;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const queryResult = api.Review.getFilter.useQuery({ s: reviewId || '' }, { enabled: !!reviewId });
  const { data: products } = api.Product.getAll.useQuery({ userRole: UserRole.ADMIN });
  const { data: users } = api.User.getAll.useQuery();
  const { data } = queryResult;

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset
  } = useForm<ReviewClientType>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      id: '',
      userId: '',
      productId: '',
      rating: 0.0,
      comment: ''
    }
  });

  useEffect(() => {
    if (data && data.length > 0) {
      reset({
        id: data?.[0]?.id,
        userId: data?.[0]?.userId,
        productId: data?.[0]?.productId,
        rating: data?.[0]?.rating,
        comment: data?.[0]?.comment || ''
      });
    }
  }, [data, reset]);

  const utils = api.useUtils();
  const updateMutation = api.Review.update.useMutation({
    onSuccess: () => {
      utils.Review.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  const onSubmit: SubmitHandler<ReviewClientType> = async formData => {
    try {
      if (reviewId) {
        const updatedFormData = { ...formData };
        const result = await updateMutation.mutateAsync({ ...updatedFormData });
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
                radius='md'
                label='Product'
                placeholder=' Chọn sản phẩm'
                data={
                  products?.map((product: NonNullable<ProductAll>[0]) => ({
                    value: product.id,
                    label: product.name
                  })) || []
                }
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
                radius='md'
                placeholder=' Chọn khách hàng'
                data={
                  users?.map((user: NonNullable<UserAll>[0]) => ({ value: user.id, label: user.name || 'Khach' })) || []
                }
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
                <NumberInput label='Đánh giá' {...field} min={0} max={5} error={errors.rating?.message} radius={'md'} />
                <Rating size={'lg'} {...field} fractions={4} color={'#FFC522'} />
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
      <BButton type='submit' className='mt-4' loading={isSubmitting} disabled={!isDirty} fullWidth>
        Cập nhật
      </BButton>
    </form>
  );
}
