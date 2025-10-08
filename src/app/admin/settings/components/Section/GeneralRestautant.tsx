'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Divider,
  FileInput,
  Grid,
  GridCol,
  Group,
  Image,
  Paper,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Title
} from '@mantine/core';
import {
  IconFile,
  IconMail,
  IconPhone,
  IconPlus,
  IconSettings,
  IconSpacingVertical,
  IconTrash,
  IconWorld
} from '@tabler/icons-react';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { fileToBase64, vercelBlobToFile } from '~/lib/func-handler/handle-file-base64';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { restaurantSchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { Restaurant } from '~/types/restaurant';

const SOCIAL_OPTIONS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter' }
];

export default function GeneralSettingsManagement({ data }: { data: any }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
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
      website: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socials'
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
        description: data.description ?? undefined
      });
    }
  }, [data, reset]);

  const utils = api.useUtils();
  const updateMutation = api.Restaurant.update.useMutation({
    onSuccess: () => {
      utils.Restaurant.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  const createMutation = api.Restaurant.create.useMutation({
    onSuccess: () => {
      utils.Restaurant.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

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
    let result = formData.id
      ? await updateMutation.mutateAsync({
          ...formDataWithImageUrlAsString,
          theme: {
            ...formData?.theme,
            primaryColor: formData?.theme?.primaryColor || '#008b4b',
            secondaryColor: formData?.theme?.secondaryColor || '#f8c144',
            fontFamily: null,
            borderRadius: null,
            faviconUrl: null
          },
          openingHours: data?.openingHours
        })
      : await createMutation.mutateAsync(formDataWithImageUrlAsString);
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
                  <IconSettings size={20} />
                  Hệ thống
                </Title>
                <Text fw={600} size={'sm'} c={'dimmed'}>
                  Quản lý cài đặt hệ thống
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
                Thông tin ứng dụng
              </Title>
              <Grid justify='space-between' columns={24}>
                <GridCol span={13}>
                  <Stack>
                    <Controller
                      control={control}
                      name='name'
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          radius={'md'}
                          label='Tên nhà hàng'
                          size='sm'
                          placeholder='Nhập tên nhà hàng'
                          required
                          error={errors.name?.message}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name='description'
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          radius={'md'}
                          label='Mô tả nhà hàng'
                          placeholder='Enter restaurant description'
                          minRows={4}
                          error={errors.description?.message}
                        />
                      )}
                    />

                    <Divider label='Thời gian hoạt động' labelPosition='center' />
                    <Stack gap='sm'>
                      <Grid>
                        <GridCol span={12}>
                          <Divider label='Mạng xã hội' labelPosition='center' />
                          {fields.map((item, index) => (
                            <Group key={item.id} mt='sm' align='flex-end'>
                              <Controller
                                name={`socials.${index}.key`}
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    radius={'md'}
                                    label='Mạng xã hội'
                                    data={SOCIAL_OPTIONS}
                                    placeholder='Chọn mạng xã hội'
                                    {...field}
                                    error={errors.socials?.message}
                                  />
                                )}
                              />

                              <Controller
                                name={`socials.${index}.url`}
                                control={control}
                                render={({ field }) => (
                                  <TextInput
                                    radius={'md'}
                                    label='URL'
                                    placeholder='Nhập đường dẫn'
                                    {...field}
                                    error={errors.socials?.message}
                                  />
                                )}
                              />

                              <Button color='red' variant='outline' onClick={() => remove(index)}>
                                <IconTrash size={16} />
                              </Button>
                            </Group>
                          ))}
                          <Button
                            mt='md'
                            bg={'#195EFE'}
                            radius={'md'}
                            w={'100%'}
                            leftSection={<IconPlus size={16} />}
                            onClick={() => append({ id: '', key: '', url: '' })}
                          >
                            Thêm liên kết
                          </Button>
                        </GridCol>
                      </Grid>
                    </Stack>
                  </Stack>
                </GridCol>

                <GridCol span={10}>
                  <Stack>
                    <Image
                      loading='lazy'
                      src={
                        watch('logo.url') instanceof File
                          ? URL.createObjectURL(watch('logo.url') as File)
                          : watch('logo.url') || '/images/jpg/empty-300x240.jpg'
                      }
                      alt='Product Image'
                      className='mb-4'
                      mah={240}
                    />
                    <Controller
                      name='logo.url'
                      control={control}
                      rules={{
                        validate: file =>
                          file && ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
                            ? true
                            : 'Only PNG, JPEG, or JPG files are allowed'
                      }}
                      render={({ field }) => (
                        <FileInput
                          {...field}
                          leftSection={<IconFile className='h-5 w-5' />}
                          radius={'md'}
                          label='Logo nhà hàng'
                          placeholder='Chọn một file'
                          leftSectionPointerEvents='none'
                          accept='image/png,image/jpeg,image/jpg'
                          error={errors.logo?.message}
                        />
                      )}
                    />
                  </Stack>
                </GridCol>
              </Grid>
            </Paper>

            <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
              <Title className='font-quicksand' order={4} mb={'md'}>
                Thông tin liên hệ
              </Title>
              <Grid>
                <GridCol span={6}>
                  <Controller
                    control={control}
                    name='email'
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        radius={'md'}
                        withAsterisk
                        label='Email'
                        placeholder='Nhập địa chỉ email'
                        leftSection={<IconMail size={16} />}
                        required
                        error={errors.email?.message}
                      />
                    )}
                  />
                </GridCol>
                <GridCol span={6}>
                  <Controller
                    control={control}
                    name='phone'
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        radius={'md'}
                        label='Số điện thoại'
                        withAsterisk
                        placeholder='Nhập số điện thoại'
                        leftSection={<IconPhone size={16} />}
                        required
                        error={errors.phone?.message}
                      />
                    )}
                  />
                </GridCol>
                <GridCol span={12}>
                  <Controller
                    control={control}
                    name='address'
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        radius={'md'}
                        label='Địa chỉ'
                        minRows={4}
                        placeholder='Nhập địa chỉ cụ thể'
                        required
                        error={errors.address?.message}
                      />
                    )}
                  />
                </GridCol>
                <GridCol span={6}>
                  <Controller
                    control={control}
                    name='website'
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        radius={'md'}
                        label='Website'
                        placeholder='Enter website URL'
                        leftSection={<IconWorld size={16} />}
                        error={errors.website?.message}
                      />
                    )}
                  />
                </GridCol>
              </Grid>
            </Paper>

            <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
              <Title className='font-quicksand' order={4} mb={'md'}>
                Cài đặt khu vực
              </Title>
              <Grid>
                <GridCol span={6}>
                  <Select
                    radius={'md'}
                    label='Cài đặt múi giờ'
                    size='sm'
                    defaultValue={'7'}
                    placeholder='Nhập tên nhà hàng'
                    data={[
                      {
                        label: 'GMT +7 (Việt Nam)',
                        value: '7'
                      },
                      {
                        label: 'GMT +8 (Việt Nam)',
                        value: '8'
                      },
                      {
                        label: 'GMT +9 (Việt Nam)',
                        value: '9'
                      }
                    ]}
                  />
                </GridCol>
                <GridCol span={6}>
                  <Select
                    radius={'md'}
                    label='Ngôn ngữ mặc định'
                    size='sm'
                    placeholder='Nhập tên nhà hàng'
                    defaultValue={'vi'}
                    data={[
                      {
                        label: 'Việt Nam',
                        value: 'vi'
                      },
                      {
                        label: 'English',
                        value: 'en'
                      },
                      {
                        label: 'Trung Quốc',
                        value: 'zh'
                      },
                      {
                        label: 'Nga',
                        value: 'ru'
                      }
                    ]}
                  />
                </GridCol>
                <GridCol span={6}>
                  <Select
                    radius={'md'}
                    label='Định dạng ngày'
                    size='sm'
                    defaultValue={'dd/mm/yyyy'}
                    placeholder='Nhập tên nhà hàng'
                    data={[
                      {
                        label: 'DD/MM/YYYY',
                        value: 'dd/mm/yyyy'
                      },
                      {
                        label: 'MM/DD/YYYY',
                        value: 'mm/dd/yyyy'
                      },
                      {
                        label: 'YYYY/MM/DD',
                        value: 'yyyy/mm/dd'
                      }
                    ]}
                  />
                </GridCol>
              </Grid>
            </Paper>

            <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
              <Title className='font-quicksand' order={4} mb={'md'}>
                Trạng thái hệ thống
              </Title>
              <Grid>
                <GridCol span={6}>
                  <Stack gap={4}>
                    <Text size='sm' fw={700}>
                      Chế độ bảo trì
                    </Text>
                    <Switch size='sm' />
                    <Text size='xs' c={'dimmed'}>
                      Tạm dừng truy cập website
                    </Text>
                  </Stack>
                </GridCol>
                <GridCol span={6}>
                  <Stack gap={4}>
                    <Text size='sm' fw={700}>
                      Đăng ký mới
                    </Text>
                    <Switch size='sm' />
                    <Text size='xs' c={'dimmed'}>
                      Cho phép người dùng đăng ký
                    </Text>
                  </Stack>
                </GridCol>
                <GridCol span={6}>
                  <Stack gap={4}>
                    <Text size='sm' fw={700}>
                      Chế độ gỡ lỗi
                    </Text>
                    <Switch size='sm' />
                    <Text size='xs' c={'dimmed'}>
                      Hiển thị thông tin debug
                    </Text>
                  </Stack>
                </GridCol>
              </Grid>
            </Paper>

            <Group justify='flex-start'>
              <Button
                type='submit'
                loading={isSubmitting}
                disabled={!isDirty}
                leftSection={<IconSpacingVertical size={16} />}
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
