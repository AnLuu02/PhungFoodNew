'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Group,
  Paper,
  Stack,
  Switch,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  Title
} from '@mantine/core';
import { EntityType, ImageType } from '@prisma/client';
import { IconHome, IconSpacingVertical } from '@tabler/icons-react';
import { useEffect, useMemo } from 'react';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useHashTabs } from '~/components/Hooks/use-hash-tabs';
import { handleUploadFromClient } from '~/lib/Cloudinary/client';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { StatusImage } from '~/shared/schema/image.info.schema';
import { RestaurantInput, restaurantInputSchema } from '~/shared/schema/restaurant.schema';
import { api } from '~/trpc/react';
import RestaurantInformationSkeleton from '../Skeleton/RestaurantInformationSkeleton';
import ContactTab from './Tabs/ContactTab';
import GeneralTab from './Tabs/GeneralTab';
import { OpeningHourTab } from './Tabs/OpeningHourTab';
import { SocialTab } from './Tabs/SocialTab';

const TABS = {
  basic: { value: 'basic', label: 'Thông tin cơ bản' },
  contact: { value: 'contact', label: 'Liên hệ' },
  hours_open: { value: 'hours_open', label: 'Giờ hoạt động' },
  social: { value: 'social', label: 'Truyền thông' }
};
const DEFAULT_TAB = TABS?.['basic']?.value || 'basic';

export default function RestaurantInfoSettings() {
  const { data, isLoading } = api.Restaurant.getOneActive.useQuery();
  const { activeTab, changeTab } = useHashTabs(Object.keys(TABS), DEFAULT_TAB);
  const formFields = useForm<RestaurantInput>({
    resolver: zodResolver(restaurantInputSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      socials: [],
      theme: undefined,
      description: undefined,
      imageForEntity: undefined,
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
    if (data) {
      formFields.reset({
        ...data,
        imageForEntity: {
          ...data?.imageForEntity,
          image: {
            url: data?.imageForEntity?.image?.url || '',
            publicId: data?.imageForEntity?.image?.publicId || ''
          }
        } as any
      });
    }
  }, [data?.id]);
  const utils = api.useUtils();
  const upsertMutation = api.Restaurant.upsert.useMutation({
    onSuccess: () => {
      utils.Restaurant.invalidate();
      NotifySuccess('Chúc mừng bạn đã thao tác thành công');
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  const onSubmit: SubmitHandler<RestaurantInput> = async formData => {
    const imageFile = formFields.getValues('imageForEntity.image.urlFile');
    const imagePublicId = formFields.getValues('imageForEntity.image.publicId');
    const imagesToSave = await handleUploadFromClient(imageFile, utils, {
      folder: EntityType.RESTAURANT + '/' + ImageType.THUMBNAIL
    });
    await upsertMutation.mutateAsync({
      ...formData,
      imageForEntity: imagesToSave
        ? {
            id: formData?.imageForEntity?.id,
            altText: formData?.imageForEntity?.altText || 'Ảnh Logo nhà hàng ' + (formData?.name || ''),
            type: formData?.imageForEntity?.type || ImageType.THUMBNAIL,
            entityType: formData?.imageForEntity?.entityType || EntityType.RESTAURANT,
            status: StatusImage.NEW,
            image: {
              ...imagesToSave,
              id: undefined,
              altText: formData?.imageForEntity?.altText || 'Ảnh Logo nhà hàng ' + (formData?.name || ''),
              type: ImageType.THUMBNAIL
            }
          }
        : data?.imageForEntity?.id && !imagePublicId
          ? {
              id: data?.imageForEntity?.id,
              status: StatusImage.DELETED
            }
          : undefined
    });
  };
  if (isLoading) return <RestaurantInformationSkeleton />;
  return (
    <FormProvider {...formFields}>
      <form onSubmit={formFields.handleSubmit(onSubmit)}>
        <Paper withBorder p='md'>
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
                control={formFields.control}
                name={`openingHours.${timeOpen.timeIndex}.isClosed`}
                render={({ field, fieldState }) => (
                  <Switch
                    label={
                      <Text size='sm' fw={700}>
                        {formFields.watch(`openingHours.${timeOpen.timeIndex}.isClosed`)
                          ? 'Đang đóng cửa'
                          : 'Đang mở cửa'}
                      </Text>
                    }
                    checked={!field.value}
                    onChange={event => field.onChange(!event.currentTarget.checked)}
                    onBlur={field.onBlur}
                    name={field.name}
                    className='border-[0.5px] border-solid border-mainColor p-2'
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Button
                type='submit'
                disabled={!formFields.formState.isDirty}
                loading={formFields.formState.isSubmitting}
                leftSection={<IconSpacingVertical size={16} />}
              >
                Lưu toàn bộ
              </Button>
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
                tab: `!border-[#e5e5e5] !font-bold hover:bg-mainColor/10 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`,
                list: 'bg-gray-100 p-1 dark:bg-dark-card'
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
