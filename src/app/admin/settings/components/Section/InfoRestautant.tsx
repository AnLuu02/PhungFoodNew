'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Flex,
  Group,
  Paper,
  Stack,
  Switch,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconGlobe,
  IconHome,
  IconSpacingVertical
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { fileToBase64, vercelBlobToFile } from '~/lib/func-handler/handle-file-base64';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { restaurantSchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { Restaurant } from '~/types/restaurant';
import ContactTab from '../info/ContactTab';
import GeneralTab from '../info/GeneralTab';
import OpeningHour from '../info/OpeningHour';
export default function RestaurantInfoSettings({ data }: any) {
  const [restaurantData, setRestaurantData] = useState({
    name: 'Bella Vista Restaurant',
    description:
      'Authentic Italian cuisine with a modern twist, serving fresh ingredients and traditional recipes in a warm, welcoming atmosphere.',
    email: 'info@bellavista.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Downtown, NY 10001',
    website: 'https://bellavista.com',
    facebook: 'https://facebook.com/bellavista',
    instagram: 'https://instagram.com/bellavista',
    twitter: 'https://twitter.com/bellavista',
    isOpen: true,
    acceptingOrders: true,
    deliveryEnabled: true,
    pickupEnabled: true
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
    reset,
    watch,
    setValue
  } = useForm<Restaurant>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      id: data?.id,
      name: data?.name,
      address: '',
      phone: '',
      socials: [],
      logo: undefined,
      description: '',
      email: '',
      website: '',
      theme: undefined,
      openingHours: undefined
    }
  });
  useEffect(() => {
    if (data?.id) {
      if (data?.logo?.url && data?.logo?.url !== '') {
        vercelBlobToFile(data?.logo?.url as string)
          .then(file => {
            setValue('logo.url', file as File);
          })
          .catch(err => {
            new Error(err);
          })
          .finally(() => {});
      } else {
        setValue('logo.url', watch('logo.url'));
      }
      reset({
        id: data.id,
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email ?? undefined,
        website: data.website ?? undefined,
        socials: data.socials,
        description: data.description ?? undefined,
        theme: data.theme,
        openingHours: data.openingHours
      });
    }
  }, [data, reset]);

  const updateMutation = api.Restaurant.update.useMutation();
  const utils = api.useUtils();
  const onSubmit: SubmitHandler<Restaurant> = async formData => {
    const file = (formData?.logo?.url as File) ?? undefined;
    const fileName = file ? file?.name : '';
    const base64 = file ? await fileToBase64(file) : '';
    const formDataWithImageUrlAsString = {
      ...formData,
      logo: {
        fileName: fileName as string,
        base64: base64 as string
      }
    };
    let result = await updateMutation.mutateAsync({
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
    if (result?.code === 'OK') {
      NotifySuccess(result.message);
      utils.Restaurant.invalidate();
    } else {
      NotifyError(result?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
            <Button variant='outline' className='border-mainColor text-mainColor' radius={'xl'} leftSection='Đóng cửa'>
              <Switch checked={restaurantData.isOpen} />
            </Button>
            <Button
              type='submit'
              disabled={!isDirty}
              loading={isSubmitting}
              leftSection={<IconSpacingVertical size={16} />}
              className='bg-mainColor duration-100 enabled:hover:bg-subColor enabled:hover:text-black'
              radius={'md'}
            >
              Lưu thay đổi
            </Button>
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
              <GeneralTab control={control} />
            </TabsPanel>

            <TabsPanel value='contact' className='space-y-6'>
              <ContactTab restaurant={data} control={control} />
            </TabsPanel>

            <TabsPanel value='hours' className='space-y-6'>
              <OpeningHour restaurant={data} control={control} watch={watch} />
            </TabsPanel>

            <TabsPanel value='social' className='space-y-6'>
              <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
                <Box mb={'md'}>
                  <Title order={4} className='flex items-center gap-2 font-quicksand'>
                    <IconGlobe className='h-5 w-5' />
                    Liên kết truyền thông xã hội
                  </Title>
                  <Text fw={600} size={'sm'} c={'dimmed'}>
                    Kết nối các tài khoản mạng xã hội của bạn để tăng khả năng hiển thị
                  </Text>
                </Box>
                <Box className='space-y-4'>
                  <Box className='space-y-2'>
                    <TextInput
                      label={
                        <Flex align={'center'} gap={4}>
                          <IconBrandFacebook className='h-4 w-4' />
                          Facebook
                        </Flex>
                      }
                      radius='md'
                      value={restaurantData.facebook}
                      onChange={e => setRestaurantData({ ...restaurantData, facebook: e.target.value })}
                      placeholder='https://facebook.com/yourrestaurant'
                    />
                  </Box>

                  <Box className='space-y-2'>
                    <TextInput
                      label={
                        <Flex align={'center'} gap={4}>
                          <IconBrandInstagram className='h-4 w-4' />
                          Instagram
                        </Flex>
                      }
                      radius='md'
                      value={restaurantData.instagram}
                      onChange={e => setRestaurantData({ ...restaurantData, instagram: e.target.value })}
                      placeholder='https://instagram.com/yourrestaurant'
                    />
                  </Box>

                  <Box className='space-y-2'>
                    <TextInput
                      label={
                        <Flex align={'center'} gap={4}>
                          <IconBrandTwitter className='h-4 w-4' />
                          Twitter
                        </Flex>
                      }
                      radius='md'
                      value={restaurantData.twitter}
                      onChange={e => setRestaurantData({ ...restaurantData, twitter: e.target.value })}
                      placeholder='https://twitter.com/yourrestaurant'
                    />
                  </Box>
                </Box>
              </Paper>
            </TabsPanel>
          </Tabs>
        </Stack>
      </Paper>
    </form>
  );
}
