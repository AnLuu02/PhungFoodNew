'use client';

import { ActionIcon, Modal, Title, Tooltip } from '@mantine/core';
import { IconCopy, IconEdit, IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import BButton from '~/components/Button/Button';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { api } from '~/trpc/react';
import CreateRevenue from './form/CreateRevenue';
import UpdateRevenue from './form/UpdateRevenue';

export function CreateRevenueButton() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <BButton leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </BButton>
      <Modal
        closeOnClickOutside={false}
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Tạo doanh thu mẫu
          </Title>
        }
      >
        <CreateRevenue setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function UpdateRevenueButton({ id }: { id: string }) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <ActionIcon variant='subtle' color='blue' onClick={() => setOpened(true)}>
        <IconEdit size={24} />
      </ActionIcon>
      <Modal
        closeOnClickOutside={false}
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Cập nhật doanh thu mẫu
          </Title>
        }
      >
        <UpdateRevenue id={id.toString()} setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function CopyRevenueButton({ data }: { data: any }) {
  const [loading, setLoading] = useState(false);
  const utils = api.useUtils();
  const mutationCreate = api.Revenue.create.useMutation({
    onSuccess: () => {
      utils.Revenue.invalidate();
      NotifySuccess('Copy doanh thu mẫu thành công!');
    },
    onError: e => {
      NotifyError(e?.message || 'Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  });
  return (
    <>
      <Tooltip label='Nhân bản doanh thu mẫu'>
        <ActionIcon
          variant='subtle'
          loading={loading}
          onClick={async () => {
            setLoading(true);
            await mutationCreate.mutateAsync({
              ...data,
              year: Number(data.year) - 1,
              totalSpent: Number(data.totalSpent) || 0,
              id: undefined
            });
            setLoading(false);
          }}
        >
          <IconCopy size={24} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}
