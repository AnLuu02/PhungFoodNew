'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ActionIcon, Badge, Box, Card, FileInput, Group, Paper, Stack, Switch } from '@mantine/core';
import { IconEye, IconFile, IconPlus, IconTrash } from '@tabler/icons-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import { formatDateViVN } from '~/lib/FuncHandler/Format';
import { fileToBase64, vercelBlobToFile } from '~/lib/FuncHandler/handle-file-base64';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { LocalImageType } from '~/lib/ZodSchema/enum';
import { api } from '~/trpc/react';
import { BannerClientSchema, BannerClientType } from '~/types';
import { CarouselBanner } from '../CarouselBanner';
import ModalViewBanner from './ModalViewBanner';

export default function BannerManagement({ data }: any) {
  const [viewBanner, setViewBanner] = useState<any>(null);
  const [activeBanner, setActiveBanner] = useState<any>({});
  const [loading, setLoading] = useState<{ type: 'set-default' | 'delete'; value: boolean } | null>(null);
  const { data: dataClient } = api.Restaurant.getAllBanner.useQuery(undefined, {
    initialData: data,
    enabled: !!data
  });
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    watch,
    reset,
    setValue
  } = useForm<BannerClientType>({
    resolver: zodResolver(BannerClientSchema),
    defaultValues: {
      id: '',
      isActive: false,
      startDate: new Date(),
      endDate: new Date(),
      banner1: undefined,
      banner2: undefined,
      gallery: []
    }
  });
  const utils = api.useUtils();
  const mutationCreate = api.Restaurant.createBanner.useMutation({
    onSuccess: () => {
      utils.Restaurant.getAllBanner.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  const mutationUpdate = api.Restaurant.updateBanner.useMutation({
    onSuccess: () => {
      utils.Restaurant.getAllBanner.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  useEffect(() => {
    if (Array.isArray(dataClient) && dataClient.length > 0) {
      const bannerActive = dataClient.find((banner: any) => banner.isActive) || null;
      setActiveBanner(bannerActive);
    }
  }, [dataClient]);
  useEffect(() => {
    if (activeBanner?.id) {
      const banners: string[] = [];
      const gallery: string[] = [];

      activeBanner.images.forEach((image: any) => {
        if (image.type === LocalImageType.BANNER) banners.push(image.url);
        else if (image.type === LocalImageType.GALLERY) gallery.push(image.url);
      });

      Promise.all([
        banners[0] ? vercelBlobToFile(banners[0]) : null,
        banners[1] ? vercelBlobToFile(banners[1]) : null,
        gallery.length > 0 ? vercelBlobToFile(gallery, { type: 'multiple' }) : []
      ]).then(([banner1, banner2, images]) => {
        if (banner1 instanceof File) setValue('banner1', banner1);
        if (banner2 instanceof File) setValue('banner2', banner2);
        const galleryImages =
          Array.isArray(images) && images.every(img => img instanceof File)
            ? images.map((img, index) => ({ key: `gallery_${index}`, file: img })).filter(Boolean)
            : [];

        setValue(
          'gallery',
          galleryImages.map(img => img.file)
        );
      });

      reset({
        id: activeBanner.id,
        startDate: activeBanner.startDate || new Date(),
        endDate: activeBanner.endDate || new Date(),
        isActive: activeBanner.isActive
      });
    } else {
      reset({
        id: '',
        isActive: false,
        startDate: new Date(),
        endDate: new Date(),
        banner1: undefined,
        banner2: undefined,
        gallery: []
      });
    }
  }, [activeBanner]);
  const onSubmit: SubmitHandler<BannerClientType> = async formData => {
    try {
      const banners = await Promise.all(
        [formData.banner1, formData.banner2].map(async file => {
          if (file instanceof File) {
            return {
              fileName: file.name,
              base64: (await fileToBase64(file)) as string
            };
          }
          return null;
        })
      );

      const gallery = formData.gallery
        ? await Promise.all(
            formData.gallery.map(async file => ({
              fileName: file?.name || '',
              base64: (await fileToBase64(file)) as string
            }))
          )
        : [];

      const payload = {
        ...formData,
        banner: banners.filter(item => item !== null),
        gallery
      };

      const result = activeBanner?.id
        ? await mutationUpdate.mutateAsync({ ...payload, id: activeBanner.id })
        : await mutationCreate.mutateAsync(payload);

      result.code === 'OK' ? NotifySuccess(result.message) : NotifyError(result.message);
    } catch {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  };
  const previewUrls = useMemo(
    () => watch('gallery')?.map(image => (image instanceof File ? URL.createObjectURL(image) : image)) || [],
    [watch('gallery')]
  );

  const setDefaultBannerMutation = api.Restaurant.setDefaultBanner.useMutation({
    onSuccess: () => {
      utils.Restaurant.getAllBanner.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  const deleteBannerMutation = api.Restaurant.deleteBanner.useMutation({
    onSuccess: () => {
      utils.Restaurant.getAllBanner.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  async function handleSetDefault(id: string) {
    setLoading({ type: 'set-default', value: true });
    const result = await setDefaultBannerMutation.mutateAsync({ id });
    if (result.code === 'OK') NotifySuccess(result.message);
    else NotifyError(result.message);
    setLoading({ type: 'set-default', value: false });
  }
  async function handleDeleteBanner(id: string, otherId?: string) {
    setLoading({ type: 'delete', value: true });
    const result = await deleteBannerMutation.mutateAsync({ id, otherId });
    if (result.code === 'OK') NotifySuccess(result.message);
    else NotifyError(result.message);
    setLoading({ type: 'delete', value: false });
  }
  return (
    <>
      <ModalViewBanner viewBanner={viewBanner} setViewBanner={setViewBanner} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Group justify='flex-end' mb='md'>
          <BButton leftSection={<IconPlus size={16} />} onClick={() => setActiveBanner(null)}>
            Tạo mới
          </BButton>
          <Paper withBorder radius='md' p='md' miw={154}>
            <Controller
              name='isActive'
              control={control}
              render={({ field }) => (
                <Switch
                  label={
                    <Group>
                      <Badge color={field.value ? '#195EFE' : 'red'}>{field.value ? 'Hiển thị' : 'Ẩn'}</Badge>
                    </Group>
                  }
                  className='text-mainColor duration-100'
                  checked={field.value}
                  onChange={e => field.onChange(e.currentTarget.checked)}
                  error={errors.isActive?.message}
                />
              )}
            />
          </Paper>
          <BButton loading={isSubmitting} type='submit' disabled={!isDirty}>
            Lưu thay đổi
          </BButton>
        </Group>
        <Box>
          {dataClient?.length > 0 && (
            <Box className='mb-4 grid grid-cols-3 gap-4'>
              {dataClient.map((banner: any, index: number) => (
                <Card
                  key={banner.id}
                  pos='relative'
                  radius={'md'}
                  p={0}
                  withBorder
                  className='overflow-hidden border border-gray-200 shadow-sm dark:border-dark-dimmed'
                >
                  <Box h={200} pos={'relative'}>
                    <Image src={banner.images?.[0]?.url} alt='Banner' fill className='rounded-t-md' />
                  </Box>
                  <Box pos='absolute' top={12} right={12}>
                    {banner.isActive ? (
                      <Badge size='md' color='red' variant='filled'>
                        Mặc định
                      </Badge>
                    ) : (
                      <BButton
                        size='xs'
                        loading={loading?.type === 'set-default' && loading.value}
                        onClick={() => handleSetDefault(banner.id)}
                      >
                        Đặt mặc định
                      </BButton>
                    )}
                  </Box>

                  <Stack gap={'xs'} p={'sm'}>
                    <Badge
                      variant='light'
                      color='gray'
                      size='sm'
                      styles={{
                        root: {
                          border: '1px solid '
                        }
                      }}
                      classNames={{
                        root: `!rounded-md !border-[#e5e5e5] !font-bold text-black hover:bg-mainColor/10 hover:text-black data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`
                      }}
                    >
                      {formatDateViVN(banner.createdAt)}
                    </Badge>

                    <Group justify='space-between' gap='xs'>
                      <BButton leftSection={<IconEye size={16} />} onClick={() => setViewBanner(banner)} flex={1}>
                        Xem
                      </BButton>

                      <ActionIcon
                        variant='light'
                        color='red'
                        radius='md'
                        loading={loading?.type === 'delete' && loading.value}
                        onClick={() =>
                          handleDeleteBanner(banner.id, dataClient[index - 1]?.id || dataClient[index + 1]?.id)
                        }
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Stack>
                </Card>
              ))}
            </Box>
          )}
        </Box>
        <CarouselBanner
          banner1={watch('banner1')}
          banner2={watch('banner2')}
          galleries={watch('gallery')}
          previewUrls={previewUrls}
          setValue={setValue}
        />

        <Box hidden>
          <Controller
            name='gallery'
            control={control}
            rules={{
              required: 'File hoặc URL là bắt buộc',
              validate: files =>
                files.every(file => ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type))
                  ? true
                  : 'Only PNG, JPEG, or JPG files are allowed'
            }}
            render={({ field }) => (
              <FileInput
                id='gallery'
                leftSection={<ActionIcon size='xs' color='gray' variant='transparent' component={IconFile} />}
                label='Ảnh bổ sung'
                placeholder='Chọn một file'
                leftSectionPointerEvents='none'
                value={field.value as unknown as File[]}
                onChange={value => {
                  field.onChange([...value]);
                }}
                onBlur={field.onBlur}
                error={errors.banner1?.message}
                accept='image/png,image/jpeg,image/jpg'
                multiple
              />
            )}
          />
        </Box>

        <Box hidden>
          <Controller
            name='banner1'
            control={control}
            rules={{
              required: 'File hoặc URL là bắt buộc',
              validate: file =>
                file instanceof File && ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
                  ? true
                  : 'Only PNG, JPEG, or JPG files are allowed'
            }}
            render={({ field }) => (
              <FileInput
                id='banner1'
                leftSection={<ActionIcon size='xs' color='gray' variant='transparent' component={IconFile} />}
                label='Ảnh chính'
                placeholder='Chọn một file'
                leftSectionPointerEvents='none'
                value={field.value as unknown as File}
                onChange={value => {
                  field.onChange(value);
                }}
                onBlur={field.onBlur}
                error={errors.banner1?.message}
                accept='image/png,image/jpeg,image/jpg'
              />
            )}
          />
        </Box>
        <Box hidden>
          <Controller
            name='banner2'
            control={control}
            rules={{
              required: 'File hoặc URL là bắt buộc',
              validate: file =>
                file instanceof File && ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
                  ? true
                  : 'Only PNG, JPEG, or JPG files are allowed'
            }}
            render={({ field }) => (
              <FileInput
                id='banner2'
                leftSection={<ActionIcon size='xs' color='gray' variant='transparent' component={IconFile} />}
                label='Ảnh chính'
                placeholder='Chọn một file'
                leftSectionPointerEvents='none'
                value={field.value as unknown as File}
                onChange={value => {
                  field.onChange(value);
                }}
                onBlur={field.onBlur}
                error={errors.banner2?.message}
                accept='image/png,image/jpeg,image/jpg'
              />
            )}
          />
        </Box>
      </form>
    </>
  );
}
