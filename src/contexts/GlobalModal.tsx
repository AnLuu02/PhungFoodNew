'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { useModal } from './ModalContext';

const ModalProductComments = dynamic(() => import('~/components/Modals/ModalProductComments'), { ssr: false });

const ModalProductDetails = dynamic(() => import('~/components/Modals/ModalProductDetails'), { ssr: false });

const ModalOrderDetails = dynamic(() => import('~/components/Modals/ModalOrderDetails'), { ssr: false });

const ModalSuccessAddToCart = dynamic(() => import('~/components/Modals/ModalSuccessAddCart'), { ssr: false });

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
      <ModalSuccessAddToCart
        type={modalType}
        opened={opened && modalType === 'success'}
        onClose={closeModal}
        product={modalData}
      />
    </>
  );
};
