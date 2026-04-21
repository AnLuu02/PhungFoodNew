'use client';
import { ActionIcon, AspectRatio, Box, FileButton, Flex, Image, Stack, Text } from '@mantine/core';
import { IconEdit, IconTrash, IconUpload } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StatusImage } from '~/shared/schema/image.info.schema';
export type ImageAddition = {
  imageForEntityId?: string;
  image: {
    file?: File;
    url?: string;
    publicId?: string;
  };
  status?: StatusImage;
};
export default function GalleryUpsert({ onDeleted }: { onDeleted: (imgIds: string[]) => void }) {
  const [imageAddition, setImageAddition] = useState<ImageAddition[] | null>(null);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const formFields = useFormContext();
  const imageGalleryValue = formFields.getValues('gallery');

  useEffect(() => {
    if (imageGalleryValue) {
      setImageAddition([
        ...imageGalleryValue.map((imageForEntity: any) => ({
          imageForEntityId: imageForEntity?.id,
          image: {
            url: imageForEntity?.image?.url,
            publicId: imageForEntity?.image?.publicId
          },
          status: imageForEntity?.status
        }))
      ]);
    }
  }, [imageGalleryValue]);

  useEffect(() => {
    if (deletedIds && deletedIds?.length > 0) {
      onDeleted(deletedIds);
    }
  }, [deletedIds]);

  useEffect(() => {
    if (imageAddition) {
      formFields.setValue('galleryInput', imageAddition?.map(({ image: { file } }) => file).filter(Boolean));
    }
  }, [imageAddition]);

  const handleDeleteGalleryItem = (index: number, imageForEntityId?: string) => {
    setImageAddition(prev => (prev ? prev.filter((_, i) => i !== index) : []));
    imageForEntityId && setDeletedIds((prev: string[]) => [...(prev ?? []), imageForEntityId]);
  };
  return (
    <Stack gap={0}>
      <Text size='xl' fw={700}>
        Ảnh bổ sung
      </Text>
      <Flex align={'center'} gap={'xs'} wrap={'wrap'} w={'100%'} pos={'relative'}>
        {Array.isArray(imageAddition) &&
          imageAddition!.map(({ imageForEntityId, image: { file, url, publicId } }, index) => {
            const curUrl = file ? URL.createObjectURL(file) : url;
            return (
              <>
                <Stack gap='xs' w={150}>
                  <Box className='group relative'>
                    <AspectRatio ratio={1 / 1}>
                      <Box className='relative overflow-hidden rounded-xl border-2 border-blue-100'>
                        <Image
                          src={curUrl}
                          alt='Preview'
                          onLoad={() => (curUrl && file ? URL.revokeObjectURL(curUrl) : null)}
                          className='h-full w-full object-cover'
                        />
                        <Box className='absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100'>
                          <FileButton
                            onChange={file => {
                              const target = imageAddition?.[index];
                              if (target && file) {
                                setDeletedIds(prev => [
                                  ...(prev ?? []),
                                  ...(target?.imageForEntityId ? [target?.imageForEntityId] : [])
                                ]);
                                setImageAddition((prev: ImageAddition[] | null) => {
                                  const itemIndex = prev?.find((_, i) => i === index);
                                  if (itemIndex) {
                                    itemIndex.image.file = file;
                                    ((itemIndex.image.url = undefined),
                                      (itemIndex.image.publicId = undefined),
                                      (itemIndex.status = StatusImage.NEW));
                                  }
                                  return [...(prev ?? [])];
                                });
                              }
                            }}
                            accept='image/png,image/jpeg'
                          >
                            {props => (
                              <ActionIcon {...props} variant='white' radius='xl' size='lg' title='Sửa ảnh'>
                                <IconEdit size={20} color='blue' />
                              </ActionIcon>
                            )}
                          </FileButton>
                          <ActionIcon
                            variant='white'
                            radius='xl'
                            size='lg'
                            color='red'
                            onClick={() => handleDeleteGalleryItem(index, imageForEntityId)}
                            title='Xóa ảnh'
                          >
                            <IconTrash size={20} />
                          </ActionIcon>
                        </Box>
                      </Box>
                    </AspectRatio>
                  </Box>
                </Stack>
              </>
            );
          })}

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
            <Box w={150} h={150}>
              <FileButton
                multiple
                onChange={value => {
                  field.onChange(value);
                  setImageAddition(valueCurrent => [
                    ...(valueCurrent ?? []),
                    ...(value ? value.map(file => ({ image: { file } })) : [])
                  ]);
                }}
                accept='image/png,image/jpeg'
              >
                {props => (
                  <button
                    {...props}
                    type='button'
                    className='relative flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 transition-all hover:border-blue-400 hover:bg-gray-100 dark:bg-dark-card'
                  >
                    <IconUpload size={32} className='text-gray-400' />
                    <Box className='relative text-center'>
                      <Text size='sm' fw={600}>
                        Tải ảnh lên
                      </Text>
                      <Text size='xs' c='dimmed'>
                        PNG, JPG tối đa 5MB
                      </Text>
                    </Box>
                  </button>
                )}
              </FileButton>
            </Box>
          )}
        />
      </Flex>
    </Stack>
  );
}
