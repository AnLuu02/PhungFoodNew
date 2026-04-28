'use client';

import { Alert, Button, Group, Modal, Select, SimpleGrid, Switch, Text, TextInput, Title } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TEMPLATE_OPTIONS } from '~/lib/FuncHandler/generateSocial';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { api } from '~/trpc/react';

export function SocialLinkModal({
  opened,
  onClose,
  restaurantId,
  index
}: {
  opened: { open: boolean; social?: any };
  onClose: any;
  restaurantId: string;
  index: number;
}) {
  const { control, getValues, setValue, reset } = useFormContext();
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const utils = api.useUtils();
  const isEdit = Boolean(opened?.social);
  const currentIndex = isEdit ? index : index + 1;
  const mutationUpsert = api.Restaurant.upsertSocial.useMutation({
    onSuccess: () => {
      utils.Restaurant.invalidate();
      setLoading(false);
      NotifySuccess('Chúc mừng bạn đã thao tác thành công.');
      onClose();
      reset(getValues());
      return;
    },
    onError: err => {
      NotifyError(err.message);
      setLoading(false);
    }
  });

  const onSubmit = async () => {
    setLoading(true);
    const values = getValues(`socials.${currentIndex}`);
    await mutationUpsert.mutateAsync({
      ...values,
      restaurantId
    });
  };

  const handleTemplateSelect = (templateValue: string | null) => {
    if (!templateValue) return;
    const template = TEMPLATE_OPTIONS.find(t => t.value === templateValue);
    if (template) {
      setSelectedTemplate(template);
      setValue(`socials.${currentIndex}`, template.defaultData);
    }
  };

  useEffect(() => {
    if (opened?.social) {
      setValue(`socials.${currentIndex}`, opened?.social);
    } else {
    }
  }, [opened?.open, opened?.social]);

  return (
    <Modal
      opened={opened?.open}
      zIndex={150}
      onClose={onClose}
      title={
        <Title order={3} className='font-quicksand'>
          {isEdit ? 'Cập nhật liên kết' : 'Tạo liên kết mới'}
          {opened?.social?.label && <b className='text-mainColor'>: {opened?.social?.label}</b>}
        </Title>
      }
      size='lg'
    >
      {selectedTemplate?.value === 'custom' && (
        <Alert icon={<IconAlertCircle size={18} />} mb={'xs'} color='yellow' title='Cảnh báo hành động'>
          <Text size='sm'>
            <strong>Lưu ý:</strong> Đây là lựa chọn không khuyến cáo. Hãy liên hệ kĩ thuật viên hoặc nếu bạn là người
            hiểu nguyên tắc hoạt đông./
          </Text>
        </Alert>
      )}
      <SimpleGrid cols={2} mb={'md'}>
        <Select
          label='Mẫu liên kết'
          defaultValue={opened?.social?.platform || ''}
          placeholder='Chọn mẫu có sẵn'
          data={TEMPLATE_OPTIONS}
          onChange={handleTemplateSelect}
        />
        <Controller
          control={control}
          name={`socials.${currentIndex}.platform`}
          render={({ field }) => <TextInput placeholder='vd: facebook' label='Platform' {...field} />}
        />

        <Controller
          control={control}
          name={`socials.${currentIndex}.label`}
          render={({ field }) => <TextInput placeholder='vd: Facebook' label='Label' {...field} />}
        />

        <Controller
          control={control}
          name={`socials.${currentIndex}.value`}
          render={({ field }) => <TextInput label='Value' placeholder='Số điện thoại hoặc username...' {...field} />}
        />

        <Controller
          control={control}
          name={`socials.${currentIndex}.pattern`}
          render={({ field }) => <TextInput label='Pattern' placeholder='Ví dụ: https://zalo.me/{value}' {...field} />}
        />

        <Controller
          control={control}
          name={`socials.${currentIndex}.icon`}
          render={({ field }) => (
            <TextInput placeholder='vd: brand-facebook' label='Icon (https://tabler.io/icons)' {...field} />
          )}
        />
      </SimpleGrid>
      <Group align='center' justify='space-between'>
        <Controller
          control={control}
          name={`socials.${currentIndex}.isActive`}
          render={({ field }) => (
            <Switch
              label='Kích hoạt'
              checked={field.value}
              className='border-1 border border-solid border-mainColor/50 p-2 hover:bg-mainColor/10'
              onChange={e => {
                field.onChange(e.currentTarget.checked);
              }}
            />
          )}
        />
        <Group justify='flex-end' mt='md'>
          <Button variant='danger' onClick={onClose}>
            Hủy
          </Button>
          <Button type='submit' loading={loading} onClick={onSubmit}>
            {isEdit ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Group>
      </Group>
    </Modal>
  );
}
