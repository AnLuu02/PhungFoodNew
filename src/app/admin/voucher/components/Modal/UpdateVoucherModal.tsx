'use client';

import { Modal, ScrollAreaAutosize, Title } from '@mantine/core';
import { Dispatch, SetStateAction } from 'react';
import { FindVoucher } from '~/shared/type-trpc/voucher.type-trpc';
import UpdateVoucher from '../form/UpdateVoucher';

export const UpdateVoucherModal = ({
  selectedPromotion,
  setSelectedPromotion
}: {
  selectedPromotion: {
    type: 'edit' | 'view';
    data: FindVoucher['vouchers'][number];
  } | null;
  setSelectedPromotion: Dispatch<
    SetStateAction<{
      type: 'edit' | 'view';
      data: FindVoucher['vouchers'][number];
    } | null>
  >;
}) => {
  if (!selectedPromotion) return null;

  return (
    <Modal
      closeOnClickOutside={false}
      size={'80%'}
      scrollAreaComponent={ScrollAreaAutosize}
      opened={selectedPromotion !== null && selectedPromotion.type === 'edit'}
      onClose={() => setSelectedPromotion(null)}
      title={
        <Title order={2} className='font-quicksand'>
          {selectedPromotion?.data?.name}
        </Title>
      }
    >
      <UpdateVoucher data={selectedPromotion?.data} setOpened={setSelectedPromotion} />
    </Modal>
  );
};
