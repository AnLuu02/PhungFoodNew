'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Carousel } from '@mantine/carousel';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  FileInput,
  Flex,
  Group,
  Image,
  Paper,
  Stack,
  Switch,
  Text,
  Tooltip
} from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconFile, IconPlus, IconTrash } from '@tabler/icons-react';
import { useEffect, useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { fileToBase64, vercelBlobToFile } from '~/lib/func-handler/handle-file-upload';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { LocalImageType } from '~/lib/zod/EnumType';
import { bannerSchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { Banner } from '~/types/restaurant';

export default function BannerManagement({ data }: any) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    setValue
  } = useForm<Banner>({
    resolver: zodResolver(bannerSchema),
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
      utils.Product.invalidate();
    }
  });
  const mutationUpdate = api.Restaurant.updateBanner.useMutation({
    onSuccess: () => {
      utils.Product.invalidate();
    }
  });
  useEffect(() => {
    if (data?.id) {
      const banners: string[] = [];
      const gallery: string[] = [];

      data.images.forEach((image: any) => {
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
        id: data.id,
        startDate: data.startDate || new Date(),
        endDate: data.endDate || new Date(),
        isActive: data.isActive
      });
    }
  }, [data]);
  const onSubmit: SubmitHandler<Banner> = async formData => {
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

      const result = data?.id
        ? await mutationUpdate.mutateAsync({ ...payload, id: data.id })
        : await mutationCreate.mutateAsync(payload);

      result.success ? NotifySuccess(result.message) : NotifyError(result.message);
    } catch (error) {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  };

  const previewUrls = useMemo(
    () => watch('gallery')?.map(image => (image instanceof File ? URL.createObjectURL(image) : image)) || [],
    [watch('gallery')]
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Group justify='flex-end' mb='md'>
          <Paper withBorder radius='md' p='md'>
            <Controller
              name='isActive'
              control={control}
              render={({ field }) => (
                <Switch
                  label={
                    <Group>
                      <Badge color={field.value ? 'green' : 'red'}>{field.value ? 'Hiển thị' : 'Ẩn'}</Badge>
                    </Group>
                  }
                  checked={field.value}
                  onChange={e => field.onChange(e.currentTarget.checked)}
                  error={errors.isActive?.message}
                />
              )}
            />
          </Paper>
          <Button loading={isSubmitting} type='submit'>
            Lưu
          </Button>
        </Group>
        <Stack mb={'xl'}>
          <Flex gap='md' direction={{ base: 'column', lg: 'row' }}>
            <Box w={{ base: '100%', lg: '66.666667%' }}>
              {watch('gallery') && watch('gallery').length > 0 ? (
                <Carousel
                  withControls
                  withIndicators
                  loop
                  nextControlIcon={<IconChevronRight size={24} />}
                  previousControlIcon={<IconChevronLeft size={24} />}
                  controlSize={40}
                  color='black'
                  classNames={{
                    control: 'border-none bg-white/80',
                    indicators: 'bottom-4',
                    indicator: 'mx-[6px] h-[8px] w-[20px] rounded-full bg-mainColor'
                  }}
                >
                  {previewUrls.map((src: any, index: number) => (
                    <Carousel.Slide key={index} className='rounded-md'>
                      <Box className='relative h-[400px] overflow-hidden rounded-md bg-gradient-to-b from-[#E1F5FE] to-[#FFF9C4]'>
                        <Image src={src} alt={`gallery-${index}`} w={'100%'} h='100%' className='rounded-md' />
                        <Tooltip label={'Xóa'} withArrow>
                          <ActionIcon
                            onClick={() => {
                              const newGalleryImages = watch('gallery')!.filter((_, i) => i !== index);
                              setValue('gallery', newGalleryImages);
                            }}
                            variant='subtle'
                            bg={'rgba(0, 0, 0, 0.5)'}
                            color='white'
                            pos={'absolute'}
                            top={10}
                            right={10}
                            className='z-[10]'
                          >
                            <IconTrash size={24} />
                          </ActionIcon>
                        </Tooltip>
                      </Box>
                    </Carousel.Slide>
                  ))}
                </Carousel>
              ) : (
                <Paper
                  radius={'md'}
                  className='relative h-[400px] overflow-hidden hover:bg-[rgba(0,0,0,0.1)]'
                  withBorder
                >
                  <label htmlFor='gallery' className='cursor-pointer'>
                    <Flex w={'100%'} h={'100%'} align={'center'} justify={'center'} direction={'column'} gap={10}>
                      <IconPlus size={20} />
                      <Text>Thêm ảnh</Text>
                    </Flex>
                  </label>
                </Paper>
              )}
            </Box>

            {/* Right side - Static banners */}
            <Flex direction='column' align='center' justify='space-between' w={{ base: '100%', lg: '33.333333%' }}>
              {/* Top banner */}

              <Paper
                w={'100%'}
                h={190}
                radius={'md'}
                className='relative h-[400px] overflow-hidden hover:bg-[rgba(0,0,0,0.1)]'
                withBorder
              >
                {watch('banner1') ? (
                  <>
                    <Image
                      src={
                        watch('banner1') && watch('banner1') instanceof File
                          ? URL.createObjectURL(watch('banner1') as unknown as File)
                          : watch('banner1')
                      }
                      w={'100%'}
                      h='100%'
                    />
                    <Tooltip label={'Xóa'} withArrow>
                      <ActionIcon
                        onClick={() => {
                          setValue('banner1', null);
                        }}
                        variant='subtle'
                        bg={'rgba(0, 0, 0, 0.9)'}
                        color='white'
                        pos={'absolute'}
                        top={10}
                        right={10}
                        className='z-[10]'
                      >
                        <IconTrash size={24} />
                      </ActionIcon>
                    </Tooltip>
                  </>
                ) : (
                  <label htmlFor='banner1' className='h-[190px] w-full cursor-pointer'>
                    <Flex w={'100%'} h={'100%'} align={'center'} justify={'center'} direction={'column'} gap={10}>
                      <IconPlus size={20} />
                      <Text>Thêm ảnh</Text>
                    </Flex>
                  </label>
                )}
              </Paper>

              {/* Bottom banner */}

              <Paper
                w={'100%'}
                h={190}
                radius={'md'}
                className='relative h-[400px] overflow-hidden hover:bg-[rgba(0,0,0,0.1)]'
                withBorder
              >
                {watch('banner2') ? (
                  <>
                    <Image
                      src={
                        watch('banner2') && watch('banner2') instanceof File
                          ? URL.createObjectURL(watch('banner2') as unknown as File)
                          : watch('banner2')
                      }
                      w={'100%'}
                      h='100%'
                    />
                    <Tooltip label={'Xóa'} withArrow>
                      <ActionIcon
                        onClick={() => {
                          setValue('banner2', null);
                        }}
                        variant='subtle'
                        color='white'
                        bg={'rgba(0, 0, 0, 0.9)'}
                        pos={'absolute'}
                        top={10}
                        right={10}
                        className='z-[10]'
                      >
                        <IconTrash size={24} />
                      </ActionIcon>
                    </Tooltip>
                  </>
                ) : (
                  <label htmlFor='banner2' className='h-[190px] w-full cursor-pointer'>
                    <Flex w={'100%'} h={'100%'} align={'center'} justify={'center'} direction={'column'} gap={10}>
                      <IconPlus size={20} />
                      <Text>Thêm ảnh</Text>
                    </Flex>
                  </label>
                )}
              </Paper>
            </Flex>
          </Flex>
        </Stack>

        <Box hidden>
          <Controller
            name='gallery'
            control={control}
            rules={{
              required: 'File or URL is required',
              validate: files =>
                files.every(file => ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type))
                  ? true
                  : 'Only PNG, JPEG, or JPG files are allowed'
            }}
            render={({ field }) => (
              <FileInput
                id='gallery'
                leftSection={<ActionIcon size='sx' color='gray' variant='transparent' component={IconFile} />}
                label='Ảnh bổ sung'
                placeholder='Choose a file'
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
              required: 'File or URL is required',
              validate: file =>
                file instanceof File && ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
                  ? true
                  : 'Only PNG, JPEG, or JPG files are allowed'
            }}
            render={({ field }) => (
              <FileInput
                id='banner1'
                leftSection={<ActionIcon size='sx' color='gray' variant='transparent' component={IconFile} />}
                label='Ảnh chính'
                placeholder='Choose a file'
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
              required: 'File or URL is required',
              validate: file =>
                file instanceof File && ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
                  ? true
                  : 'Only PNG, JPEG, or JPG files are allowed'
            }}
            render={({ field }) => (
              <FileInput
                id='banner2'
                leftSection={<ActionIcon size='sx' color='gray' variant='transparent' component={IconFile} />}
                label='Ảnh chính'
                placeholder='Choose a file'
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
