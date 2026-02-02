'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Group,
  InputBase,
  Modal,
  MultiSelect,
  Select,
  Stack,
  TagsInput,
  TextInput,
  Textarea,
  Title
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import { generateNotifyHtml } from '~/lib/FuncHandler/MailHelpers/generateNotifyHtml';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { notificationSchema } from '~/lib/ZodSchema/schema';
import { api } from '~/trpc/react';
import { NotificationClientHasUser, NotificationClientType } from '~/types';
import { notificationTypeOptions } from '../../helpers';

interface NotificationModalProps {
  opened: boolean;
  onClose: () => void;
  defaultValues?: Partial<NotificationClientHasUser>;
  mode?: 'create' | 'update' | 'template';
  recipient?: 'all' | 'individual' | undefined;
}

export const NotificationModal = ({
  opened,
  onClose,
  defaultValues,
  mode = 'create',
  recipient
}: NotificationModalProps) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const {
    control,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<NotificationClientType>({
    resolver: zodResolver(notificationSchema),
    defaultValues
  });
  const { data: allUsers = [], isLoading: isLoadingUsers } = api.User.getNotGuest.useQuery(undefined, {
    enabled: !!watch('recipient')
  });
  const { data: templates, isLoading: isLoadingTemplate } = api.NotificationTemplate.getAll.useQuery(undefined, {
    enabled: !!opened
  });
  const templateData = templates?.data || [];
  const utils = api.useUtils();
  const mutationCreate = api.Notification.create.useMutation({
    onSuccess: () => {
      utils.Notification.invalidate();
      NotifySuccess('Tạo thông báo thanh cong');
    },
    onError: e => {
      NotifySuccess('Tạo thông báo that bai', e.message);
    }
  });
  const mutationUpdate = api.Notification.update.useMutation({
    onSuccess: () => {
      utils.Notification.invalidate();
      NotifySuccess('Cập nhật thông báo thanh cong');
    },
    onError: e => {
      NotifySuccess('Cập nhật thông báo that bai', e.message);
    }
  });

  const mutationPushOnline = api.Notification.pushOnline.useMutation({
    onSuccess: () => {
      utils.Notification.invalidate();
    },
    onError: e => {
      NotifySuccess('Cập nhật thông báo that bai', e.message);
    }
  });
  useEffect(() => {
    if (opened && !defaultValues) {
      reset({});
    }
  }, [opened]);
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
      const users = defaultValues?.recipients
        ? defaultValues?.recipients?.map((recipient: any) =>
            JSON.stringify({ id: recipient?.user?.id, email: recipient?.user?.email })
          )
        : [];
      setSelectedUsers(users);
    }
    if (recipient) {
      setValue('recipient', recipient);
    }
  }, [defaultValues, recipient]);

  const onSubmit: SubmitHandler<NotificationClientType> = async formData => {
    try {
      if (mode === 'create') {
        let userPushers = watch('recipient') === 'all' ? [] : selectedUsers.map((user: any) => JSON.parse(user).id);

        const createNotify = await mutationCreate.mutateAsync({
          ...formData,
          userIds: userPushers
        });
        if (createNotify.code !== 'OK') {
          throw new Error(createNotify.message);
        }
        await Promise.all([
          ...formData.channels.map(async channel => {
            channel === 'in_app' &&
              (await mutationPushOnline.mutateAsync({
                notificationId: createNotify.data.id as string,
                userIds: userPushers
              }));
            if (channel === 'email') {
              const html = generateNotifyHtml(formData);
              const emails =
                watch('recipient') === 'all'
                  ? allUsers.map(user => user.email)
                  : selectedUsers.map((user: any) => JSON.parse(user).email);
              fetch('/api/send-mail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  from: 'Phụng Food Restaurant',
                  to_n: emails,
                  idRecord: '',
                  subject: 'Thông báo từ hệ thông Phụng Food',
                  data: html
                })
              });
            }
          })
        ]);
        onClose();
      } else {
        await mutationUpdate.mutateAsync({
          id: formData.id as string,
          data: formData
        });
        onClose();
      }
    } catch (err) {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  };

  return (
    <Modal
      opened={opened}
      radius={'md'}
      closeOnClickOutside={false}
      onClose={() => {
        reset({});
        onClose();
      }}
      size='lg'
      title={
        <Title className='font-quicksand' order={2}>
          {mode === 'create' ? 'Tạo thông báo mới' : 'Cập nhật thông báo'}
        </Title>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Controller
            name='id'
            control={control}
            render={({ field }) => <TextInput className='hidden' {...field} error={errors.title?.message} />}
          />
          <Controller
            name='title'
            control={control}
            render={({ field }) => (
              <TextInput
                radius={'md'}
                label='Tiêu đề'
                placeholder='Nhập tiêu đề...'
                {...field}
                error={errors.title?.message}
              />
            )}
          />

          <Controller
            name='message'
            control={control}
            render={({ field }) => (
              <Textarea
                radius={'md'}
                label='Nội dung'
                placeholder='Nhập nội dung thông báo...'
                minRows={3}
                {...field}
                error={errors.message?.message}
              />
            )}
          />

          <Group grow>
            <Controller
              name='type'
              control={control}
              render={({ field }) => (
                <Select
                  radius={'md'}
                  label='Loại thông báo'
                  placeholder='Chọn loại...'
                  data={Object.entries(notificationTypeOptions).map(([key, value]) => ({
                    value: key,
                    label: value.viName
                  }))}
                  {...field}
                  error={errors.type?.message}
                />
              )}
            />

            <Controller
              name='priority'
              defaultValue='medium'
              control={control}
              render={({ field }) => (
                <Select
                  radius={'md'}
                  label='Mức ưu tiên'
                  placeholder='Chọn mức...'
                  data={[
                    { value: 'low', label: 'Thấp' },
                    { value: 'medium', label: 'Trung bình' },
                    { value: 'high', label: 'Cao' },
                    { value: 'urgent', label: 'Khẩn cấp' }
                  ]}
                  {...field}
                  error={errors.priority?.message}
                />
              )}
            />
          </Group>

          <Controller
            name='recipient'
            defaultValue='all'
            control={control}
            render={({ field }) => (
              <Select
                label='Đối tượng nhận'
                radius={'md'}
                placeholder='Chọn đối tượng...'
                data={[
                  {
                    value: 'individual',
                    label: 'Người nhận tùy chọn'
                  },
                  {
                    value: 'all',
                    label: 'Áp dụng cho tất cả'
                  }
                ]}
                {...field}
                error={errors.recipient?.message}
              />
            )}
          />
          {watch('recipient') === 'individual' && (
            <MultiSelect
              label='Chọn người dùng'
              disabled={allUsers.length === 0}
              data={allUsers.map(u => ({
                value: JSON.stringify({ id: u.id, email: u.email }),
                label: u.name ? `${u.name} (${u.email})` : u.email
              }))}
              value={selectedUsers.map(u => u?.trim())}
              onChange={setSelectedUsers}
              searchable
              mt='md'
              rightSection={isLoadingUsers ? <LoadingSpiner /> : undefined}
              error={
                (selectedUsers.length === 0 && 'Chưa chọn người dùng') ||
                (allUsers.length === 0 && 'Hiện không có khách hàng.')
              }
            />
          )}

          <Controller
            name='channels'
            control={control}
            defaultValue={['in_app']}
            render={({ field }) => (
              <MultiSelect
                radius={'md'}
                clearable
                label='Kênh gửi thông báo'
                placeholder='Chọn kênh gửi...'
                data={[
                  { value: 'in_app', label: 'In-App' },
                  { value: 'push', label: 'Push' },
                  { value: 'email', label: 'Email' },
                  { value: 'sms', label: 'SMS' }
                ]}
                {...field}
                value={field.value || []}
                onChange={field.onChange}
                error={errors.channels?.message}
              />
            )}
          />

          <Controller
            name='scheduledAt'
            control={control}
            render={({ field }) => (
              <InputBase
                radius={'md'}
                label='Lên lịch (tùy chọn)'
                type='datetime-local'
                value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                onChange={e => field.onChange(new Date(e.target.value))}
              />
            )}
          />

          <Controller
            name='templateId'
            control={control}
            render={({ field }) => (
              <Select
                label='Mẫu có sẵn'
                radius={'md'}
                placeholder='Chọn mẫu có sẵn...'
                disabled={templateData.length === 0 || isLoadingTemplate}
                data={templateData?.map((t: any) => ({ value: t.id, label: t.name }))}
                {...field}
                error={errors.recipient?.message}
              />
            )}
          />

          <Controller
            control={control}
            name='tags'
            render={({ field }) => (
              <TagsInput {...field} label='Gắn tag cho sản phẩm' placeholder='Gắn tag cho sản phẩm' clearable />
            )}
          />

          <Group justify='flex-end' mt='md'>
            <BButton variant='outline' onClick={onClose}>
              Hủy
            </BButton>
            <BButton loading={isSubmitting} type='submit'>
              {mode === 'create' ? 'Tạo mới và gửi' : 'Cập nhật và gửi'}
            </BButton>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
