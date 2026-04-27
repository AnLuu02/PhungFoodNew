'use client';

import { Group, Modal, ScrollAreaAutosize, ThemeIcon, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { EntityType, ImageType } from '@prisma/client';
import { IconPictureInPicture } from '@tabler/icons-react';
import ImageManager from '~/app/admin/images/components/ImageManager';
import { ModalProps } from '~/types/modal';
export interface ConnectedModalPayload {
  entityId?: string;
  entityType: EntityType;
  initImageType: ImageType;
  onRefetch: () => void;
}
function ModalImageLibrary({ type, opened, onClose }: ModalProps<ConnectedModalPayload>) {
  const isDesktop = useMediaQuery(`(min-width:1024px)`);
  return (
    <>
      <Modal
        scrollAreaComponent={ScrollAreaAutosize}
        opened={opened && type === 'images_library'}
        onClose={onClose}
        size={!isDesktop ? '100%' : '90%'}
        fullScreen
        transitionProps={{ transition: 'fade-down', duration: 200 }}
        padding='md'
        zIndex={151}
        title={
          <Group gap='md'>
            <ThemeIcon size={40} variant='light' color='teal'>
              <IconPictureInPicture style={{ width: 24, height: 24 }} />
            </ThemeIcon>
            <Title order={2} className='font-quicksand'>
              Thư viện
            </Title>
          </Group>
        }
        pos={'relative'}
        styles={{
          header: {},
          content: {
            overflow: 'hidden'
          }
        }}
      >
        {type === 'images_library' && <ImageManager mode={'library'} />}
      </Modal>
    </>
  );
}

export default ModalImageLibrary;
