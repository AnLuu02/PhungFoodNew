'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Flex, Grid, NumberInput, Rating, Select, Textarea } from '@mantine/core';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { UserRole } from '~/shared/constants/user';
import { baseReviewSchema, ReviewInput } from '~/shared/schema/review.schema';
import { api } from '~/trpc/react';

export default function ReviewUpsert({
  reviewId,
  setOpened
}: {
  reviewId?: string;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const { data } = api.Review.getOne.useQuery({ id: reviewId || '' }, { enabled: !!reviewId });
  const { data: products } = api.Product.getAll.useQuery({ hasReview: true, userRole: UserRole.ADMIN });
  const { data: users } = api.User.getAll.useQuery();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset
  } = useForm<ReviewInput>({
    resolver: zodResolver(baseReviewSchema),
    defaultValues: {
      id: undefined,
      userId: '',
      productId: '',
      rating: 0.0,
      comment: ''
    }
  });

  useEffect(() => {
    if (data) {
      reset({
        id: data?.id,
        userId: data?.userId,
        productId: data?.productId,
        rating: data?.rating,
        comment: data?.comment || ''
      });
    }
  }, [data, reset]);

  const utils = api.useUtils();
  const updateMutation = api.Review.upsert.useMutation({
    onSuccess: () => {
      NotifySuccess('Chúc mừng bạn đã thao tác thành công.');
      setOpened(false);
      utils.Review.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  const onSubmit: SubmitHandler<ReviewInput> = async formData => {
    await updateMutation.mutateAsync(formData);
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
                <NumberInput label='Đánh giá' {...field} min={0} max={5} error={errors.rating?.message} />
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
      <Button type='submit' className='mt-4' loading={isSubmitting} disabled={!isDirty} fullWidth>
        Cập nhật
      </Button>
    </form>
  );
}
