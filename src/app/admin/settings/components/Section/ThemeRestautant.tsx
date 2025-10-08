'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  ColorInput,
  Grid,
  GridCol,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Switch,
  Text,
  Title
} from '@mantine/core';
import { IconCreditCard, IconSpacingVertical } from '@tabler/icons-react';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { themeSchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { Theme } from '~/types/restaurant';

export default function ThemeSettingsManagement({ restaurantId, data }: { restaurantId: string; data: any }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset
  } = useForm<Theme>({
    resolver: zodResolver(themeSchema),
    defaultValues: {
      id: data?.id,
      primaryColor: data?.primaryColor,
      secondaryColor: data?.secondaryColor,
      themeMode: data?.themeMode,
      fontFamily: data?.fontFamily,
      borderRadius: data?.borderRadius,
      faviconUrl: data?.faviconUrl
    }
  });

  useEffect(() => {
    if (data?.id) {
      reset({
        id: data.id,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        themeMode: data.themeMode,
        fontFamily: data.fontFamily,
        borderRadius: data.borderRadius,
        faviconUrl: data.faviconUrl
      });
    }
  }, [data, reset]);
  const utils = api.useUtils();
  const updateMutation = api.Restaurant.changeTheme.useMutation({
    onSuccess: () => {
      utils.Restaurant.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  const onSubmit: SubmitHandler<Theme> = async formData => {
    let result = await updateMutation.mutateAsync({
      ...formData,
      restaurantId: restaurantId
    });

    if (result?.code === 'OK') {
      NotifySuccess(result.message);
    } else {
      NotifyError(result?.message);
    }
  };
  return (
    <>
      <Paper withBorder p='md' radius='md'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={'xl'}>
            <Group justify='space-between'>
              <Box>
                <Title className='flex items-center gap-2 font-quicksand' order={3}>
                  <IconCreditCard size={20} />
                  Giao diện
                </Title>
                <Text fw={600} size={'sm'} c={'dimmed'}>
                  Quản lý cài đặt giao diện
                </Text>
              </Box>
              <Button
                className='bg-mainColor duration-100 enabled:hover:bg-subColor enabled:hover:text-black'
                radius={'md'}
                type='submit'
                loading={isSubmitting}
                disabled={!isDirty}
                leftSection={<IconSpacingVertical size={16} />}
              >
                Lưu thay đổi
              </Button>
            </Group>

            <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
              <Title className='font-quicksand' order={4} mb={'md'}>
                Chủ đề
              </Title>
              <Grid>
                <GridCol span={6}>
                  <Controller
                    control={control}
                    name='themeMode'
                    render={({ field }) => (
                      <Select
                        radius={'md'}
                        label='Chủ đề mặc định'
                        size='sm'
                        placeholder='Chủ đề mặc định'
                        defaultValue={'light'}
                        data={[
                          {
                            label: 'Sáng',
                            value: 'light'
                          },
                          {
                            label: 'Tối',
                            value: 'dark'
                          }
                        ]}
                        {...field}
                        error={errors.themeMode?.message}
                      />
                    )}
                  />
                </GridCol>

                <GridCol span={6}>
                  <Controller
                    control={control}
                    name='primaryColor'
                    render={({ field }) => (
                      <ColorInput
                        {...field}
                        label='Màu chủ đạo'
                        radius={'md'}
                        placeholder='Input placeholder'
                        error={errors.primaryColor?.message}
                      />
                    )}
                  />
                </GridCol>

                <GridCol span={6}>
                  <Controller
                    control={control}
                    name='secondaryColor'
                    render={({ field }) => (
                      <ColorInput
                        {...field}
                        label='Màu phụ'
                        radius={'md'}
                        placeholder='Input placeholder'
                        error={errors.secondaryColor?.message}
                      />
                    )}
                  />
                </GridCol>
              </Grid>
            </Paper>

            <Paper radius='md' shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
              <Title className='font-quicksand' order={4} mb='md'>
                Bố cục
              </Title>

              <Grid>
                <GridCol span={6}>
                  <Stack gap={4}>
                    <Text size='sm' fw={700}>
                      Thu gọn sidebar mặc định
                    </Text>
                    <Switch size='sm' defaultChecked />
                  </Stack>
                </GridCol>
                <GridCol span={6}>
                  <Stack gap={4}>
                    <Text size='sm' fw={700}>
                      Hiển thị breadcrumb
                    </Text>
                    <Switch size='sm' defaultChecked />
                  </Stack>
                </GridCol>
                <GridCol span={6}>
                  <NumberInput
                    radius={'md'}
                    label={`Số item mỗi trang`}
                    size='sm'
                    min={20}
                    withAsterisk
                    defaultValue={20}
                  />
                </GridCol>
              </Grid>
            </Paper>

            <Group justify='flex-start'>
              <Button
                type='submit'
                leftSection={<IconSpacingVertical size={16} />}
                loading={isSubmitting}
                disabled={!isDirty}
                className='bg-mainColor duration-100 enabled:hover:bg-subColor enabled:hover:text-black'
                radius={'md'}
              >
                Lưu thay đổi
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </>
  );
}
