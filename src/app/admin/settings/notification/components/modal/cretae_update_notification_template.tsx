import { zodResolver } from '@hookform/resolvers/zod';
import { Group, Modal, MultiSelect, Select, Stack, TextInput, Title } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useEffect, useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { notificationTemplateSchema } from '~/lib/ZodSchema/schema';
import { api } from '~/trpc/react';
import { NotificationTemplateClientType } from '~/types';
import { notificationTypeOptions } from '../../helpers';
import { TemplateTextarea } from '../TemplateTextarea';

interface Props {
  opened: boolean;
  onClose: () => void;
  defaultValues?: Partial<NotificationTemplateClientType>;
  mode?: 'create' | 'update';
}

export const NotificationTemplateModal = ({ opened, onClose, defaultValues, mode = 'create' }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<NotificationTemplateClientType>({
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
  const onSubmit: SubmitHandler<NotificationTemplateClientType> = async formData => {
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
      radius={'md'}
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
              <TextInput
                radius={'md'}
                placeholder='Tên Template'
                label='Tên Template'
                {...field}
                error={errors.name?.message}
              />
            )}
          />
          <Controller
            name='title'
            control={control}
            render={({ field }) => (
              <TextInput radius={'md'} placeholder='Tiêu đề' label='Tiêu đề' {...field} error={errors.title?.message} />
            )}
          />
          {/* <Controller
            name='message'
            control={control}
            render={({ field }) => (
              <Textarea
                radius={'md'}
                placeholder='Nội dung'
                label='Nội dung'
                {...field}
                error={errors.message?.message}
              />
            )}
          /> */}
          <TemplateTextarea name='message' control={control} label='Nội dung' />
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
            name='category'
            control={control}
            render={({ field }) => (
              <TextInput
                radius={'md'}
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
                radius={'md'}
                readOnly
                label='Biến (ngăn cách bằng dấu phẩy)'
                placeholder='Ví dụ: userName, orderId'
                value={variables}
                onChange={() => field.onChange(variables)}
              />
            )}
          />
          <Group justify='flex-end'>
            <BButton variant='outline' onClick={onClose}>
              Hủy
            </BButton>
            <BButton loading={isSubmitting} type='submit'>
              {mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
            </BButton>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
