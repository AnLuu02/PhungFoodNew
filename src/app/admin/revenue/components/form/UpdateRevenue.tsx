'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, Group, NumberInput, Select, TextInput } from '@mantine/core';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { api } from '~/trpc/react';

const revenueSchema = z.object({
  id: z.string(),
  userId: z.string(),
  totalSpent: z.number(),
  totalOrders: z.number(),
  day: z.number(),
  year: z.number(),
  month: z.number()
});

type revenueForm = z.infer<typeof revenueSchema>;

export default function UpdateRevenue({ id, setOpened }: { id: string; setOpened: Dispatch<SetStateAction<boolean>> }) {
  const { data: users } = api.User.getAll.useQuery();
  const { data: revenue } = api.Revenue.getOne.useQuery({ id });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<revenueForm>({
    resolver: zodResolver(revenueSchema),
    defaultValues: {
      userId: '',
      totalSpent: 0,
      totalOrders: 0,
      day: 0,
      year: 0,
      month: 0
    }
  });

  const utils = api.useUtils();
  const createRevenueMutation = api.Revenue.update.useMutation({
    onSuccess: () => {
      utils.Revenue.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  useEffect(() => {
    if (!revenue) return;
    reset({
      id: revenue.id,
      userId: revenue.userId,
      totalSpent: Number(revenue.totalSpent) || 0,
      totalOrders: revenue.totalOrders,
      day: revenue.day,
      year: revenue.year,
      month: revenue.month
    });
  }, [revenue]);

  const onSubmit: SubmitHandler<revenueForm> = async formData => {
    try {
      const result = await createRevenueMutation.mutateAsync(formData);
      if (result) {
        NotifySuccess('Tạo doanh thu thành công');
        setOpened(false);
      }
    } catch {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid gutter='md'>
        <Controller
          name='id'
          control={control}
          render={({ field }) => (
            <TextInput hidden {...field} error={errors.id?.message} className='hidden' radius='md' />
          )}
        />
        <Grid.Col span={6}>
          <Controller
            name='userId'
            control={control}
            render={({ field }) => (
              <Select
                label='Khách hàng'
                searchable
                radius='md'
                placeholder='Chọn khách hàng'
                data={users?.map((user: any) => ({ value: user.id, label: user.name }))}
                {...field}
                error={errors.userId?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='totalSpent'
            render={({ field }) => (
              <NumberInput
                radius={'md'}
                {...field}
                label='Tổng chi'
                required
                size='sm'
                placeholder='Nhập Tổng chi'
                error={errors.totalSpent?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='totalOrders'
            render={({ field }) => (
              <NumberInput
                radius={'md'}
                {...field}
                label='Tổng đơn hàng'
                required
                size='sm'
                placeholder='Nhập Tổng chi'
                error={errors.totalSpent?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='day'
            render={({ field }) => (
              <NumberInput
                radius={'md'}
                {...field}
                label='Ngày'
                required
                min={1}
                max={30}
                size='sm'
                placeholder='Nhập Ngày'
                error={errors.totalSpent?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='month'
            render={({ field }) => (
              <NumberInput
                radius={'md'}
                {...field}
                label='Tháng'
                min={1}
                max={12}
                required
                size='sm'
                placeholder='Nhập Tháng'
                error={errors.totalSpent?.message}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='year'
            render={({ field }) => (
              <NumberInput
                radius={'md'}
                {...field}
                label='Năm'
                required
                min={2023}
                max={3000}
                size='sm'
                placeholder='Nhập Năm'
                error={errors.totalSpent?.message}
              />
            )}
          />
        </Grid.Col>
      </Grid>

      <Group align='center' justify='flex-end' className='mt-4'>
        <Button type='submit' loading={isSubmitting} disabled={!isDirty}>
          Cập nhật
        </Button>
      </Group>
    </form>
  );
}
