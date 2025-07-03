'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, GridCol, MultiSelect, Paper, Stack, Switch, Text, Textarea, TextInput } from '@mantine/core';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Notification } from '~/Entity/Notification';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { notificationSchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';

export default function CreateNotification({ setOpened }: { setOpened: any }) {
  const { data: user, isLoading: isLoadingUser } = api.User.getAll.useQuery();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<Notification>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      id: '',
      title: '',
      message: '',
      isRead: false,
      isSendToAll: false,
      userId: []
    }
  });

  const utils = api.useUtils();
  const mutation = api.Notification.create.useMutation({
    onSuccess: () => {
      utils.Notification.invalidate();
    }
  });
  const selectedUserIds = watch('userId', []);
  const selectedUsers = user && user.filter(u => selectedUserIds.includes(u.id));
  const onSubmit: SubmitHandler<Notification> = async formData => {
    try {
      if (formData) {
        let result = await mutation.mutateAsync(formData);
        setOpened(false);
        if (!result.success) {
          NotifyError(result.message);
          return;
        }
        NotifySuccess(result.message);
      }
    } catch (error) {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  };

  return isLoadingUser ? (
    <LoadingSpiner />
  ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid gutter='md'>
        <GridCol span={6}>
          <Stack>
            <Controller
              control={control}
              name='title'
              render={({ field }) => (
                <TextInput
                  {...field}
                  label='Tiêu đề'
                  size='sm'
                  placeholder='Nhập Tiêu đề'
                  error={errors.title?.message}
                />
              )}
            />

            <Controller
              control={control}
              name='message'
              render={({ field }) => (
                <Textarea
                  size='sm'
                  label='Nội dung'
                  placeholder='Nhập Nội dung'
                  error={errors.message?.message}
                  {...field}
                />
              )}
            />
          </Stack>
        </GridCol>
        <GridCol span={6}>
          <Stack>
            <Controller
              control={control}
              name='isSendToAll'
              render={({ field }) => (
                <Switch {...field} label='Gửi cho tất cả' checked={field.value} value={undefined} />
              )}
            />

            <Controller
              control={control}
              name='userId'
              render={({ field }) => (
                <MultiSelect
                  {...field}
                  size='sm'
                  label='Nguời dùng'
                  placeholder='Nguời dùng'
                  multiple
                  data={user?.map(u => ({ value: u.id, label: u.name }))}
                  disabled={watch('isSendToAll')}
                  error={errors.userId?.message}
                />
              )}
            />

            {!watch('isSendToAll') && selectedUsers && selectedUsers.length > 0 && (
              <Paper withBorder p='sm'>
                <Text fw={700} mb='xs'>
                  Danh sách đã chọn:
                </Text>
                {selectedUsers.map(u => (
                  <Text key={u.id} size='sm'>
                    📧 {u.email} - {u.name}
                  </Text>
                ))}
              </Paper>
            )}
          </Stack>
        </GridCol>
      </Grid>

      <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth>
        Tạo mới
      </Button>
    </form>
  );
}
