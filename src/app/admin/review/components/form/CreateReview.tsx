'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Flex, Grid, NumberInput, Rating, Select, Textarea } from '@mantine/core';
import type { Dispatch, SetStateAction } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import { UserRole } from '~/constants';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { reviewSchema } from '~/lib/ZodSchema/schema';
import { api } from '~/trpc/react';
import { ReviewClientType } from '~/types';
import { ProductAll, UserAll } from '~/types/client-type-trpc';

export default function CreateReview({ setOpened }: { setOpened: Dispatch<SetStateAction<boolean>> }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<ReviewClientType>({
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
    userRole: UserRole.ADMIN
  });
  const { data: users } = api.User.getAll.useQuery();

  const utils = api.useUtils();
  const mutation = api.Review.create.useMutation({
    onSuccess: () => {
      utils.Review.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  const onSubmit: SubmitHandler<ReviewClientType> = async formData => {
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
                radius='md'
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
                  users?.map((user: NonNullable<UserAll>[0]) => ({ value: user.id, label: user.name || 'Khách' })) || []
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
                <NumberInput
                  radius={'md'}
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
      <BButton type='submit' className='mt-4' loading={isSubmitting} disabled={!isDirty} fullWidth>
        Tạo mới
      </BButton>
    </form>
  );
}
