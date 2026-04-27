import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Group, Modal, MultiSelect, Select, Stack, TextInput, Title } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useEffect, useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { NotificationTemplate, notificationTemplateSchema } from '~/shared/schema/notification.schema';
import { api } from '~/trpc/react';
import { notificationTypeOptions } from '../../helpers';
import { TemplateTextarea } from '../TemplateTextarea';

interface Props {
  opened: boolean;
  onClose: () => void;
  defaultValues?: Partial<NotificationTemplate>;
  mode?: 'create' | 'update';
}

export const NotificationTemplateModal = ({ opened, onClose, defaultValues, mode = 'create' }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<NotificationTemplate>({
    resolver: zodResolver(notificationTemplateSchema),
    defaultValues
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const utils = api.useUtils();
  const mutationCreate = api.NotificationTemplate.create.useMutation({
    onSuccess: () => {
      utils.NotificationTemplate.invalidate();
      NotifySuccess('Tạo mẫu thông báo thanh cong');
    },
    onError: e => {
      NotifySuccess('Tạo mẫu thông báo that bai', e.message);
    }
  });
  const mutationUpdate = api.NotificationTemplate.update.useMutation({
    onSuccess: () => {
      utils.NotificationTemplate.invalidate();
      NotifySuccess('Cập nhật mẫu thông báo thanh cong');
    },
    onError: e => {
      NotifySuccess('Cập nhật mẫu thông báo that bai', e.message);
    }
  });
  const [deboucedVariables] = useDebouncedValue(watch('message') + watch('title'), 1000);
  const variables = useMemo(() => {
    if (deboucedVariables) {
      const regex = /{{\s*(.*?)\s*}}/g;
      const matches = [...deboucedVariables.matchAll(regex)];
      return matches.map(match => match[1]) as string[];
    }
    return [];
  }, [deboucedVariables]);
  useEffect(() => {
    if (opened && !defaultValues) {
      reset({});
    }
  }, [opened]);
  const onSubmit: SubmitHandler<NotificationTemplate> = async formData => {
    try {
      if (mode === 'create') {
        await mutationCreate.mutateAsync({
          ...formData
        });
        onClose();
      } else {
        await mutationUpdate.mutateAsync({
          id: formData.id as string,
          data: {
            ...formData,
            variables: variables
          }
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
      onClose={onClose}
      size='lg'
      title={
        <Title order={2} className='font-quicksand'>
          {mode === 'create' ? 'Tạo Template mới' : 'Cập nhật Template'}
        </Title>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <TextInput placeholder='Tên Template' label='Tên Template' {...field} error={errors.name?.message} />
            )}
          />
          <Controller
            name='title'
            control={control}
            render={({ field }) => (
              <TextInput placeholder='Tiêu đề' label='Tiêu đề' {...field} error={errors.title?.message} />
            )}
          />

          <TemplateTextarea name='message' control={control} label='Nội dung' />
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
          <Controller
            name='category'
            control={control}
            render={({ field }) => (
              <TextInput
                placeholder='Danh mục: Giới thiệu, Lời chào hệ thống,...'
                label='Danh mục'
                {...field}
                error={errors.category?.message}
              />
            )}
          />
          <Controller
            name='variables'
            control={control}
            render={({ field }) => (
              <MultiSelect
                readOnly
                label='Biến (ngăn cách bằng dấu phẩy)'
                placeholder='Ví dụ: userName, orderId'
                value={variables}
                onChange={() => field.onChange(variables)}
              />
            )}
          />
          <Group justify='flex-end'>
            <Button variant='danger' onClick={onClose}>
              Hủy
            </Button>
            <Button loading={isSubmitting} type='submit'>
              {mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
