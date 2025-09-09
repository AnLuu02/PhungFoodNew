'use client';

import { ActionIcon, Button, Modal, ScrollAreaAutosize, Title } from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { confirmDelete } from '~/lib/button-handle/ButtonDeleteConfirm';
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
        closeOnClickOutside={false}
        scrollAreaComponent={ScrollAreaAutosize}
        size={'80%'}
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Tạo voucher
          </Title>
        }
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
        closeOnClickOutside={false}
        size={'xl'}
        scrollAreaComponent={ScrollAreaAutosize}
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Cập nhật voucher
          </Title>
        }
      >
        <UpdateVoucher voucherId={id.toString()} setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function DeleteVoucherButton({ id }: { id: string }) {
  const utils = api.useUtils();
  const mutationDelete = api.Voucher.delete.useMutation();

  return (
    <>
      <ActionIcon
        variant='subtle'
        color='red'
        onClick={() => {
          confirmDelete({
            id: { id },
            mutationDelete,
            entityName: 'khuyến mãi',
            callback: () => {
              utils.Voucher.invalidate();
            }
          });
        }}
      >
        <IconTrash size={24} />
      </ActionIcon>
    </>
  );
}
