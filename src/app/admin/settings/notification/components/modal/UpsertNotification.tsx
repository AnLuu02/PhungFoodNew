'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Grid,
  GridCol,
  Group,
  InputBase,
  Modal,
  MultiSelect,
  Select,
  TagsInput,
  TextInput,
  Textarea
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import { generateNotifyHtml } from '~/lib/FuncHandler/MailHelpers/generateNotifyHtml';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { Notification, notificationSchema } from '~/shared/schema/notification.schema';
import type { NotificationBase } from '~/shared/type-trpc/notification.type-trpc';
import { api } from '~/trpc/react';
import { notificationTypeOptions } from '../../helpers';

interface NotificationModalProps {
  opened: boolean;
  onClose: () => void;
  defaultValues?: Partial<NotificationBase> & { templateId?: string };
  mode?: 'create' | 'update' | 'template';
  recipient?: 'all' | 'individual' | undefined;
}

export const UpsertNotificationModal = ({
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
    getValues,
    formState: { errors, isSubmitting }
  } = useForm<Notification>({
    resolver: zodResolver(notificationSchema),
    defaultValues
  });
  const { data, isLoading: isLoadingUsers } = api.User.getNotGuest.useQuery(undefined, {
    enabled: !!watch('recipient')
  });
  const { data: templates, isLoading: isLoadingTemplate } = api.NotificationTemplate.getTemplatesBase.useQuery(
    undefined,
    {
      enabled: !!opened
    }
  );

  const allUsers = data ?? [];
  const templateData = templates || [];
  const utils = api.useUtils();
  const mutationCreate = api.Notification.create.useMutation({
    onSuccess: () => {
      utils.Notification.invalidate();
      NotifySuccess('Tạo thông báo thành công.');
    },
    onError: e => {
      NotifyError('Tạo thông báo thất bại', e.message);
    }
  });
  const mutationUpdate = api.Notification.update.useMutation({
    onSuccess: () => {
      utils.Notification.invalidate();
      NotifySuccess('Cập nhật thông báo thành công.');
    },
    onError: e => {
      NotifyError('Cập nhật thông báo thất bại', e.message);
    }
  });

  const mutationPushOnline = api.Notification.pushOnline.useMutation({
    onSuccess: () => {
      utils.Notification.invalidate();
    },
    onError: e => {
      NotifyError('Cập nhật thông báo thất bại', e.message);
    }
  });

  useEffect(() => {
    if (opened && !defaultValues) {
      reset({});
    }
  }, [opened]);

  useEffect(() => {
    if (defaultValues) {
      reset({ ...defaultValues, templateId: defaultValues.templateId });
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

  useEffect(() => {
    const templateId = getValues('templateId');
    if (templateId && !defaultValues?.templateId) {
      const template = templateData.find(t => t.id === templateId);
      if (template) {
        reset(template);
      }
    }
  }, [watch('templateId'), defaultValues?.templateId]);

  const onSubmit: SubmitHandler<Notification> = async formData => {
    try {
      if (mode === 'create') {
        try {
          let userPushers = watch('recipient') === 'all' ? [] : selectedUsers.map((user: any) => JSON.parse(user).id);
          const createNotify = await mutationCreate.mutateAsync({
            ...formData,
            userIds: userPushers
          });
          await Promise.all([
            ...formData.channels.map(async channel => {
              channel === 'in_app' &&
                (await mutationPushOnline.mutateAsync({
                  notificationId: createNotify.metaData.after.id as string,
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
        } catch (e) {
          NotifyError('Đã có lỗi không mong muốn xảy ra. Hãy kiểm tra chi tiết trong console.');
          console.error(e);
        } finally {
          onClose();
        }
      } else {
        await mutationUpdate.mutateAsync({
          id: formData.id as string,
          data: formData
        });
        onClose();
      }
    } catch (e) {
      NotifyError('Đã có lỗi không mong muốn xảy ra. Hãy kiểm tra chi tiết trong console.');
      console.error(e);
    }
  };

  console.log(watch());

  return (
    <Modal
      opened={opened}
      closeOnClickOutside={false}
      onClose={() => {
        reset({});
        onClose();
      }}
      size='70%'
      title={mode === 'create' ? 'Tạo thông báo mới' : 'Cập nhật thông báo'}
      classNames={{
        title: 'font-quicksand text-2xl font-bold'
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid>
          <GridCol span={12}>
            <Controller
              name='templateId'
              control={control}
              render={({ field }) => (
                <Select
                  label='Mẫu có sẵn (tùy chọn)'
                  placeholder='Chọn mẫu có sẵn...'
                  disabled={templateData.length === 0 || isLoadingTemplate}
                  data={templateData.map(t => ({ value: t.id, label: t.name }))}
                  {...field}
                  error={errors.recipient?.message}
                />
              )}
            />
          </GridCol>
          <Controller
            name='id'
            control={control}
            render={({ field }) => <TextInput className='hidden' {...field} error={errors.title?.message} />}
          />
          <GridCol span={8}>
            <Controller
              name='title'
              control={control}
              render={({ field }) => (
                <TextInput label='Tiêu đề' placeholder='Nhập tiêu đề...' {...field} error={errors.title?.message} />
              )}
            />
          </GridCol>

          <GridCol span={4}>
            <Controller
              name='type'
              control={control}
              render={({ field }) => (
                <Select
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
          </GridCol>
          <GridCol span={12}>
            <Controller
              name='message'
              control={control}
              render={({ field }) => (
                <Textarea
                  label='Nội dung'
                  placeholder='Nhập nội dung thông báo...'
                  minRows={3}
                  {...field}
                  error={errors.message?.message}
                />
              )}
            />
          </GridCol>
          <GridCol span={4}>
            <Controller
              name='priority'
              defaultValue='medium'
              control={control}
              render={({ field }) => (
                <Select
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
          </GridCol>
          <GridCol span={4}>
            <Controller
              name='recipient'
              defaultValue='all'
              control={control}
              render={({ field }) => (
                <Select
                  label='Đối tượng nhận'
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
          </GridCol>
          <GridCol span={4}>
            <Controller
              name='channels'
              control={control}
              defaultValue={['in_app']}
              render={({ field }) => (
                <MultiSelect
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
          </GridCol>
          {watch('recipient') === 'individual' && (
            <GridCol span={12}>
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
                rightSection={isLoadingUsers ? <LoadingSpiner /> : undefined}
                error={
                  (selectedUsers.length === 0 && 'Chưa chọn người dùng') ||
                  (allUsers.length === 0 && 'Hiện không có khách hàng.')
                }
              />
            </GridCol>
          )}
          <GridCol span={4}>
            <Controller
              name='scheduledAt'
              control={control}
              render={({ field }) => (
                <InputBase
                  label='Lên lịch (tùy chọn)'
                  type='datetime-local'
                  value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                  onChange={e => field.onChange(new Date(e.target.value))}
                />
              )}
            />
          </GridCol>
          <GridCol span={8}>
            <Controller
              control={control}
              name='tags'
              render={({ field }) => <TagsInput {...field} label='Gắn tags ' placeholder='Gắn tags ' clearable />}
            />
          </GridCol>

          <GridCol span={12}>
            <Group justify='flex-end'>
              <Button variant='danger' onClick={onClose}>
                Hủy
              </Button>
              <Button loading={isSubmitting} type='submit'>
                {mode === 'create' ? 'Tạo mới và gửi' : 'Cập nhật và gửi'}
              </Button>
            </Group>
          </GridCol>
        </Grid>
      </form>
    </Modal>
  );
};
