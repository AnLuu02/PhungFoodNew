'use client';

import { ActionIcon, Button, Modal, ScrollAreaAutosize, Title } from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { handleDelete } from '~/app/lib/utils/button-handle/ButtonDeleteConfirm';
import { api } from '~/trpc/react';
import CreateVoucher from './form/CreateVoucher';
import UpdateVoucher from './form/UpdateVoucher';

export function CreateVoucherButton() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </Button>
      <Modal
        scrollAreaComponent={ScrollAreaAutosize}
        size={'xl'}
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Title order={2}>Tạo voucher</Title>}
      >
        <CreateVoucher setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function UpdateVoucherButton({ id }: { id: string }) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <ActionIcon variant='subtle' color='blue' onClick={() => setOpened(true)}>
        <IconEdit size={24} />
      </ActionIcon>
      <Modal
        size={'xl'}
        scrollAreaComponent={ScrollAreaAutosize}
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Title order={2}>Cập nhật voucher</Title>}
      >
        <UpdateVoucher voucherId={id.toString()} setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function DeleteVoucherButton({ id }: { id: string }) {
  const untils = api.useUtils();
  const deleteMutation = api.Voucher.delete.useMutation();

  return (
    <>
      <ActionIcon
        variant='subtle'
        color='red'
        onClick={() => {
          handleDelete({ id }, deleteMutation, 'voucher', () => {
            untils.Voucher.invalidate();
          });
        }}
      >
        <IconTrash size={24} />
      </ActionIcon>
    </>
  );
}
