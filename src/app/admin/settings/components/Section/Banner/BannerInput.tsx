'use client';

import { ActionIcon, Box, FileInput, Flex, Image, Paper, Text, Tooltip } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { ImageFromDb } from '~/shared/schema/image.schema';

export default function BannerInputSection({
  mode = 'edit',
  banners
}: {
  mode?: 'view' | 'edit';
  banners?: ImageFromDb[];
}) {
  const formFields = useFormContext();
  const banner_1 = formFields.watch('banner1')?.url ? formFields.watch('banner1') : banners?.[0];
  const banner_2 = formFields.watch('banner2')?.url ? formFields.watch('banner2') : banners?.[1];
  const [previewBanner1, setPreviewBanner1] = useState<string | null>(null);
  const [previewBanner2, setPreviewBanner2] = useState<string | null>(null);
  useEffect(() => {
    formFields.resetField('banner1');
    formFields.resetField('banner2');
  }, []);
  useEffect(() => {
    if (banner_1?.urlFile instanceof File) {
      const url = URL.createObjectURL(banner_1?.urlFile);
      setPreviewBanner1(url);
      return () => URL.revokeObjectURL(url);
    }
    if (banner_1?.url && !banner_1?.urlFile) {
      setPreviewBanner1(banner_1?.url);
    } else {
      setPreviewBanner1(null);
    }
  }, [banner_1?.url, banner_1?.urlFile]);
  useEffect(() => {
    if (banner_2?.urlFile instanceof File) {
      const url = URL.createObjectURL(banner_2?.urlFile);
      setPreviewBanner2(url);
      return () => URL.revokeObjectURL(url);
    }
    if (banner_2?.url && !banner_2?.urlFile) {
      setPreviewBanner2(banner_2?.url);
    } else {
      setPreviewBanner2(null);
    }
  }, [banner_2?.url, banner_2?.urlFile]);
  return (
    <>
      <Flex direction='column' align='center' justify='space-between' w={{ base: '100%', lg: '33.333333%' }}>
        <Paper
          w={'100%'}
          h={190}
          radius={'md'}
          className='relative h-[400px] overflow-hidden hover:bg-[rgba(0,0,0,0.1)]'
          withBorder
        >
          {previewBanner1 ? (
            <>
              <Image src={previewBanner1} w={'100%'} h='100%' className='object-fill' />
              {mode === 'edit' && (
                <Tooltip label={'Xóa'} withArrow>
                  <ActionIcon
                    onClick={() => {
                      setPreviewBanner1(null);
                      formFields.setValue(
                        'banner1',
                        {
                          url: undefined,
                          urlFile: undefined,
                          publicId: ''
                        },
                        {
                          shouldDirty: true,
                          shouldValidate: true
                        }
                      );
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
              )}
            </>
          ) : (
            <label htmlFor='banner1.urlFile' className='h-[190px] w-full cursor-pointer'>
              <Flex w={'100%'} h={'100%'} align={'center'} justify={'center'} direction={'column'} gap={10}>
                <IconPlus size={20} />
                <Text>Thêm ảnh</Text>
              </Flex>
            </label>
          )}
        </Paper>

        <Paper
          w={'100%'}
          h={190}
          radius={'md'}
          className='relative h-[400px] overflow-hidden hover:bg-[rgba(0,0,0,0.1)]'
          withBorder
        >
          {previewBanner2 ? (
            <>
              <Image src={previewBanner2} w={'100%'} h='100%' className='object-fill' />
              {mode === 'edit' && (
                <Tooltip label={'Xóa'} withArrow>
                  <ActionIcon
                    onClick={() => {
                      setPreviewBanner2(null);
                      formFields.setValue(
                        'banner2',
                        {
                          url: undefined,
                          urlFile: undefined,
                          publicId: ''
                        },
                        {
                          shouldDirty: true,
                          shouldValidate: true
                        }
                      );
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
              )}
            </>
          ) : (
            <label htmlFor='banner2.urlFile' className='h-[190px] w-full cursor-pointer'>
              <Flex w={'100%'} h={'100%'} align={'center'} justify={'center'} direction={'column'} gap={10}>
                <IconPlus size={20} />
                <Text>Thêm ảnh</Text>
              </Flex>
            </label>
          )}
        </Paper>
      </Flex>
      <Box hidden>
        <Controller
          name='banner1.urlFile'
          control={formFields.control}
          rules={{
            required: 'File hoặc URL là bắt buộc',
            validate: file =>
              file instanceof File && ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
                ? true
                : 'Only PNG, JPEG, or JPG files are allowed'
          }}
          render={({ field, formState: { errors } }) => (
            <FileInput
              id='banner1.urlFile'
              value={field.value}
              onChange={value => {
                field.onChange(value);
              }}
              onBlur={field.onBlur}
              error={errors.root?.message}
              accept='image/png,image/jpeg,image/jpg'
            />
          )}
        />
      </Box>
      <Box hidden>
        <Controller
          name='banner2.urlFile'
          control={formFields.control}
          rules={{
            required: 'File hoặc URL là bắt buộc',
            validate: file =>
              file instanceof File && ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
                ? true
                : 'Only PNG, JPEG, or JPG files are allowed'
          }}
          render={({ field, formState: { errors } }) => (
            <FileInput
              id='banner2.urlFile'
              value={field.value}
              onChange={value => {
                field.onChange(value);
              }}
              onBlur={field.onBlur}
              error={errors.root?.message}
              accept='image/png,image/jpeg,image/jpg'
            />
          )}
        />
      </Box>
    </>
  );
}
