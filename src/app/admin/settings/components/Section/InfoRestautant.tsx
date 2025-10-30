'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Group, Paper, Stack, Switch, Tabs, TabsList, TabsPanel, TabsTab, Text, Title } from '@mantine/core';
import { IconHome, IconSpacingVertical } from '@tabler/icons-react';
import { useEffect, useMemo } from 'react';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import { fileToBase64, vercelBlobToFile } from '~/lib/FuncHandler/handle-file-base64';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { restaurantSchema } from '~/lib/ZodSchema/schema';
import { api } from '~/trpc/react';
import { Restaurant } from '~/types/restaurant';
import ContactTab from '../info/ContactTab';
import GeneralTab from '../info/GeneralTab';
import { OpeningHourTab } from '../info/OpeningHourTab';
import { SocialTab } from '../info/SocialTab';
export default function RestaurantInfoSettings({ data }: any) {
  const methods = useForm<Restaurant>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: data
  });
  const timeOpen = useMemo(() => {
    const timeIndex = new Date().getDay();
    const timeOpens = data?.openingHours ?? [];
    const timeOpen = timeOpens?.find((item: any) => item?.dayOfWeek === timeIndex?.toString());
    return {
      ...timeOpen,
      timeIndex
    };
  }, [data]);

  useEffect(() => {
    if (data?.id) {
      methods.reset(data);
    }
  }, [data?.id]);
  const updateMutation = api.Restaurant.update.useMutation({
    onSuccess: result => {
      if (result?.code === 'OK') {
        NotifySuccess(result.message);
        methods.reset(methods.getValues());
        return;
      }
      NotifyError(result?.message);
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  const onSubmit: SubmitHandler<Restaurant> = async formData => {
    let logo: File | any;
    if (data?.logo?.url && data?.logo?.url !== '') {
      logo = await vercelBlobToFile(data?.logo?.url as string);
    } else {
      logo = methods.watch('logo.url');
    }
    const file = (logo?.url as File) ?? undefined;
    const fileName = file ? file?.name : '';
    const base64 = file ? await fileToBase64(file) : '';
    const formDataWithImageUrlAsString = {
      ...formData,
      logo: {
        fileName: fileName as string,
        base64: base64 as string
      }
    };
    await updateMutation.mutateAsync({
      ...formDataWithImageUrlAsString,
      theme: {
        ...formData?.theme,
        primaryColor: formData?.theme?.primaryColor || '#008b4b',
        secondaryColor: formData?.theme?.secondaryColor || '#f8c144',
        fontFamily: null,
        borderRadius: null,
        faviconUrl: null
      },
      openingHours: formData?.openingHours
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Paper withBorder p='md' radius='md'>
          <Group justify='space-between' align='center' mb='lg'>
            <Box mb={'md'}>
              <Title className='flex items-center gap-2 font-quicksand' order={3}>
                <IconHome size={20} />
                Thông tin nhà hàng
              </Title>
              <Text fw={600} size={'sm'} c={'dimmed'}>
                Quản lý thông tin và cài đặt cơ bản của nhà hàng
              </Text>
            </Box>

            <Group gap='sm'>
              <Controller
                control={methods.control}
                name={`openingHours.${timeOpen.timeIndex}.isClosed`}
                render={({ field, fieldState }) => (
                  <Switch
                    label={
                      <Text size='sm' fw={700}>
                        {methods.watch(`openingHours.${timeOpen.timeIndex}.isClosed`) ? 'Đang đóng cửa' : 'Đang mở cửa'}
                      </Text>
                    }
                    checked={!field.value}
                    onChange={event => field.onChange(!event.currentTarget.checked)}
                    onBlur={field.onBlur}
                    name={field.name}
                    className='rounded-md border-[0.5px] border-solid border-mainColor p-2'
                    error={fieldState.error?.message}
                  />
                )}
              />

              <BButton
                type='submit'
                disabled={!methods.formState.isDirty}
                loading={methods.formState.isSubmitting}
                leftSection={<IconSpacingVertical size={16} />}
              >
                Lưu toàn bộ
              </BButton>
            </Group>
          </Group>
          <Stack gap={'xl'}>
            <Tabs
              defaultValue='basic'
              variant='pills'
              className='space-y-6'
              styles={{
                tab: {
                  border: '1px solid ',
                  marginRight: 6
                }
              }}
              classNames={{
                tab: `!rounded-md !border-[#e5e5e5] !font-bold hover:bg-mainColor/10 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`,
                list: 'rounded-md bg-gray-100 p-1 dark:bg-dark-card'
              }}
            >
              <TabsList className='grid w-full grid-cols-4'>
                <TabsTab value='basic'>Thông tin cơ bản</TabsTab>
                <TabsTab value='contact'>Liên hệ</TabsTab>
                <TabsTab value='hours'>Giờ hoạt động</TabsTab>
                <TabsTab value='social'>Truyền thông xã hội</TabsTab>
              </TabsList>

              <TabsPanel value='basic' className='space-y-6'>
                <GeneralTab />
              </TabsPanel>

              <TabsPanel value='contact' className='space-y-6'>
                <ContactTab />
              </TabsPanel>

              <TabsPanel value='hours' className='space-y-6'>
                <OpeningHourTab openingHours={data?.openingHours || []} />
              </TabsPanel>

              <TabsPanel value='social' className='space-y-6'>
                <SocialTab socials={data?.socials} restaurantId={data?.id || ''} />
              </TabsPanel>
            </Tabs>
          </Stack>
        </Paper>
      </form>
    </FormProvider>
  );
}
