import { ActionIcon, Card, Group, Stack, Switch, Text, TextInput } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { iconMap } from '~/lib/FuncHandler/generateSocial';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { api } from '~/trpc/react';

export const SocialTabItem = ({ item, index, setOpenedSocial }: { item: any; index: number; setOpenedSocial: any }) => {
  const { control, reset, getValues, setValue } = useFormContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setValue(`socials.${index}`, item);
    }
  }, [item]);
  const utils = api.useUtils();
  const mutationUpdate = api.Restaurant.updateSocial.useMutation({
    onSuccess: data => {
      if (data.code === 'OK') {
        utils.Restaurant.invalidate();
        reset(getValues());
        setLoading(false);
        NotifySuccess(data.message);
        return;
      }
      NotifyError(data.message);
    },
    onError: err => {
      NotifyError(err.message);
    }
  });
  const handleSaveLocal = async (data: any) => {
    setLoading(true);
    await mutationUpdate.mutateAsync({
      id: item?.id,
      data
    });
  };
  const mutationDelete = api.Restaurant.deleteSocial.useMutation({
    onSuccess: data => {
      if (data.code === 'OK') {
        utils.Restaurant.invalidate();
        setLoading(false);
        NotifySuccess(data.message);
        return;
      }
      NotifyError(data.message);
      setLoading(false);
    },
    onError: err => {
      NotifyError(err.message);
      setLoading(false);
    }
  });

  const handleDelete = async () => {
    setLoading(true);
    await mutationDelete.mutateAsync({
      id: item?.id,
      platform: item?.platform
    });
  };
  const { icon: IconComponent } = iconMap[item?.platform] || {};

  return (
    <>
      <Card withBorder radius='md' shadow='sm' p='md' className='transition hover:shadow-md'>
        <Group justify='space-between' align='center'>
          <Stack gap={2}>
            <Group align='center' gap={'xs'}>
              {IconComponent && <IconComponent size={24} stroke={1.5} />}
              <Text fw={600}>{item?.label || item?.platform || 'Liên kết'}</Text>
            </Group>
            <Text size='sm' c='dimmed'>
              {item?.pattern?.replace('{value}', item?.value || '') || item?.value}
            </Text>
          </Stack>

          <Group gap='xs'>
            <Controller
              control={control}
              name={`socials.${index}.id`}
              render={({ field, fieldState }) => (
                <TextInput {...field} className='hidden' error={fieldState.error?.message} radius='md' />
              )}
            />
            <Controller
              control={control}
              name={`socials.${index}.isActive`}
              render={({ field }) => (
                <Group align='center' gap={'xs'}>
                  <Text size='sm' fw={700}>
                    {field.value ? 'Hiển thị' : 'Ẩn'}
                  </Text>
                  <Switch
                    size='md'
                    checked={field.value}
                    disabled={loading}
                    onChange={e => {
                      field.onChange(e.currentTarget.checked);
                      handleSaveLocal({ ...item, isActive: e.currentTarget.checked });
                    }}
                  />
                </Group>
              )}
            />
            <ActionIcon
              variant='subtle'
              color='blue'
              aria-label='Sửa'
              title='Sửa'
              onClick={() => setOpenedSocial({ open: true, social: item })}
            >
              <IconEdit size={20} />
            </ActionIcon>
            <ActionIcon
              variant='subtle'
              color='red'
              loading={loading}
              onClick={handleDelete}
              aria-label='Xóa'
              title='Xóa'
            >
              <IconTrash size={20} />
            </ActionIcon>
          </Group>
        </Group>
      </Card>
    </>
  );
};
