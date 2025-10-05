'use client';

import { Button, Modal, ScrollAreaAutosize, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import CreateVoucher from './form/CreateVoucher';

export function CreateVoucherButton() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)} radius='md' bg='#195EFE'>
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
            Tạo khuyến mãi
          </Title>
        }
      >
        <CreateVoucher setOpened={setOpened} />
      </Modal>
    </>
  );
}
