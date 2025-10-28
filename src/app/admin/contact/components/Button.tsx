'use client';

import { ActionIcon, Modal } from '@mantine/core';
import { IconMail, IconPhone, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { confirmDelete } from '~/lib/ButtonHandler/ButtonDeleteConfirm';
import { api } from '~/trpc/react';
import MailResponse from './form/MailResponse';

export function SendMailButton({
  userContactInfo
}: {
  userContactInfo: { id: string; email: string; name: string; message: string; responded: boolean };
}) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <ActionIcon variant='subtle' onClick={() => setOpened(true)}>
        <IconMail size={24} />
      </ActionIcon>
      <Modal
        opened={opened}
        closeOnClickOutside={false}
        size={'90%'}
        onClose={() => setOpened(false)}
        classNames={{
          header: 'bg-blue-50 dark:bg-dark-background',
          title: 'text-sm font-bold',
          close: 'font-bold'
        }}
        title='Thư phản hồi'
      >
        <MailResponse setOpenedModal={setOpened} userContactInfo={userContactInfo} />
      </Modal>
    </>
  );
}

export function CallPhoneButton({ phone }: { phone: string }) {
  return (
    <>
      <ActionIcon variant='subtle' component='a' href={`tel:${phone}`}>
        <IconPhone size={24} />
      </ActionIcon>
    </>
  );
}

export function DeleteContactButton({ id }: { id: string }) {
  const utils = api.useUtils();
  const mutationDelete = api.Contact.delete.useMutation();
  return (
    <>
      <ActionIcon
        variant='subtle'
        color='red'
        onClick={() => {
          confirmDelete({
            id: { id },
            mutationDelete,
            entityName: 'nguyên liệu',
            callback: () => {
              utils.Contact.invalidate();
            }
          });
        }}
      >
        <IconTrash size={24} />
      </ActionIcon>
    </>
  );
}
