'use client';
import { ActionIcon, AspectRatio, Box, FileButton, Image, Stack, Text } from '@mantine/core';
import { IconEdit, IconTrash, IconUpload } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export default function ThumbnailUpsert({ nameField, size }: { nameField: string; size?: number | string }) {
  const {
    control,
    watch,
    reset,
    setValue,
    formState: { errors }
  } = useFormContext();
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);
  const imageFileThumbValue = watch(`${nameField + '.'}urlFile`);
  const imageThumbUrlValue = watch(`${nameField + '.'}url`);

  useEffect(() => {
    if (imageFileThumbValue instanceof File) {
      const url = URL.createObjectURL(imageFileThumbValue);
      setPreviewThumbnail(url);
      return () => URL.revokeObjectURL(url);
    } else if (imageThumbUrlValue) {
      setPreviewThumbnail(imageThumbUrlValue);
    }
  }, [imageFileThumbValue, imageThumbUrlValue]);

  return (
    <>
      <Controller
        name={`${nameField + '.'}urlFile`}
        control={control}
        render={({ field }) => (
          <Stack gap='xs' w={size || 200}>
            <Box className='group relative'>
              <AspectRatio ratio={1 / 1}>
                {previewThumbnail ? (
                  <Box className='relative overflow-hidden rounded-xl border-2 border-blue-100'>
                    <Image src={previewThumbnail} alt='Preview' className='h-full w-full object-cover' />

                    <div className='absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100'>
                      <FileButton onChange={field.onChange} accept='image/png,image/jpeg'>
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
                        onClick={() => {
                          setPreviewThumbnail(null);
                          nameField
                            ? setValue(
                                nameField,
                                {
                                  url: undefined,
                                  urlFile: undefined,
                                  publicId: undefined
                                },
                                {
                                  shouldDirty: true,
                                  shouldValidate: true
                                }
                              )
                            : reset({
                                url: undefined,
                                urlFile: undefined,
                                publicId: undefined
                              });
                        }}
                        title='Xóa ảnh'
                      >
                        <IconTrash size={20} />
                      </ActionIcon>
                    </div>
                  </Box>
                ) : (
                  <FileButton onChange={field.onChange} accept='image/png,image/jpeg'>
                    {props => (
                      <button
                        {...props}
                        type='button'
                        className='flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 transition-all hover:border-blue-400 hover:bg-gray-100 dark:bg-dark-card'
                      >
                        <IconUpload size={32} className='text-gray-400' />
                        <Box className='text-center'>
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
                )}
              </AspectRatio>
            </Box>
            {errors?.[nameField]?.message && (
              <Text c='red' size='xs' mt={4}>
                File không hợp lệ. Vui lòng kiểm tra lại.
              </Text>
            )}
          </Stack>
        )}
      />
    </>
  );
}
