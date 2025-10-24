'use client';

import { Modal, ScrollAreaAutosize, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import BButton from '~/components/Button/Button';
import CreateVoucher from './form/CreateVoucher';

export function CreateVoucherButton() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <BButton leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </BButton>
      <Modal
        closeOnClickOutside={false}
        scrollAreaComponent={ScrollAreaAutosize}
        size={'80%'}
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Tạo khuyến mãi
          </Title>
        }
      >
        <CreateVoucher setOpened={setOpened} />
      </Modal>
    </>
  );
}
