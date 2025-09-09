'use client';
import { ActionIcon, Button, Modal, Title } from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { confirmDelete } from '~/lib/button-handle/ButtonDeleteConfirm';
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
        title={
          <Title order={2} className='font-quicksand'>
            Tạo người dùng
          </Title>
        }
      >
        <CreateUser setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function UpdateUserButton({
  email,
  openedFromClient,
  setOpenedFromClient
}: {
  email: string;
  openedFromClient?: boolean;
  setOpenedFromClient?: any;
}) {
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    if (openedFromClient) {
      setOpened(true);
    }
  }, [openedFromClient]);
  return (
    <>
      <ActionIcon variant='subtle' color='blue' onClick={() => setOpened(true)}>
        <IconEdit size={24} />
      </ActionIcon>
      <Modal
        closeOnClickOutside={false}
        size='100%'
        opened={opened}
        onClose={() => {
          setOpened(false);
          openedFromClient && setOpenedFromClient?.(false);
        }}
        title={
          <Title order={2} className='font-quicksand'>
            Cập nhật người dùng
          </Title>
        }
      >
        <UpdateUser email={email.toString()} setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function DeleteUserButton({ id }: { id: string }) {
  const utils = api.useUtils();
  const mutationDelete = api.User.delete.useMutation();

  return (
    <>
      <ActionIcon
        variant='subtle'
        color='red'
        onClick={() => {
          confirmDelete({
            id: { id },
            mutationDelete,
            entityName: 'người dùng',
            callback: () => {
              utils.User.invalidate();
            }
          });
        }}
      >
        <IconTrash size={24} />
      </ActionIcon>
    </>
  );
}
