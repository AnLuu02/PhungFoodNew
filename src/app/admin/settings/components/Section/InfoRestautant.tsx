'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Group, Paper, Stack, Switch, Tabs, TabsList, TabsPanel, TabsTab, Text, Title } from '@mantine/core';
import { IconHome, IconSpacingVertical } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import { useHashTabs } from '~/components/Hooks/use-hash-tabs';
import { fileToBase64, vercelBlobToFile } from '~/lib/FuncHandler/handle-file-base64';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { RestaurantInput, restaurantInputSchema } from '~/shared/schema/restaurant.schema';
import { api } from '~/trpc/react';
import ContactTab from '../info/ContactTab';
import GeneralTab from '../info/GeneralTab';
import { OpeningHourTab } from '../info/OpeningHourTab';
import { SocialTab } from '../info/SocialTab';
import RestaurantInformationSkeleton from './Skeleton/RestaurantInformationSkeleton';

const TABS = {
  basic: { value: 'basic', label: 'Thông tin cơ bản' },
  contact: { value: 'contact', label: 'Liên hệ' },
  hours_open: { value: 'hours_open', label: 'Giờ hoạt động' },
  social: { value: 'social', label: 'Truyền thông' }
};
const DEFAULT_TAB = TABS?.['basic']?.value || 'basic';

export default function RestaurantInfoSettings() {
  const { data, isLoading } = api.Restaurant.getOneActive.useQuery();
  const [loading, setLoading] = useState(true);
  const { activeTab, changeTab } = useHashTabs(Object.keys(TABS), DEFAULT_TAB);
  const form = useForm<RestaurantInput>({
    resolver: zodResolver(restaurantInputSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      socials: [],
      theme: undefined,
      description: undefined,
      logo: undefined,
      openingHours: undefined
    }
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
    (async function setDefaultData() {
      if (data?.id) {
        let logo: File | any;
        if (data?.logo?.url && data?.logo?.url !== '') {
          logo = await vercelBlobToFile(data?.logo?.url as string);
        } else {
          logo = form.watch('logo.url');
        }
        form.reset({
          ...data,
          logo: {
            ...data?.logo,
            url: logo
          }
        });
        setLoading(false);
      }
    })();
  }, [data?.id]);
  const utils = api.useUtils();
  const updateMutation = api.Restaurant.update.useMutation({
    onSuccess: () => {
      utils.Restaurant.invalidate();
      NotifySuccess('Chúc mừng bạn đã thao tác thành công');
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  const onSubmit: SubmitHandler<RestaurantInput> = async formData => {
    const file = formData?.logo?.url as File;
    const fileName = file ? file?.name : '';
    const base64 = file ? await fileToBase64(file) : '';
    const formDataWithImageUrlAsString = {
      ...formData,
      logo: {
        fileName: fileName as string,
        base64: base64 as string
      }
    };
    await updateMutation.mutateAsync(formDataWithImageUrlAsString);
  };
  if (isLoading || loading) return <RestaurantInformationSkeleton />;
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
                control={form.control}
                name={`openingHours.${timeOpen.timeIndex}.isClosed`}
                render={({ field, fieldState }) => (
                  <Switch
                    label={
                      <Text size='sm' fw={700}>
                        {form.watch(`openingHours.${timeOpen.timeIndex}.isClosed`) ? 'Đang đóng cửa' : 'Đang mở cửa'}
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
                disabled={!form.formState.isDirty}
                loading={form.formState.isSubmitting}
                leftSection={<IconSpacingVertical size={16} />}
              >
                Lưu toàn bộ
              </BButton>
            </Group>
          </Group>
          <Stack gap={'xl'}>
            <Tabs
              value={activeTab}
              onChange={value => changeTab(value!)}
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
                {Object.values(TABS).map(({ value, label }) => (
                  <TabsTab value={value} key={value}>
                    {label}
                  </TabsTab>
                ))}
              </TabsList>

              <TabsPanel value='basic' className='space-y-6'>
                <GeneralTab />
              </TabsPanel>

              <TabsPanel value='contact' className='space-y-6'>
                <ContactTab />
              </TabsPanel>

              <TabsPanel value='hours_open' className='space-y-6'>
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
