'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { useModalActions, useModalState } from './ModalContext';

const ModalProductComments = dynamic(() => import('~/components/Modals/ModalProductComments'), { ssr: false });

const ModalProductDetails = dynamic(() => import('~/components/Modals/ModalProductDetails'), { ssr: false });

const ModalOrderDetails = dynamic(() => import('~/components/Modals/ModalOrderDetails'), { ssr: false });

const ModalSuccessAddToCart = dynamic(() => import('~/components/Modals/ModalSuccessAddCart'), { ssr: false });

const ModalRecipe = dynamic(() => import('~/components/Modals/ModalRecipe'), { ssr: false });

const ModalDetailVoucher = dynamic(() => import('~/components/Modals/ModalVoucherDetail'), { ssr: false });

export const GlobalModal: React.FC = () => {
  const { closeModal } = useModalActions();
  const { opened, modalType, modalData } = useModalState();

  return (
    <>
      <ModalProductComments
        type={modalType}
        opened={opened && modalType === 'comments'}
        onClose={closeModal}
        data={modalData}
      />
      <ModalDetailVoucher
        type={modalType}
        opened={opened && modalType === 'voucher'}
        onClose={closeModal}
        data={modalData}
      />
      <ModalProductDetails
        type={modalType}
        opened={opened && modalType === 'details'}
        onClose={closeModal}
        data={modalData}
      />
      <ModalOrderDetails
        type={modalType}
        opened={opened && modalType === 'orders'}
        onClose={closeModal}
        data={modalData}
      />
      <ModalSuccessAddToCart
        type={modalType}
        opened={opened && modalType === 'success'}
        onClose={closeModal}
        data={modalData}
      />
      <ModalRecipe type={modalType} opened={opened && modalType === 'recipe'} onClose={closeModal} data={modalData} />
    </>
  );
};
