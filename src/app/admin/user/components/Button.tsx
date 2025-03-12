'use client';
import { ActionIcon, Button, Modal, Title } from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { handleDelete } from '~/app/lib/utils/button-handle/ButtonDeleteConfirm';
import { api } from '~/trpc/react';
import CreateUser from './form/CreateUser';
import UpdateUser from './form/UpdateUser';

export function CreateUserButton() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </Button>
      <Modal
        closeOnClickOutside={false}
        size='100%'
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Title order={2}>Tạo người dùng</Title>}
      >
        <CreateUser setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function UpdateUserButton({ email, isClient = false }: { email: string; isClient?: boolean }) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <ActionIcon variant='subtle' color='blue' onClick={() => setOpened(true)}>
        <IconEdit size={24} />
      </ActionIcon>
      <Modal
        closeOnClickOutside={false}
        size='100%'
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Title order={2}>Cập nhật người dùng</Title>}
      >
        <UpdateUser email={email.toString()} setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function DeleteUserButton({ id }: { id: string }) {
  const untils = api.useUtils();
  const deleteMutation = api.User.delete.useMutation();

  return (
    <>
      <ActionIcon
        variant='subtle'
        color='red'
        onClick={() => {
          handleDelete({ id }, deleteMutation, 'Sản phẩm', () => {
            untils.User.invalidate();
          });
        }}
      >
        <IconTrash size={24} />
      </ActionIcon>
    </>
  );
}
