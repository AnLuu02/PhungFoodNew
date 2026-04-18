'use client';

import { Carousel } from '@mantine/carousel';
import { ActionIcon, Box, FileInput, Flex, Image, Paper, Text, Tooltip } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconFile, IconPlus, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { ImageAddition } from '../../../../product/components/form/GalleryUpsert';

export const CarouselGallery = ({
  onDeleted,
  galleries,
  mode = 'edit'
}: {
  onDeleted?: (value: string[]) => void;
  galleries?: any;
  mode?: 'view' | 'edit';
}) => {
  const formFields = useFormContext();
  const [galleryAddition, setGalleryAddition] = useState<ImageAddition[] | null>(null);
  const [delPublicIds, serDelPublicIds] = useState<string[]>([]);
  const galleryFromDb = formFields.watch('gallery');
  const galleryFileInput = formFields.watch('galleryInput');

  useEffect(() => {
    const currentData = mode == 'edit' ? galleryFromDb : galleries;
    if (currentData) {
      setGalleryAddition([
        ...currentData.map((imageForEntity: any) => ({
          imageForEntityId: imageForEntity?.id,
          image: {
            url: imageForEntity?.image?.url,
            publicId: imageForEntity?.image?.publicId
          },
          status: imageForEntity?.status
        }))
      ]);
    } else {
      setGalleryAddition(null);
    }
  }, [galleryFromDb, galleries]);

  useEffect(() => {
    if (mode == 'edit' && !galleryFileInput && !galleryFromDb) {
      setGalleryAddition(null);
    }
  }, [galleryFileInput]);

  useEffect(() => {
    if (delPublicIds && delPublicIds?.length > 0) {
      onDeleted?.(delPublicIds);
    }
  }, [delPublicIds]);

  useEffect(() => {
    if (mode == 'edit') {
      if (galleryAddition) {
        formFields.setValue('galleryInput', galleryAddition?.map(({ image: { file } }) => file).filter(Boolean));
      } else {
        setGalleryAddition(null);
        formFields.setValue('galleryInput', null);
      }
    }
  }, [galleryAddition]);

  const handleDeleteGallery = (index: number, imageForEntityId?: string) => {
    setGalleryAddition(prev => (prev ? prev.filter((_, i) => i !== index) : []));
    serDelPublicIds((prev: string[]) => [...(prev ? prev : []), ...(imageForEntityId ? [imageForEntityId] : [])]);
  };

  return (
    <>
      <Box w={{ base: '100%', lg: '66.666667%' }}>
        {Array.isArray(galleryAddition) && galleryAddition.length > 0 ? (
          <Carousel
            withControls
            withIndicators
            loop
            nextControlIcon={<IconChevronRight size={30} />}
            previousControlIcon={<IconChevronLeft size={30} />}
            controlSize={40}
            color='black'
            classNames={{
              control: 'border-none bg-white/80',
              indicators: 'bottom-4',
              indicator: 'mx-[6px] h-[8px] w-[20px] rounded-full bg-mainColor'
            }}
          >
            {galleryAddition.map(({ imageForEntityId, image: { file, url, publicId } }, index) => {
              const curUrl = file ? URL.createObjectURL(file) : url;

              return (
                <Carousel.Slide key={index} className='rounded-md'>
                  <Box className='relative h-[400px] overflow-hidden rounded-md bg-gradient-to-b from-[#E1F5FE] to-[#FFF9C4]'>
                    <Image
                      src={curUrl}
                      onLoad={() => (curUrl && file ? URL.revokeObjectURL(curUrl) : null)}
                      alt={`gallery-${index}`}
                      w={'100%'}
                      h='100%'
                      className='rounded-md object-fill'
                    />
                    {mode === 'edit' && (
                      <Tooltip label={'Xóa'} withArrow>
                        <ActionIcon
                          onClick={() => handleDeleteGallery(index, imageForEntityId)}
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
                    )}
                  </Box>
                </Carousel.Slide>
              );
            })}
          </Carousel>
        ) : (
          <Paper radius={'md'} className='relative h-[400px] overflow-hidden hover:bg-[rgba(0,0,0,0.1)]' withBorder>
            <label htmlFor='galleryInput' className='cursor-pointer'>
              <Flex w={'100%'} h={'100%'} align={'center'} justify={'center'} direction={'column'} gap={10}>
                <IconPlus size={20} />
                <Text>Thêm ảnh</Text>
              </Flex>
            </label>
          </Paper>
        )}
        <Box hidden>
          <Controller
            name='galleryInput'
            control={formFields.control}
            rules={{
              required: 'File hoặc URL là bắt buộc',
              validate: files =>
                files && files.every((file: File) => ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type))
                  ? true
                  : 'Only PNG, JPEG, or JPG files are allowed'
            }}
            render={({ field, formState: { errors } }) => (
              <FileInput
                id='galleryInput'
                leftSection={<ActionIcon size='xs' color='gray' variant='transparent' component={IconFile} />}
                label='Ảnh bổ sung'
                placeholder='Chọn một file'
                leftSectionPointerEvents='none'
                value={field.value as unknown as File[]}
                onChange={value => {
                  field.onChange(value);
                  setGalleryAddition(valueCurrent => [
                    ...(valueCurrent ?? []),
                    ...(value ? value.map(file => ({ image: { file } })) : [])
                  ]);
                }}
                onBlur={field.onBlur}
                error={errors.root?.message}
                accept='image/png,image/jpeg,image/jpg'
                multiple
              />
            )}
          />
        </Box>
      </Box>
    </>
  );
};
