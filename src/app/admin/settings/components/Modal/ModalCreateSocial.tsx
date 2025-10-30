'use client';

import { Alert, Group, Modal, Select, SimpleGrid, Switch, Text, TextInput, Title } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import { TEMPLATE_OPTIONS } from '~/lib/FuncHandler/generateSocial';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { api } from '~/trpc/react';

export function SocialLinkModal({ opened, onClose, restaurantId, index }: any) {
  const { control, getValues, watch, setValue, reset } = useFormContext();
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const utils = api.useUtils();
  const isEdit = Boolean(opened?.social);

  const createMutation = api.Restaurant.createSocial.useMutation({
    onSuccess: resp => {
      if (resp.code === 'OK') {
        utils.Restaurant.invalidate();
        NotifySuccess(resp.message);
        setLoading(false);
        onClose();
        return;
      }
      NotifyError(resp.message);
      setLoading(false);
    },
    onError: err => {
      NotifyError(err.message);
      setLoading(false);
    }
  });

  const updateMutation = api.Restaurant.updateSocial.useMutation({
    onSuccess: resp => {
      if (resp.code === 'OK') {
        utils.Restaurant.invalidate();
        setLoading(false);
        NotifySuccess(resp.message);
        onClose();
        reset(getValues());
        return;
      }
      NotifyError(resp.message);
      setLoading(false);
    },
    onError: err => {
      NotifyError(err.message);
      setLoading(false);
    }
  });

  const onSubmit = async () => {
    setLoading(true);
    const values = getValues(`socials.${index}`);
    if (isEdit && opened?.social?.id) {
      await updateMutation.mutateAsync({ id: opened?.social?.id, data: values });
    } else {
      await createMutation.mutateAsync({
        ...values,
        restaurantId
      });
    }
  };

  const handleTemplateSelect = (templateValue: string | null) => {
    if (!templateValue) return;
    const template = TEMPLATE_OPTIONS.find(t => t.value === templateValue);
    if (template) {
      setSelectedTemplate(template);
      setValue(`socials.${index}`, template.defaultData);
    }
  };

  useEffect(() => {
    if (opened?.social) {
      setValue(`socials.${index}`, opened?.social);
    }
    if (!opened?.open) {
      setValue(`socials.${index}`, {});
    }
  }, [opened?.open, opened?.social]);

  return (
    <Modal
      opened={opened?.open}
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
        <Alert icon={<IconAlertCircle size={18} />} mb={'xs'} color='yellow' radius={'md'} title='Cảnh báo hành động'>
          <Text size='sm'>
            <strong>Lưu ý:</strong> Đây là lựa chọn không khuyến cáo. Hãy liên hệ kĩ thuật viên hoặc nếu bạn là người
            hiểu nguyên tắc hoạt đông./
          </Text>
        </Alert>
      )}
      <SimpleGrid cols={2} mb={'md'}>
        <Select
          radius='md'
          label='Mẫu liên kết'
          defaultValue={opened?.social?.platform || ''}
          placeholder='Chọn mẫu có sẵn'
          data={TEMPLATE_OPTIONS}
          onChange={handleTemplateSelect}
        />
        <Controller
          control={control}
          name={`socials.${index}.platform`}
          render={({ field }) => <TextInput radius='md' placeholder='vd: facebook' label='Platform' {...field} />}
        />

        <Controller
          control={control}
          name={`socials.${index}.label`}
          render={({ field }) => <TextInput placeholder='vd: Facebook' radius='md' label='Label' {...field} />}
        />

        <Controller
          control={control}
          name={`socials.${index}.value`}
          render={({ field }) => (
            <TextInput radius='md' label='Value' placeholder='Số điện thoại hoặc username...' {...field} />
          )}
        />

        <Controller
          control={control}
          name={`socials.${index}.pattern`}
          render={({ field }) => (
            <TextInput radius='md' label='Pattern' placeholder='Ví dụ: https://zalo.me/{value}' {...field} />
          )}
        />

        <Controller
          control={control}
          name={`socials.${index}.icon`}
          render={({ field }) => (
            <TextInput radius='md' placeholder='vd: brand-facebook' label='Icon (https://tabler.io/icons)' {...field} />
          )}
        />
      </SimpleGrid>
      <Group align='center' justify='space-between'>
        <Controller
          control={control}
          name={`socials.${index}.isActive`}
          render={({ field }) => (
            <Switch
              radius='md'
              label='Kích hoạt'
              checked={field.value}
              className='border-1 rounded-md border border-solid border-mainColor/50 p-2 hover:bg-mainColor/10'
              onChange={e => {
                field.onChange(e.currentTarget.checked);
              }}
            />
          )}
        />
        <Group justify='flex-end' mt='md'>
          <BButton variant='outline' onClick={onClose}>
            Hủy
          </BButton>
          <BButton type='submit' loading={loading} onClick={onSubmit}>
            {isEdit ? 'Cập nhật' : 'Tạo mới'}
          </BButton>
        </Group>
      </Group>
    </Modal>
  );
}
