'use client';

import { Button, Grid, GridCol, Group, Modal, Select, Stack, Text, Textarea, Title } from '@mantine/core';

import { EntityType, ImageType } from '@prisma/client';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { ImageInfoInput } from '~/shared/schema/image.info.schema';
import { api } from '~/trpc/react';
import { ConnectedStateWithEntity } from './ImageManager';

interface UploadModalProps {
  connectedState: ConnectedStateWithEntity;
  onClose: () => void;
}
const imageTypes: { label: string; value: ImageType }[] = [
  {
    label: 'Ảnh chính',
    value: 'THUMBNAIL'
  },
  {
    label: 'Ảnh mô tả',
    value: 'GALLERY'
  },
  {
    label: 'Ảnh chưa xác định',
    value: 'OTHER'
  }
];
export function ImageConnectedInfoModal({ connectedState, onClose }: UploadModalProps) {
  const formFields = useForm<ImageInfoInput>({
    defaultValues: {
      id: undefined,
      altText: '',
      entityType: undefined,
      type: undefined
    }
  });
  const utils = api.useUtils();
  const connectImageFromLibraryMutation = api.Images.connectedEntity.useMutation({
    onSuccess: () => {
      connectedState?.onRefetch?.();
      utils.Images.invalidate();
      onClose();
      NotifySuccess('Cập nhật hình ảnh thành công.');
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  const onSubmit: SubmitHandler<ImageInfoInput> = async formData => {
    if (connectedState.entityId && connectedState.imageId) {
      await connectImageFromLibraryMutation.mutateAsync({
        entityId: connectedState.entityId,
        entityType: connectedState.entityType || EntityType.UNASSIGNED,
        images: [
          {
            id: connectedState.imageId,
            type: formData.type || ImageType.OTHER,
            mode: connectedState.mode,
            altText: formData?.altText || 'Ảnh của danh mục',
            imageForEntityId: connectedState.imageForEntityId
          }
        ]
      });
      return;
    }
  };

  return (
    <Modal
      opened={connectedState.opened}
      onClose={onClose}
      title={'Cài đặt thông tin'}
      classNames={{
        title: 'font-quicksand text-2xl font-bold'
      }}
      size={'lg'}
      zIndex={152}
    >
      <FormProvider {...formFields}>
        <form onSubmit={formFields.handleSubmit(onSubmit)}>
          {connectedState.mode === 'connect' ? (
            <>
              <Grid>
                <GridCol span={12}>
                  <Controller
                    name='altText'
                    control={formFields.control}
                    render={({ field }) => <Textarea label='Alt Text' placeholder='Nhập mô tả ảnh...' {...field} />}
                  />
                </GridCol>
                <GridCol span={12}>
                  <Controller
                    name='type'
                    control={formFields.control}
                    defaultValue={connectedState.imageType}
                    render={({ field }) => (
                      <Select
                        label='Loại ảnh'
                        data={imageTypes.map(({ value, label }) => ({ value, label }))}
                        {...field}
                      />
                    )}
                  />
                </GridCol>
              </Grid>
            </>
          ) : (
            <Stack>
              <Title order={3} className='font-quicksand'>
                Xác nhận ngắt kết nối
              </Title>
              <Text size='sm' c={'dimmed'}>
                Xác nhận ngắt kết nối
              </Text>
            </Stack>
          )}
          <Group mt='lg' grow>
            <Button variant='danger' onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button type='submit' loading={formFields.formState.isSubmitting}>
              {connectedState.mode === 'connect' ? 'Kết nối' : 'Ngắt kết nối'}
            </Button>
          </Group>
        </form>
      </FormProvider>
    </Modal>
  );
}
