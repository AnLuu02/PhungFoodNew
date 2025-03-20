'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionIcon,
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
import { TimeInput } from '@mantine/dates';
import {
  IconClock,
  IconFile,
  IconMail,
  IconMapPin,
  IconPhone,
  IconPlus,
  IconSpacingVertical,
  IconTrash,
  IconWorld
} from '@tabler/icons-react';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import LoadingComponent from '~/app/_components/Loading/Loading';
import { Restaurant } from '~/app/Entity/RestaurantEntity';
import { fileToBase64, vercelBlobToFile } from '~/app/lib/utils/func-handler/handle-file-upload';
import { NotifyError, NotifySuccess } from '~/app/lib/utils/func-handler/toast';
import { restaurantSchema } from '~/app/lib/utils/zod/zodShcemaForm';
import { api } from '~/trpc/react';

const SOCIAL_OPTIONS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter' }
];

export default function GeneralSettingsManagement() {
  const { data, isLoading }: any = api.Restaurant.getOne.useQuery();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm<Restaurant>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      id: '',
      name: '',
      address: '',
      phone: '',
      openedHours: '',
      socials: [],
      logo: undefined,
      closedHours: '',
      description: '',
      email: '',
      website: '',
      isClose: false
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socials'
  });

  useEffect(() => {
    if (data?.id) {
      if (data && data?.logo?.url && data?.logo?.url !== '') {
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
        isClose: data.isClose,
        description: data.description ?? undefined,
        openedHours: data.openedHours ?? undefined,
        closedHours: data.closedHours ?? undefined
      });
    }
  }, [data, reset]);

  const utils = api.useUtils();
  const updateMutation = api.Restaurant.update.useMutation({
    onSuccess: () => {
      utils.SubCategory.invalidate();
    },
    onError: e => {
      console.log(e);
    }
  });

  const createMutation = api.Restaurant.create.useMutation({
    onSuccess: () => {
      utils.SubCategory.invalidate();
    },
    onError: e => {
      console.log(e);
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
      ? await updateMutation.mutateAsync(formDataWithImageUrlAsString)
      : await createMutation.mutateAsync(formDataWithImageUrlAsString);
    if (result?.success) {
      NotifySuccess(result.message);
    } else {
      NotifyError(result?.message);
    }
  };

  return isLoading ? (
    <LoadingComponent />
  ) : (
    <>
      <Paper withBorder p='md' radius='md'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Title className='font-quicksand' order={3}>
              Cài đặt nhà hàng
            </Title>

            <Grid>
              <GridCol span={6}>
                <Stack>
                  <Controller
                    control={control}
                    name='name'
                    render={({ field }) => (
                      <TextInput
                        {...field}
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
                        label='Mô tả'
                        placeholder='Enter restaurant description'
                        minRows={3}
                        error={errors.description?.message}
                      />
                    )}
                  />

                  <Divider label='Thông tin liên hệ' labelPosition='center' />

                  <Grid>
                    <Grid.Col span={6}>
                      <Controller
                        control={control}
                        name='email'
                        render={({ field }) => (
                          <TextInput
                            {...field}
                            label='Email'
                            placeholder='Enter email address'
                            leftSection={<IconMail size={16} />}
                            required
                            error={errors.email?.message}
                          />
                        )}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Controller
                        control={control}
                        name='phone'
                        render={({ field }) => (
                          <TextInput
                            {...field}
                            label='Phone'
                            placeholder='Enter phone number'
                            leftSection={<IconPhone size={16} />}
                            required
                            error={errors.phone?.message}
                          />
                        )}
                      />
                    </Grid.Col>
                  </Grid>

                  <Controller
                    control={control}
                    name='address'
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        label='Địa chỉ'
                        placeholder='Enter full address'
                        leftSection={<IconMapPin size={16} />}
                        required
                        error={errors.address?.message}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name='website'
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        label='Website'
                        placeholder='Enter website URL'
                        leftSection={<IconWorld size={16} />}
                        error={errors.website?.message}
                      />
                    )}
                  />

                  <Divider label='Mạng xã hội' labelPosition='center' />

                  {fields.map((item, index) => (
                    <Group key={item.id} mt='sm' align='flex-end'>
                      <Controller
                        name={`socials.${index}.key`}
                        control={control}
                        render={({ field }) => (
                          <Select
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
                    mt='sm'
                    leftSection={<IconPlus size={16} />}
                    onClick={() => append({ id: '', key: '', url: '' })}
                  >
                    Thêm liên kết
                  </Button>

                  <Divider label='Thời gian hoạt động' labelPosition='center' />

                  <Group align='center'>
                    <Text size='sm' fw={500}>
                      Thời gian hoạt động
                    </Text>

                    <Controller
                      name='isClose'
                      control={control}
                      render={({ field }) => (
                        <Switch
                          label='Đóng cửa'
                          checked={field.value}
                          onChange={e => field.onChange(e.currentTarget.checked)}
                          error={errors.isClose?.message}
                        />
                      )}
                    />

                    {!closed && (
                      <>
                        <Controller
                          name='openedHours'
                          control={control}
                          render={({ field }) => (
                            <TimeInput
                              label='Mở cửa'
                              leftSection={<IconClock size={16} />}
                              {...field}
                              value={field.value as string}
                              error={errors.openedHours?.message}
                            />
                          )}
                        />

                        <Controller
                          name='closedHours'
                          control={control}
                          render={({ field }) => (
                            <TimeInput
                              label='Đóng cửa'
                              leftSection={<IconClock size={16} />}
                              {...field}
                              error={errors.closedHours?.message}
                            />
                          )}
                        />
                      </>
                    )}
                  </Group>
                </Stack>
              </GridCol>
              <GridCol span={6}>
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
                    w={500}
                    h={500}
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
                        leftSection={<ActionIcon size='sx' color='gray' variant='transparent' component={IconFile} />}
                        label='Ảnh chính'
                        placeholder='Choose a file'
                        leftSectionPointerEvents='none'
                        {...field}
                        error={errors.logo?.message}
                        accept='image/png,image/jpeg,image/jpg'
                      />
                    )}
                  />
                </Stack>
              </GridCol>
            </Grid>

            <Group justify='flex-end' mt='xl'>
              <Button type='submit' loading={isSubmitting} leftSection={<IconSpacingVertical size={16} />}>
                Lưu thay đổi
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </>
  );
}
