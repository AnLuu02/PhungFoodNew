'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, Group, NumberInput, Select } from '@mantine/core';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { api } from '~/trpc/react';

const revenueSchema = z.object({
  userId: z.string(),
  totalSpent: z.number(),
  totalOrders: z.number(),
  day: z.number(),
  year: z.number(),
  month: z.number()
});

type revenueForm = z.infer<typeof revenueSchema>;

export default function CreateRevenue({ setOpened }: { setOpened: Dispatch<SetStateAction<boolean>> }) {
  const [users, setUsers] = useState<any>([]);
  const {
    control,
    handleSubmit,
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
  const createRevenueMutation = api.Revenue.create.useMutation({
    onSuccess: () => {
      utils.Revenue.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

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
        <Grid.Col span={6}>
          <Controller
            name='userId'
            control={control}
            render={({ field }) => (
              <Select
                label='Khách hàng'
                onClick={async () => {
                  const usersData = await utils.User.getAll.fetch();
                  setUsers(usersData);
                }}
                searchable
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
                {...field}
                label='Ngày'
                required
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
                {...field}
                label='Tháng'
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
                {...field}
                label='Năm'
                required
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
          Tạo mới
        </Button>
      </Group>
    </form>
  );
}
