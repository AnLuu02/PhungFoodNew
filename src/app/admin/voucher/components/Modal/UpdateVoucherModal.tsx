'use client';

import { Modal, ScrollAreaAutosize, Title } from '@mantine/core';
import { Dispatch, SetStateAction } from 'react';
import { VoucherFind } from '~/types/client-type-trpc';
import UpdateVoucher from '../form/UpdateVoucher';

export const UpdateVoucherModal = ({
  selectedPromotion,
  setSelectedPromotion
}: {
  selectedPromotion: {
    type: 'edit' | 'view';
    data: NonNullable<VoucherFind>['vouchers'][0];
  } | null;
  setSelectedPromotion: Dispatch<
    SetStateAction<{
      type: 'edit' | 'view';
      data: NonNullable<VoucherFind>['vouchers'][0];
    } | null>
  >;
}) => {
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
