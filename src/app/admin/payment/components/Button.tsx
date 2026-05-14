'use client';

import { ActionIcon, Button, Modal, Title } from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { onHandleModalAction } from '~/lib/ButtonHandler/ButtonHandleAction';
import { api } from '~/trpc/react';
import PaymentUpsert from './form/PaymentUpsert';

export function CreatePaymentButton() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </Button>
      <Modal
        closeOnClickOutside={false}
        opened={opened}
        size={'xl'}
        zIndex={150}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Tạo phương thức thanh toán
          </Title>
        }
      >
        <PaymentUpsert setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function UpdatePaymentButton({ id }: { id: string }) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <ActionIcon variant='subtle' color='blue' onClick={() => setOpened(true)}>
        <IconEdit size={24} />
      </ActionIcon>
      <Modal
        closeOnClickOutside={false}
        opened={opened}
        zIndex={150}
        onClose={() => setOpened(false)}
        size={'xl'}
        title={
          <Title order={2} className='font-quicksand'>
            Cập nhật phương thức thanh toán
          </Title>
        }
      >
        <PaymentUpsert paymentId={id.toString()} setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function DeletePaymentButton({ id }: { id: string }) {
  const utils = api.useUtils();
  const mutationDelete = api.Payment.delete.useMutation({
    onSuccess: () => {
      utils.Payment.invalidate();
    }
  });
  return (
    <>
      <ActionIcon
        variant='subtle'
        color='red'
        onClick={() => {
          id &&
            onHandleModalAction({
              type: 'delete',
              customProps: {
                onConfirm: async () => {
                  await mutationDelete.mutateAsync({ id });
                }
              }
            });
        }}
      >
        <IconTrash size={24} />
      </ActionIcon>
    </>
  );
}
