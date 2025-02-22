'use client';
import React from 'react';
import ModalOrderDetails from '../_components/Modals/ModalOrderDetails';
import ModalProductComments from '../_components/Modals/ModalProductComments';
import ModalProductDetails from '../_components/Modals/ModalProductDetails';
import { useModal } from './ModalContext';

export const GlobalModal: React.FC = () => {
  const { opened, modalType, modalContent, modalData, closeModal } = useModal();
  return (
    <>
      <ModalProductComments
        type={modalType}
        opened={opened && modalType === 'comments'}
        close={closeModal}
        product={modalData}
      />
      <ModalProductDetails
        type={modalType}
        opened={opened && modalType === 'details'}
        close={closeModal}
        product={modalData}
      />
      <ModalOrderDetails
        type={modalType}
        opened={opened && modalType === 'orders'}
        close={closeModal}
        order={modalData}
      />
    </>
  );
};
