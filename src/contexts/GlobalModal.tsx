'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { useModal } from './ModalContext';

const ModalProductComments = dynamic(() => import('~/components/Modals/ModalProductComments'));

const ModalProductDetails = dynamic(() => import('~/components/Modals/ModalProductDetails'));

const ModalOrderDetails = dynamic(() => import('~/components/Modals/ModalOrderDetails'));

const ModalSuccessAddToCart = dynamic(() => import('~/components/Modals/ModalSuccessAddCart'));

const ModalRecipe = dynamic(() => import('~/components/Modals/ModalRecipe'));

const ModalDetailVoucher = dynamic(() => import('~/components/Modals/ModalVoucherDetail'));

export const GlobalModal: React.FC = () => {
  const { opened, modalType, modalData, closeModal } = useModal();

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
