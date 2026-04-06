'use client';

import { Grid, GridCol, Group, Modal, Select, Textarea, Title } from '@mantine/core';

import { EntityType, ImageType } from '@prisma/client';
import { useState } from 'react';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';

import ThumbnailUpsert from '~/components/ImageFormUpsert';
import { handleUploadFromClient } from '~/lib/Cloudinary/client';
import { NotifyError } from '~/lib/FuncHandler/toast';
import { ImageInput } from '~/shared/schema/image.schema';
import { api } from '~/trpc/react';

interface UploadModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UploadModal({ opened, onClose, onSuccess }: UploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);

  const imageTypes: ImageType[] = ['PRODUCT', 'CATEGORY', 'BANNER', 'USER', 'RESTAURANT', 'OTHER'];
  const entityTypes: EntityType[] = ['PRODUCT', 'CATEGORY', 'BANNER', 'USER', 'RESTAURANT', 'UNASSIGNED'];

  const formFields = useForm<ImageInput>({
    defaultValues: {
      url: undefined,
      urlFile: undefined,
      altText: '',
      type: 'OTHER',
      entityType: 'UNASSIGNED'
    }
  });

  const file = formFields.watch('urlFile');

  const mutationUpload = api.Images.upsert.useMutation({
    onSuccess: () => {
      onSuccess?.();
      formFields.reset();
      onClose();
    },
    onError: e => NotifyError(e.message)
  });

  const utils = api.useUtils();

  const onSubmit: SubmitHandler<ImageInput> = async formData => {
    if (!formData.urlFile) return;

    setIsUploading(true);
    try {
      const imageToSave = await handleUploadFromClient(formData.urlFile, utils, {
        folder: formData.entityType + '/' + formData.type
      });

      if (imageToSave) {
        await mutationUpload.mutateAsync({
          ...imageToSave,
          altText: formData?.altText || 'Ảnh chưa có mô tả.',
          url: imageToSave?.url || '',
          type: formData.type,
          entityType: formData.entityType
        });
      }
    } finally {
      setIsUploading(false);
    }
  };
  console.log(file);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Title order={3} className='font-quicksand'>
          Tải ảnh lên
        </Title>
      }
      size='lg'
      radius={'md'}
    >
      <FormProvider {...formFields}>
        <form onSubmit={formFields.handleSubmit(onSubmit)}>
          <Grid>
            <GridCol span={7}>
              <Controller
                name='altText'
                control={formFields.control}
                render={({ field }) => (
                  <Textarea
                    label='Alt Text'
                    placeholder='Nhập mô tả ảnh...'
                    mt='md'
                    disabled={isUploading}
                    {...field}
                  />
                )}
              />

              <Controller
                name='type'
                control={formFields.control}
                render={({ field }) => (
                  <Select
                    label='Image Type'
                    mt='md'
                    data={imageTypes.map(t => ({ value: t, label: t }))}
                    disabled={isUploading}
                    {...field}
                  />
                )}
              />

              <Controller
                name='entityType'
                control={formFields.control}
                render={({ field }) => (
                  <Select
                    label='Entity Type'
                    mt='md'
                    data={entityTypes.map(t => ({ value: t, label: t }))}
                    disabled={isUploading}
                    {...field}
                  />
                )}
              />
            </GridCol>
            <GridCol span={5}>
              {/* <Dropzone
                onDrop={files => formFields.setValue('urlFile', files[0] as File)}
                onReject={() => NotifyError('File không hợp lệ')}
                maxFiles={1}
                accept={['image/*']}
                disabled={isUploading}
              >
              </Dropzone> */}
              <ThumbnailUpsert nameField='' size={'100%'} />
            </GridCol>
          </Grid>

          <Group mt='lg' grow>
            <BButton variant='default' onClick={onClose} disabled={isUploading}>
              Hủy bỏ
            </BButton>
            <BButton type='submit' loading={isUploading} disabled={!file}>
              Tải lên
            </BButton>
          </Group>
        </form>
      </FormProvider>
    </Modal>
  );
}
