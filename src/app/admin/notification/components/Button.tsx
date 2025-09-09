'use client';

import { ActionIcon, Button, Modal, Title } from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { confirmDelete } from '~/lib/button-handle/ButtonDeleteConfirm';
import { api } from '~/trpc/react';
import CreateNotification from './form/CreateNotification';
import UpdateNotification from './form/UpdateNotification';

export function CreateNotificationButton() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </Button>
      <Modal
        size='xl'
        closeOnClickOutside={false}
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Tạo danh mục
          </Title>
        }
      >
        <CreateNotification setOpened={setOpened} />
      </Modal>
    </>
  );
}
export function UpdateNotificationButton({ id }: { id: string }) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <ActionIcon variant='subtle' color='blue' onClick={() => setOpened(true)}>
        <IconEdit size={24} />
      </ActionIcon>
      <Modal
        size='xl'
        closeOnClickOutside={false}
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Cập nhật danh mục
          </Title>
        }
      >
        <UpdateNotification notificationId={id.toString()} setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function DeleteNotificationButton({ id }: { id: string }) {
  const utils = api.useUtils();
  const mutationDelete = api.Notification.delete.useMutation();
  return (
    <>
      <ActionIcon
        variant='subtle'
        color='red'
        onClick={() => {
          confirmDelete({
            id: { id },
            mutationDelete,
            entityName: 'thông báo',
            callback: () => {
              utils.Notification.invalidate();
            }
          });
        }}
      >
        <IconTrash size={24} />
      </ActionIcon>
    </>
  );
}
