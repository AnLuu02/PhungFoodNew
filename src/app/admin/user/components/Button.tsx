'use client';
import { ActionIcon, Modal, Title, Tooltip } from '@mantine/core';
import { IconEdit, IconKey, IconPlus, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import BButton from '~/components/Button/Button';
import { confirmDelete } from '~/lib/button-handle/ButtonDeleteConfirm';
import { api } from '~/trpc/react';
import CreateUser from './form/CreateUser';
import UpdatePermissionUser from './form/UpdatePermissionUser';
import UpdateUser from './form/UpdateUser';

export function CreateUserButton() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <BButton leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </BButton>
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

export function UpdatePermissions({ email }: { email: any }) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Tooltip label='Cập nhật quyền'>
        <ActionIcon variant='transparent' color='black' onClick={() => setOpened(true)}>
          <IconKey size={20} />
        </ActionIcon>
      </Tooltip>
      <Modal
        closeOnClickOutside={false}
        size='70%'
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Quản lý quyền người dùng
          </Title>
        }
      >
        <UpdatePermissionUser email={email} setOpened={setOpened} />
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
      <Tooltip label='Cập nhật người dùng'>
        <ActionIcon variant='subtle' color='blue' onClick={() => setOpened(true)}>
          <IconEdit size={24} />
        </ActionIcon>
      </Tooltip>
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
      <Tooltip label='Xóa người dùng'>
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
      </Tooltip>
    </>
  );
}
